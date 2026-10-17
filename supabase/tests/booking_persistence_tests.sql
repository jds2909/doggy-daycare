-- Booking persistence integration tests
--
-- Run this complete file in Supabase SQL Editor only after migrations 001 and
-- 002 have been applied. All test data is isolated in this transaction and is
-- removed by the final ROLLBACK.

begin;

create temporary table booking_persistence_test_context (
  test_name text primary key,
  submission_key uuid not null,
  payload jsonb not null,
  enquiry_id uuid
) on commit drop;

insert into booking_persistence_test_context (
  test_name,
  submission_key,
  payload
)
values (
  'one_dog',
  '10000000-0000-4000-8000-000000000001'::uuid,
  $json$
  {
    "submissionKey": "10000000-0000-4000-8000-000000000001",
    "owner": {
      "fullName": "Alex Example",
      "email": "alex.example@example.com",
      "telephone": "07111 111111",
      "homeAddress": "10 Fiction Lane, Sampleton, Cornwall",
      "postcode": "PL15 1AA"
    },
    "booking": {
      "service": "day-care",
      "dayCareDatesText": "15 November and 22 November",
      "arrivalDate": null,
      "departureDate": null,
      "preferredArrivalTime": "09:00",
      "preferredCollectionTime": "17:00",
      "multipleDogsSameHousehold": false,
      "notes": "Fictional one-dog persistence test."
    },
    "dogs": [
      {
        "name": "Juniper",
        "breed": "Whippet cross",
        "ageOrDateOfBirth": "Approximately 4 years",
        "sex": "female",
        "neutered": true,
        "microchipped": false,
        "microchipNumber": null,
        "insured": false,
        "insuranceCompany": null,
        "insurancePolicyNumber": null,
        "health": {
          "veterinaryPracticeDetails": "Example Veterinary Practice, 1 Sample Road, 01000 111111",
          "vaccinationDate": "2025-11-01",
          "wormingDate": "2026-08-01",
          "fleaTreatmentDate": "2026-08-01",
          "hasMedicalConditions": false,
          "medicalConditionDetails": null,
          "takesPrescribedMedication": false,
          "medicationDetails": null,
          "hasAllergies": false,
          "allergyDetails": null
        },
        "care": {
          "dailyRoutine": "Breakfast, a morning walk, an afternoon nap and an evening walk.",
          "feedingRoutine": "Two fictional measured meals each day.",
          "exerciseRequirements": "Two moderate walks.",
          "sleepingArrangements": "Sleeps in a dog bed in the kitchen.",
          "behaviourWithOtherDogs": "Calm and sociable in this fictional test.",
          "separationAnxietyDetails": null,
          "hasAggressionFearOrReactivity": false,
          "aggressionFearOrReactivityDetails": null,
          "otherCareInformation": null
        },
        "permissions": {
          "feedingWithOtherDogs": true,
          "onLeadWalking": true,
          "offLeadWalking": false,
          "walkingWithOtherHouseholds": true,
          "socialisingWithOtherHouseholds": true,
          "overnightWithOtherHouseholds": false,
          "crateRequired": false,
          "crateProvisionAgreed": null,
          "medicationAdministration": true,
          "emergencyTreatmentAcknowledged": true
        }
      }
    ],
    "confirmations": {
      "accuracyConfirmed": true,
      "enquiryAcknowledged": true
    }
  }
  $json$::jsonb
);

insert into booking_persistence_test_context (
  test_name,
  submission_key,
  payload
)
values (
  'two_dogs',
  '20000000-0000-4000-8000-000000000002'::uuid,
  $json$
  {
    "submissionKey": "20000000-0000-4000-8000-000000000002",
    "owner": {
      "fullName": "Morgan Sample",
      "email": "morgan.sample@example.com",
      "telephone": "07222 222222",
      "homeAddress": "20 Demonstration Close, Exampleford, Cornwall",
      "postcode": "PL15 2BB"
    },
    "booking": {
      "service": "boarding",
      "dayCareDatesText": null,
      "arrivalDate": "2027-01-12",
      "departureDate": "2027-01-15",
      "preferredArrivalTime": "10:00",
      "preferredCollectionTime": "16:00",
      "multipleDogsSameHousehold": true,
      "notes": "Fictional two-dog persistence test."
    },
    "dogs": [
      {
        "name": "Cedar",
        "breed": "Labrador cross",
        "ageOrDateOfBirth": "5 years",
        "sex": "male",
        "neutered": true,
        "microchipped": true,
        "microchipNumber": "FICTIONAL-CHIP-CEDAR",
        "insured": true,
        "insuranceCompany": "Example Pet Cover",
        "insurancePolicyNumber": "EXAMPLE-POLICY-CEDAR",
        "health": {
          "veterinaryPracticeDetails": "Sample Animal Clinic, 2 Imaginary Street, 01000 222222",
          "vaccinationDate": "2025-12-01",
          "wormingDate": "2026-08-15",
          "fleaTreatmentDate": "2026-08-15",
          "hasMedicalConditions": false,
          "medicalConditionDetails": null,
          "takesPrescribedMedication": false,
          "medicationDetails": null,
          "hasAllergies": true,
          "allergyDetails": "Fictional seasonal pollen sensitivity."
        },
        "care": {
          "dailyRoutine": "Early breakfast, two walks and a quiet evening.",
          "feedingRoutine": "Two measured meals each day.",
          "exerciseRequirements": "Two medium-length walks.",
          "sleepingArrangements": "Sleeps downstairs on a dog bed.",
          "behaviourWithOtherDogs": "Friendly after a calm introduction.",
          "separationAnxietyDetails": null,
          "hasAggressionFearOrReactivity": false,
          "aggressionFearOrReactivityDetails": null,
          "otherCareInformation": "Enjoys puzzle feeders."
        },
        "permissions": {
          "feedingWithOtherDogs": true,
          "onLeadWalking": true,
          "offLeadWalking": true,
          "walkingWithOtherHouseholds": true,
          "socialisingWithOtherHouseholds": true,
          "overnightWithOtherHouseholds": true,
          "crateRequired": false,
          "crateProvisionAgreed": null,
          "medicationAdministration": true,
          "emergencyTreatmentAcknowledged": true
        }
      },
      {
        "name": "Pippin",
        "breed": "Terrier cross",
        "ageOrDateOfBirth": "Approximately 7 years",
        "sex": "female",
        "neutered": true,
        "microchipped": true,
        "microchipNumber": "FICTIONAL-CHIP-PIPPIN",
        "insured": false,
        "insuranceCompany": null,
        "insurancePolicyNumber": null,
        "health": {
          "veterinaryPracticeDetails": "Sample Animal Clinic, 2 Imaginary Street, 01000 222222",
          "vaccinationDate": "2025-12-02",
          "wormingDate": "2026-08-16",
          "fleaTreatmentDate": "2026-08-16",
          "hasMedicalConditions": true,
          "medicalConditionDetails": "Fictional mild joint stiffness monitored by the example vet.",
          "takesPrescribedMedication": true,
          "medicationDetails": "One fictional tablet with the evening meal.",
          "hasAllergies": false,
          "allergyDetails": null
        },
        "care": {
          "dailyRoutine": "A short morning walk, rest periods and an evening stroll.",
          "feedingRoutine": "Two small meals each day.",
          "exerciseRequirements": "Shorter walks at a gentle pace.",
          "sleepingArrangements": "Sleeps in her own crate with the door open.",
          "behaviourWithOtherDogs": "Prefers calm dogs and gradual introductions.",
          "separationAnxietyDetails": "May whine briefly when first left alone.",
          "hasAggressionFearOrReactivity": true,
          "aggressionFearOrReactivityDetails": "May bark at unfamiliar large dogs; redirect with distance and treats.",
          "otherCareInformation": null
        },
        "permissions": {
          "feedingWithOtherDogs": false,
          "onLeadWalking": true,
          "offLeadWalking": false,
          "walkingWithOtherHouseholds": true,
          "socialisingWithOtherHouseholds": true,
          "overnightWithOtherHouseholds": true,
          "crateRequired": true,
          "crateProvisionAgreed": true,
          "medicationAdministration": true,
          "emergencyTreatmentAcknowledged": true
        }
      }
    ],
    "confirmations": {
      "accuracyConfirmed": true,
      "enquiryAcknowledged": true
    }
  }
  $json$::jsonb
);

-- Test 1: a complete one-dog enquiry is persisted with one permission row.
do $test$
declare
  v_payload jsonb;
  v_enquiry_id uuid;
  v_was_created boolean;
  v_count bigint;
begin
  select context.payload
  into v_payload
  from booking_persistence_test_context as context
  where context.test_name = 'one_dog';

  select result.enquiry_id, result.was_created
  into v_enquiry_id, v_was_created
  from public.create_booking_enquiry(v_payload) as result;

  if v_enquiry_id is null or v_was_created is not true then
    raise exception 'Test 1 failed: expected a newly created enquiry';
  end if;

  update booking_persistence_test_context
  set enquiry_id = v_enquiry_id
  where test_name = 'one_dog';

  select count(*)
  into v_count
  from public.booking_enquiries as enquiry
  where enquiry.id = v_enquiry_id
    and enquiry.status = 'NEW'
    and enquiry.submission_key = '10000000-0000-4000-8000-000000000001'::uuid;

  if v_count <> 1 then
    raise exception 'Test 1 failed: expected one NEW parent enquiry';
  end if;

  select count(*)
  into v_count
  from public.enquiry_dogs as dog
  where dog.enquiry_id = v_enquiry_id
    and dog.position = 1
    and dog.name = 'Juniper';

  if v_count <> 1 then
    raise exception 'Test 1 failed: expected Juniper at position 1';
  end if;

  select count(*)
  into v_count
  from public.enquiry_dogs as dog
  join public.dog_permissions as permission
    on permission.dog_id = dog.id
  where dog.enquiry_id = v_enquiry_id;

  if v_count <> 1 then
    raise exception 'Test 1 failed: expected exactly one related permission row';
  end if;

  raise notice 'PASS 1: one-dog enquiry and permission relationship';
end;
$test$;

-- Test 2: a two-dog enquiry preserves array order and creates one permission
-- record for each dog.
do $test$
declare
  v_payload jsonb;
  v_enquiry_id uuid;
  v_was_created boolean;
  v_count bigint;
  v_positions smallint[];
begin
  select context.payload
  into v_payload
  from booking_persistence_test_context as context
  where context.test_name = 'two_dogs';

  select result.enquiry_id, result.was_created
  into v_enquiry_id, v_was_created
  from public.create_booking_enquiry(v_payload) as result;

  if v_enquiry_id is null or v_was_created is not true then
    raise exception 'Test 2 failed: expected a newly created enquiry';
  end if;

  update booking_persistence_test_context
  set enquiry_id = v_enquiry_id
  where test_name = 'two_dogs';

  select count(*)
  into v_count
  from public.booking_enquiries as enquiry
  where enquiry.id = v_enquiry_id
    and enquiry.status = 'NEW'
    and enquiry.multiple_dogs_same_household = true
    and enquiry.submission_key = '20000000-0000-4000-8000-000000000002'::uuid;

  if v_count <> 1 then
    raise exception 'Test 2 failed: expected one NEW two-dog parent enquiry';
  end if;

  select array_agg(dog.position order by dog.position)
  into v_positions
  from public.enquiry_dogs as dog
  where dog.enquiry_id = v_enquiry_id;

  if v_positions is distinct from array[1, 2]::smallint[] then
    raise exception 'Test 2 failed: expected dog positions {1,2}, got %', v_positions;
  end if;

  select count(*)
  into v_count
  from public.enquiry_dogs as dog
  join public.dog_permissions as permission
    on permission.dog_id = dog.id
  where dog.enquiry_id = v_enquiry_id
    and (
      (
        dog.position = 1
        and dog.name = 'Cedar'
        and permission.crate_required = false
        and permission.crate_provision_agreed is null
      )
      or
      (
        dog.position = 2
        and dog.name = 'Pippin'
        and permission.crate_required = true
        and permission.crate_provision_agreed = true
      )
    );

  if v_count <> 2 then
    raise exception 'Test 2 failed: dog positions or corresponding permissions are incorrect';
  end if;

  raise notice 'PASS 2: two dogs, ordered positions and corresponding permissions';
end;
$test$;

-- Build an invalid payload from the valid two-dog example. The second dog asks
-- for a crate but does not agree to provide one, violating the crate CHECK.
insert into booking_persistence_test_context (
  test_name,
  submission_key,
  payload
)
select
  'invalid_second_dog',
  '30000000-0000-4000-8000-000000000003'::uuid,
  jsonb_set(
    jsonb_set(
      context.payload,
      '{submissionKey}',
      to_jsonb('30000000-0000-4000-8000-000000000003'::text),
      false
    ),
    '{dogs,1,permissions,crateProvisionAgreed}',
    'null'::jsonb,
    false
  )
from booking_persistence_test_context as context
where context.test_name = 'two_dogs';

-- Test 3: the invalid second dog must roll back the parent, first dog and first
-- permission row inserted earlier in the function call.
do $test$
declare
  v_payload jsonb;
  v_failed_as_expected boolean := false;
  v_count bigint;
begin
  select context.payload
  into v_payload
  from booking_persistence_test_context as context
  where context.test_name = 'invalid_second_dog';

  begin
    perform * from public.create_booking_enquiry(v_payload);
  exception
    when check_violation then
      v_failed_as_expected := true;
  end;

  if not v_failed_as_expected then
    raise exception 'Test 3 failed: invalid second dog did not raise a CHECK violation';
  end if;

  select count(*)
  into v_count
  from public.booking_enquiries as enquiry
  where enquiry.submission_key = '30000000-0000-4000-8000-000000000003'::uuid;

  if v_count <> 0 then
    raise exception 'Test 3 failed: invalid parent enquiry was not rolled back';
  end if;

  select count(*)
  into v_count
  from public.enquiry_dogs as dog
  join public.booking_enquiries as enquiry
    on enquiry.id = dog.enquiry_id
  where enquiry.submission_key = '30000000-0000-4000-8000-000000000003'::uuid;

  if v_count <> 0 then
    raise exception 'Test 3 failed: invalid enquiry left dog records behind';
  end if;

  select count(*)
  into v_count
  from public.dog_permissions as permission
  join public.enquiry_dogs as dog
    on dog.id = permission.dog_id
  join public.booking_enquiries as enquiry
    on enquiry.id = dog.enquiry_id
  where enquiry.submission_key = '30000000-0000-4000-8000-000000000003'::uuid;

  if v_count <> 0 then
    raise exception 'Test 3 failed: invalid enquiry left permission records behind';
  end if;

  raise notice 'PASS 3: invalid second dog rolled back the complete enquiry';
end;
$test$;

-- Test 4: an exact retry returns the original UUID, reports was_created=false
-- and does not duplicate any parent, dog or permission records.
do $test$
declare
  v_payload jsonb;
  v_original_enquiry_id uuid;
  v_retry_enquiry_id uuid;
  v_was_created boolean;
  v_count bigint;
begin
  select context.payload, context.enquiry_id
  into v_payload, v_original_enquiry_id
  from booking_persistence_test_context as context
  where context.test_name = 'one_dog';

  select result.enquiry_id, result.was_created
  into v_retry_enquiry_id, v_was_created
  from public.create_booking_enquiry(v_payload) as result;

  if v_retry_enquiry_id is distinct from v_original_enquiry_id
    or v_was_created is not false
  then
    raise exception 'Test 4 failed: retry did not return the existing enquiry';
  end if;

  select count(*)
  into v_count
  from public.booking_enquiries as enquiry
  where enquiry.submission_key = '10000000-0000-4000-8000-000000000001'::uuid;

  if v_count <> 1 then
    raise exception 'Test 4 failed: retry duplicated the parent enquiry';
  end if;

  select count(*)
  into v_count
  from public.enquiry_dogs as dog
  where dog.enquiry_id = v_original_enquiry_id;

  if v_count <> 1 then
    raise exception 'Test 4 failed: retry duplicated dog records';
  end if;

  select count(*)
  into v_count
  from public.dog_permissions as permission
  join public.enquiry_dogs as dog
    on dog.id = permission.dog_id
  where dog.enquiry_id = v_original_enquiry_id;

  if v_count <> 1 then
    raise exception 'Test 4 failed: retry duplicated permission records';
  end if;

  raise notice 'PASS 4: identical retry returned the original enquiry without duplicates';
end;
$test$;

-- Test 5: changing content while retaining a used submission key must raise
-- the controlled unique_violation conflict and leave stored data unchanged.
do $test$
declare
  v_changed_payload jsonb;
  v_original_enquiry_id uuid;
  v_conflict_raised boolean := false;
  v_count bigint;
begin
  select
    jsonb_set(
      context.payload,
      '{owner,fullName}',
      to_jsonb('Different Fictional Owner'::text),
      false
    ),
    context.enquiry_id
  into v_changed_payload, v_original_enquiry_id
  from booking_persistence_test_context as context
  where context.test_name = 'one_dog';

  begin
    perform * from public.create_booking_enquiry(v_changed_payload);
  exception
    when unique_violation then
      v_conflict_raised := true;
  end;

  if not v_conflict_raised then
    raise exception 'Test 5 failed: changed payload did not raise an idempotency conflict';
  end if;

  select count(*)
  into v_count
  from public.booking_enquiries as enquiry
  where enquiry.id = v_original_enquiry_id
    and enquiry.full_name = 'Alex Example';

  if v_count <> 1 then
    raise exception 'Test 5 failed: original enquiry was changed or removed';
  end if;

  select count(*)
  into v_count
  from public.booking_enquiries as enquiry
  where enquiry.submission_key in (
    '10000000-0000-4000-8000-000000000001'::uuid,
    '20000000-0000-4000-8000-000000000002'::uuid,
    '30000000-0000-4000-8000-000000000003'::uuid
  );

  if v_count <> 2 then
    raise exception 'Test 5 failed: expected exactly two successful test enquiries';
  end if;

  select count(*)
  into v_count
  from public.enquiry_dogs as dog
  join public.booking_enquiries as enquiry
    on enquiry.id = dog.enquiry_id
  where enquiry.submission_key in (
    '10000000-0000-4000-8000-000000000001'::uuid,
    '20000000-0000-4000-8000-000000000002'::uuid,
    '30000000-0000-4000-8000-000000000003'::uuid
  );

  if v_count <> 3 then
    raise exception 'Test 5 failed: expected exactly three test dog rows';
  end if;

  select count(*)
  into v_count
  from public.dog_permissions as permission
  join public.enquiry_dogs as dog
    on dog.id = permission.dog_id
  join public.booking_enquiries as enquiry
    on enquiry.id = dog.enquiry_id
  where enquiry.submission_key in (
    '10000000-0000-4000-8000-000000000001'::uuid,
    '20000000-0000-4000-8000-000000000002'::uuid,
    '30000000-0000-4000-8000-000000000003'::uuid
  );

  if v_count <> 3 then
    raise exception 'Test 5 failed: expected exactly three test permission rows';
  end if;

  raise notice 'PASS 5: changed payload with a reused key raised a conflict';
end;
$test$;

-- Test 6: exercise the permissions themselves, not only
-- has_function_privilege(). SET LOCAL changes role only for this transaction.
do $test$
declare
  v_anon_denied boolean := false;
  v_authenticated_denied boolean := false;
begin
  execute 'set local role anon';
  begin
    perform * from public.create_booking_enquiry('{}'::jsonb);
  exception
    when insufficient_privilege then
      v_anon_denied := true;
  end;
  execute 'reset role';

  if not v_anon_denied then
    raise exception 'Test 6 failed: anon was able to execute the booking function';
  end if;

  execute 'set local role authenticated';
  begin
    perform * from public.create_booking_enquiry('{}'::jsonb);
  exception
    when insufficient_privilege then
      v_authenticated_denied := true;
  end;
  execute 'reset role';

  if not v_authenticated_denied then
    raise exception 'Test 6 failed: authenticated was able to execute the booking function';
  end if;

  raise notice 'PASS 6: anon and authenticated execution was rejected';
end;
$test$;

select
  'All booking persistence tests passed; test data will now be rolled back.'
    as test_result;

rollback;
