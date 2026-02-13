SkillBuilder API Standards
Production API Guidelines for Backend Team

==================================================

1. Purpose
--------------------------------------------------
This document defines mandatory standards for designing, implementing,
and maintaining APIs in production.

Goals:
- Consistency across teams
- Security by default
- Predictable behavior for frontend & integrations
- Long-term maintainability

These rules are NOT optional.

==================================================

2. Core Principles
--------------------------------------------------
1. APIs are contracts, not implementation details
2. Backward compatibility > developer convenience
3. Security > speed
4. Explicit > implicit
5. Fail fast, fail clearly

==================================================

3. API Design Standards
--------------------------------------------------

3.1 Versioning
- All APIs MUST be versioned
- Version is part of the URL

Examples:
/api/v1/...
/api/v2/...

Rules:
- Breaking changes → new version
- Bug fixes → same version
- Versions are never modified retroactively

--------------------------------------------------

3.2 Resource Naming
- Use nouns, not verbs
- Use plural names
- Use lowercase and hyphens

Correct:
/users/{user_id}

Incorrect:
/getUser
/create-user

--------------------------------------------------

3.3 HTTP Methods

GET     → Read resource
POST    → Create resource
PUT     → Replace resource
PATCH   → Partial update
DELETE  → Delete resource

Rules:
- GET must be read-only
- DELETE must be idempotent

==================================================

4. Request & Response Standards
--------------------------------------------------

4.1 Standard Response Envelope

Success:
{
  "success": true,
  "data": {},
  "error": null
}

Failure:
{
  "success": false,
  "data": null,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}

--------------------------------------------------

4.2 HTTP Status Codes

200 → Success
201 → Created
400 → Bad request
401 → Unauthorized
403 → Forbidden
404 → Not found
409 → Conflict
422 → Validation error
500 → Internal server error

Rules:
- Never return 200 for failures
- Status code must match intent

--------------------------------------------------

4.3 Error Codes
- Error codes MUST be stable
- Machine-readable
- Messages are user-friendly

Examples:
USER_NOT_FOUND
INVALID_CREDENTIALS
PERMISSION_DENIED

==================================================

5. Authentication & Authorization
--------------------------------------------------

5.1 Authentication
- Every API endpoint is authenticated by default
- Public endpoints must be explicitly marked

Accepted:
- OAuth2 / OpenID Connect
- JWT access tokens (short-lived)

--------------------------------------------------

5.2 Authorization
- Authentication ≠ Authorization
- Validate access at resource level

Rules:
- Users access only their own data
- Admin permissions must be explicitly checked
- Never trust client-supplied IDs or roles

==================================================

6. Validation & Input Handling
--------------------------------------------------

6.1 Input Validation
All inputs MUST be validated:
- Type
- Length
- Format
- Allowed values

Rules:
- Validate at API boundary
- Reject invalid requests immediately

--------------------------------------------------

6.2 Client Trust Rules
- Never trust client-calculated values
- Server recalculates totals, scores, permissions

==================================================

7. Pagination, Filtering & Sorting
--------------------------------------------------

7.1 Pagination (Mandatory)
No unbounded list endpoints.

Example:
/users?limit=50&cursor=abc

Rules:
- Default limit required
- Maximum limit enforced

--------------------------------------------------

7.2 Filtering & Sorting
- Use query parameters
- Never overload endpoints

Example:
/users?role=teacher&status=active

==================================================

8. Database & Transactions
--------------------------------------------------

8.1 Transactions
- Multi-step writes MUST use transactions
- Partial writes are forbidden

--------------------------------------------------

8.2 Idempotency
- POST/PUT must be safe to retry
- Use idempotency keys where applicable
- Enforce uniqueness at DB level

==================================================

9. Logging & Auditing
--------------------------------------------------

9.1 Logging
- Structured logging only (JSON)
- No sensitive data in logs

Required fields:
- request_id
- user_id (if authenticated)
- endpoint
- status

--------------------------------------------------

9.2 Audit Logs
Mandatory for:
- Authentication attempts
- Role/permission changes
- Data exports
- Admin actions

Audit logs are immutable.

==================================================

10. Security Standards
--------------------------------------------------

10.1 Secrets Management
- No secrets in code
- No secrets in git
- No secrets in logs

Secrets stored in:
- Environment variables
- Secret managers

--------------------------------------------------

10.2 Data Protection
- Passwords → bcrypt / argon2
- Tokens → hashed before storage
- Sensitive fields → encrypted at rest

--------------------------------------------------

10.3 CORS
- CORS is NOT security
- Never rely on CORS for auth

==================================================

11. Documentation
--------------------------------------------------
- OpenAPI / Swagger is mandatory
- Docs must reflect real behavior
- Every endpoint documented before merge

==================================================

12. Testing Requirements
--------------------------------------------------
Required:
- Unit tests
- Integration tests
- Auth tests
- Authorization tests
- Failure-path tests

If it’s not tested, it’s broken.

==================================================

13. Backward Compatibility
--------------------------------------------------
- Fields may be added, never removed
- New fields must be optional
- Deprecations must be documented

==================================================

14. Deployment Rules
--------------------------------------------------
- Feature flags for risky changes
- Zero-downtime deployments
- Backward-compatible migrations

==================================================

15. Review Checklist
--------------------------------------------------
- Auth checked
- Permissions enforced
- Input validated
- Errors standardized
- Pagination applied
- Logs added
- Tests written
- Docs updated

==================================================

16. Final Rule
--------------------------------------------------
If an API breaks production, the API — not the client — is at fault.
