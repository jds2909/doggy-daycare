# Booking enquiry retention and deletion policy

This internal policy covers personal and dog-care information submitted through
the booking enquiry form. It is an operational policy for the current system,
not a statement that overrides any legal, licensing or insurance record-keeping
requirement. The owner should confirm any such requirement with an appropriate
professional and update this policy if necessary.

## Retention schedule

| Record | Retention approach |
| --- | --- |
| Active `NEW`, `PENDING_REVIEW` or `CONTACTED` enquiry | Keep while the enquiry or related stay is actively being discussed or arranged. Review inactive records at least every three months. |
| Closed enquiry that did not proceed | Delete no later than 12 months after it was closed or last meaningfully updated, whichever is later. |
| Enquiry used to arrange care | Delete no later than 12 months after the last related stay or contact, unless a confirmed legal, licensing, insurance or unresolved dispute requirement needs longer retention. |
| Notification email | Delete when it is no longer operationally useful and no later than the corresponding enquiry's deletion target. |
| Fictional test data | Delete immediately after the test has been verified. |

The database does not currently automate retention or record the date of a stay.
The owner must therefore perform the review manually and use business records to
identify the relevant last stay or contact date. Records must not be kept
indefinitely merely because deletion is manual.

## Access and correction requests

1. Receive the request through the published business contact details.
2. Verify the requester using information already associated with the enquiry;
   do not request more identity information than is reasonably needed.
3. Find matching records carefully, using the enquiry UUID and confirmed contact
   details where possible.
4. Provide a clear copy or correct the record as requested, unless there is a
   specific reason not to do so. Do not disclose another customer's information.
5. Respond promptly and record any reason why a request cannot yet be completed.

## Deletion procedure

1. Confirm that the enquiry is not active and is not needed for an upcoming stay,
   unresolved issue, or confirmed record-keeping obligation.
2. Identify the exact `booking_enquiries.id`; do not delete by a broad or
   unverified customer-name match.
3. Delete that parent `booking_enquiries` row. Existing foreign keys cascade the
   deletion to its `enquiry_dogs` and `dog_permissions` rows.
4. Remove the corresponding notification email and any separately saved copies
   when they are no longer required.
5. Confirm that the parent, dog and permission rows are gone.

Deletion removes the live database rows. Managed backups may retain an encrypted
copy until the hosting provider's configured backup-retention period expires;
the current Supabase project settings should be checked before promising a
specific backup-erasure date.

## Data minimisation review

The form currently requests some information that is important before care but
may not always be necessary at the earliest enquiry stage:

- full home address;
- full microchip number;
- insurance company and full policy number;
- detailed medical, medication, allergy and behaviour information;
- full veterinary practice address and contact details;
- detailed care permissions before availability has been agreed.

These fields came from the business's booking requirements and have not been
removed. The owner should periodically decide whether each item is required at
initial enquiry or could instead be collected after availability and trial
familiarisation. Free-text fields should be reviewed carefully because customers
may enter unrelated personal information.

## Access controls and handling

- Complete records are available only through the allowlisted owner admin account
  and server-side service-role database access.
- Do not export enquiries to unmanaged devices or forward full records by email.
- Notification emails intentionally omit detailed medical, microchip and insurance
  fields.
- Never place customer payloads, credentials or sensitive dog details in logs,
  source control, issue trackers or test fixtures.
- Revoke sessions and rotate credentials promptly if owner account access or a
  server secret may have been compromised.
