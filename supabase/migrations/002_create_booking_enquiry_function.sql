begin;

-- Used to compare retry payloads without storing a second copy of the enquiry's
-- personal and dog-care data. Supabase installs extensions in this schema.
create extension if not exists pgcrypto with schema extensions;

alter table public.booking_enquiries
  add column submission_payload_hash text;

alter table public.booking_enquiries
  add constraint booking_enquiries_submission_payload_hash_check
  check ((
    submission_payload_hash is null
    or submission_payload_hash ~ '^[0-9a-f]{64}$'
  ) is true);

comment on column public.booking_enquiries.submission_payload_hash is
  'SHA-256 of the canonical JSONB submission used to detect idempotency-key reuse with different content.';

create function public.create_booking_enquiry(payload jsonb)
returns table (
  enquiry_id uuid,
  was_created boolean
)
language plpgsql
security invoker
set search_path = pg_catalog, extensions
as $$
declare
  v_submission_key uuid;
  v_payload_hash text;
  v_existing_enquiry_id uuid;
  v_existing_payload_hash text;
  v_enquiry_id uuid;
  v_dog_id uuid;
  v_dog jsonb;
  v_position smallint;
begin
  if payload is null or jsonb_typeof(payload) is distinct from 'object' then
    raise exception using
      errcode = '22023',
      message = 'Invalid booking enquiry payload';
  end if;

  -- These properties belong to the database and must never be supplied by an
  -- unauthenticated submission. Nested IDs are also rejected per dog below.
  if payload ?| array[
    'id',
    'status',
    'createdAt',
    'updatedAt',
    'accuracyConfirmedAt',
    'enquiryAcknowledgedAt'
  ] then
    raise exception using
      errcode = '22023',
      message = 'Payload contains database-managed properties';
  end if;

  if jsonb_typeof(payload -> 'owner') is distinct from 'object'
    or jsonb_typeof(payload -> 'booking') is distinct from 'object'
    or jsonb_typeof(payload -> 'dogs') is distinct from 'array'
    or jsonb_typeof(payload -> 'confirmations') is distinct from 'object'
  then
    raise exception using
      errcode = '22023',
      message = 'Invalid booking enquiry payload structure';
  end if;

  if jsonb_array_length(payload -> 'dogs') not between 1 and 5 then
    raise exception using
      errcode = '22023',
      message = 'A booking enquiry must contain between one and five dogs';
  end if;

  if payload #> '{confirmations,accuracyConfirmed}' is distinct from 'true'::jsonb
    or payload #> '{confirmations,enquiryAcknowledged}' is distinct from 'true'::jsonb
  then
    raise exception using
      errcode = '22023',
      message = 'Required booking enquiry confirmations were not provided';
  end if;

  begin
    v_submission_key := nullif(btrim(payload ->> 'submissionKey'), '')::uuid;
  exception
    when invalid_text_representation then
      raise exception using
        errcode = '22023',
        message = 'Invalid booking enquiry submission key';
  end;

  if v_submission_key is null then
    raise exception using
      errcode = '22023',
      message = 'A booking enquiry submission key is required';
  end if;

  -- jsonb text output has deterministic key ordering, so semantically identical
  -- objects with different property order produce the same fingerprint.
  v_payload_hash := encode(
    extensions.digest(payload::text, 'sha256'),
    'hex'
  );

  select
    existing.id,
    existing.submission_payload_hash
  into
    v_existing_enquiry_id,
    v_existing_payload_hash
  from public.booking_enquiries as existing
  where existing.submission_key = v_submission_key;

  if found then
    if v_existing_payload_hash is distinct from v_payload_hash then
      raise exception using
        errcode = '23505',
        message = 'Submission key has already been used with different payload content';
    end if;

    return query
      select v_existing_enquiry_id, false;
    return;
  end if;

  insert into public.booking_enquiries (
    full_name,
    email,
    telephone,
    home_address,
    postcode,
    service,
    day_care_dates_text,
    arrival_date,
    departure_date,
    preferred_arrival_time,
    preferred_collection_time,
    multiple_dogs_same_household,
    booking_notes,
    submission_key,
    submission_payload_hash
  )
  values (
    btrim(payload #>> '{owner,fullName}'),
    lower(btrim(payload #>> '{owner,email}')),
    btrim(payload #>> '{owner,telephone}'),
    btrim(payload #>> '{owner,homeAddress}'),
    upper(btrim(payload #>> '{owner,postcode}')),
    payload #>> '{booking,service}',
    nullif(btrim(payload #>> '{booking,dayCareDatesText}'), ''),
    nullif(payload #>> '{booking,arrivalDate}', '')::date,
    nullif(payload #>> '{booking,departureDate}', '')::date,
    nullif(payload #>> '{booking,preferredArrivalTime}', '')::time,
    nullif(payload #>> '{booking,preferredCollectionTime}', '')::time,
    (payload #>> '{booking,multipleDogsSameHousehold}')::boolean,
    nullif(btrim(payload #>> '{booking,notes}'), ''),
    v_submission_key,
    v_payload_hash
  )
  on conflict (submission_key) do nothing
  returning id into v_enquiry_id;

  -- A concurrent request may have inserted the same key after the first lookup.
  if v_enquiry_id is null then
    select
      existing.id,
      existing.submission_payload_hash
    into
      v_existing_enquiry_id,
      v_existing_payload_hash
    from public.booking_enquiries as existing
    where existing.submission_key = v_submission_key;

    if not found or v_existing_payload_hash is distinct from v_payload_hash then
      raise exception using
        errcode = '23505',
        message = 'Submission key has already been used with different payload content';
    end if;

    return query
      select v_existing_enquiry_id, false;
    return;
  end if;

  for v_dog, v_position in
    select dog.value, dog.ordinality::smallint
    from jsonb_array_elements(payload -> 'dogs') with ordinality as dog(value, ordinality)
  loop
    if jsonb_typeof(v_dog) is distinct from 'object' then
      raise exception using
        errcode = '22023',
        message = 'Every dog entry must be an object';
    end if;

    if v_dog ?| array[
      'id',
      'enquiryId',
      'position',
      'createdAt',
      'recordedAt'
    ] then
      raise exception using
        errcode = '22023',
        message = 'Dog payload contains database-managed properties';
    end if;

    if jsonb_typeof(v_dog -> 'health') is distinct from 'object'
      or jsonb_typeof(v_dog -> 'care') is distinct from 'object'
      or jsonb_typeof(v_dog -> 'permissions') is distinct from 'object'
    then
      raise exception using
        errcode = '22023',
        message = 'Invalid dog payload structure';
    end if;

    insert into public.enquiry_dogs (
      enquiry_id,
      position,
      name,
      breed,
      age_or_date_of_birth,
      sex,
      neutered,
      microchipped,
      microchip_number,
      insured,
      insurance_company,
      insurance_policy_number,
      veterinary_practice_details,
      vaccination_date,
      worming_date,
      flea_treatment_date,
      has_medical_conditions,
      medical_condition_details,
      takes_prescribed_medication,
      medication_details,
      has_allergies,
      allergy_details,
      daily_routine,
      feeding_routine,
      exercise_requirements,
      sleeping_arrangements,
      behaviour_with_other_dogs,
      separation_anxiety_details,
      has_aggression_fear_or_reactivity,
      aggression_fear_or_reactivity_details,
      other_care_information
    )
    values (
      v_enquiry_id,
      v_position,
      btrim(v_dog ->> 'name'),
      btrim(v_dog ->> 'breed'),
      btrim(v_dog ->> 'ageOrDateOfBirth'),
      v_dog ->> 'sex',
      (v_dog ->> 'neutered')::boolean,
      (v_dog ->> 'microchipped')::boolean,
      nullif(btrim(v_dog ->> 'microchipNumber'), ''),
      (v_dog ->> 'insured')::boolean,
      nullif(btrim(v_dog ->> 'insuranceCompany'), ''),
      nullif(btrim(v_dog ->> 'insurancePolicyNumber'), ''),
      btrim(v_dog #>> '{health,veterinaryPracticeDetails}'),
      (v_dog #>> '{health,vaccinationDate}')::date,
      (v_dog #>> '{health,wormingDate}')::date,
      (v_dog #>> '{health,fleaTreatmentDate}')::date,
      (v_dog #>> '{health,hasMedicalConditions}')::boolean,
      nullif(btrim(v_dog #>> '{health,medicalConditionDetails}'), ''),
      (v_dog #>> '{health,takesPrescribedMedication}')::boolean,
      nullif(btrim(v_dog #>> '{health,medicationDetails}'), ''),
      (v_dog #>> '{health,hasAllergies}')::boolean,
      nullif(btrim(v_dog #>> '{health,allergyDetails}'), ''),
      btrim(v_dog #>> '{care,dailyRoutine}'),
      btrim(v_dog #>> '{care,feedingRoutine}'),
      nullif(btrim(v_dog #>> '{care,exerciseRequirements}'), ''),
      nullif(btrim(v_dog #>> '{care,sleepingArrangements}'), ''),
      btrim(v_dog #>> '{care,behaviourWithOtherDogs}'),
      nullif(btrim(v_dog #>> '{care,separationAnxietyDetails}'), ''),
      (v_dog #>> '{care,hasAggressionFearOrReactivity}')::boolean,
      nullif(
        btrim(v_dog #>> '{care,aggressionFearOrReactivityDetails}'),
        ''
      ),
      nullif(btrim(v_dog #>> '{care,otherCareInformation}'), '')
    )
    returning id into v_dog_id;

    insert into public.dog_permissions (
      dog_id,
      feeding_with_other_dogs,
      on_lead_walking,
      off_lead_walking,
      walking_with_other_households,
      socialising_with_other_households,
      overnight_with_other_households,
      crate_required,
      crate_provision_agreed,
      medication_administration,
      emergency_treatment_acknowledged
    )
    values (
      v_dog_id,
      (v_dog #>> '{permissions,feedingWithOtherDogs}')::boolean,
      (v_dog #>> '{permissions,onLeadWalking}')::boolean,
      (v_dog #>> '{permissions,offLeadWalking}')::boolean,
      (v_dog #>> '{permissions,walkingWithOtherHouseholds}')::boolean,
      (v_dog #>> '{permissions,socialisingWithOtherHouseholds}')::boolean,
      (v_dog #>> '{permissions,overnightWithOtherHouseholds}')::boolean,
      (v_dog #>> '{permissions,crateRequired}')::boolean,
      (v_dog #>> '{permissions,crateProvisionAgreed}')::boolean,
      (v_dog #>> '{permissions,medicationAdministration}')::boolean,
      (v_dog #>> '{permissions,emergencyTreatmentAcknowledged}')::boolean
    );
  end loop;

  return query
    select v_enquiry_id, true;
end;
$$;

comment on function public.create_booking_enquiry(jsonb) is
  'Atomically creates one booking enquiry with all dog snapshots and per-dog permissions. Returns the existing enquiry for an identical idempotent retry.';

revoke all on function public.create_booking_enquiry(jsonb) from public;
revoke all on function public.create_booking_enquiry(jsonb) from anon;
revoke all on function public.create_booking_enquiry(jsonb) from authenticated;
grant execute on function public.create_booking_enquiry(jsonb) to service_role;

commit;
