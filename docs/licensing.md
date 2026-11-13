# SpineSpy Licensing System

This document describes the SpineSpy licensing API and token format for macOS app integration.

## Overview

- **License Model**: One-time purchase, up to 3 Macs per license
- **Token Format**: Ed25519-signed JSON payload
- **Token Lifetime**: 7 days (renewable)
- **Offline Verification**: Tokens can be verified locally using the public key

## API Endpoints

Base URL: `https://www.spinespy.com/api/license`

### 1. Activate License

**Endpoint**: `POST /api/license/activate`

**Request**:
```json
{
  "key": "ABCDEF-123456-GHIJKL-789012",
  "device_id_hash": "sha256_hash_of_device_identifier"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "instance_id": "inst_abc123def456ghi789jkl",
  "token": "base64_signature.base64_payload"
}
```

**Error Responses**:
- `404 LICENSE_NOT_FOUND`: License key not found
- `403 LICENSE_REVOKED`: License has been revoked
- `409 MAX_ACTIVATIONS_REACHED`: License is already activated on 3 devices
- `429 RATE_LIMIT_EXCEEDED`: Too many requests

**Notes**:
- If the same `device_id_hash` activates again, it returns the existing `instance_id`
- The `device_id_hash` should be a SHA-256 hash of a stable device identifier (e.g., hardware UUID)
- Do not send raw device identifiers or other personal data

### 2. Validate License

**Endpoint**: `POST /api/license/validate`

**Request**:
```json
{
  "key": "ABCDEF-123456-GHIJKL-789012",
  "instance_id": "inst_abc123def456ghi789jkl"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "status": "active",
  "token": "base64_signature.base64_payload"
}
```

**Error Responses**:
- `404 LICENSE_NOT_FOUND`: License or activation not found
- `429 RATE_LIMIT_EXCEEDED`: Too many requests

**Notes**:
- Call this endpoint to refresh the token before it expires
- Updates the `last_seen` timestamp for the activation

### 3. Deactivate License

**Endpoint**: `POST /api/license/deactivate`

**Request**:
```json
{
  "key": "ABCDEF-123456-GHIJKL-789012",
  "instance_id": "inst_abc123def456ghi789jkl"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "License deactivated successfully"
}
```

**Error Responses**:
- `429 RATE_LIMIT_EXCEEDED`: Too many requests

**Notes**:
- Frees up an activation slot for use on another device
- Does not fail if the activation doesn't exist

## Token Format

Tokens are Ed25519-signed JSON payloads in the format:

```
base64(signature).base64(json_payload)
```

### Token Payload

```json
{
  "key": "ABCDEF-123456-GHIJKL-789012",
  "instance_id": "inst_abc123def456ghi789jkl",
  "status": "active",
  "issued_at": 1699999999000,
  "expires_at": 1700604799000
}
```

- `key`: The license key
- `instance_id`: Unique identifier for this activation
- `status`: License status (`active` or `revoked`)
- `issued_at`: Unix timestamp in milliseconds when the token was issued
- `expires_at`: Unix timestamp in milliseconds when the token expires (7 days from issue)

### Offline Token Verification

The macOS app can verify tokens offline using the Ed25519 public key.

**Public Key**:
```
The LICENSE_SIGNING_PUBLIC_KEY will be provided separately and embedded in the app binary.
```

**Verification Steps**:

1. Split the token on the `.` delimiter to get signature and payload
2. Base64-decode both parts
3. Verify the signature using `nacl.sign.detached.verify(message, signature, publicKey)`
4. Parse the JSON payload
5. Check that `expires_at > Date.now()`
6. Check that `status === "active"`

**Swift Example** (using TweetNacl or equivalent):
```swift
import TweetNacl

func verifyLicenseToken(_ token: String) throws -> LicensePayload {
    let parts = token.split(separator: ".")
    guard parts.count == 2 else {
        throw LicenseError.invalidFormat
    }
    
    guard let signatureData = Data(base64Encoded: String(parts[0])),
          let messageData = Data(base64Encoded: String(parts[1])) else {
        throw LicenseError.invalidBase64
    }
    
    let publicKey = Data(base64Encoded: LICENSE_SIGNING_PUBLIC_KEY)!
    
    let isValid = NaclSign.signDetachedVerify(
        message: messageData,
        sig: signatureData,
        publicKey: publicKey
    )
    
    guard isValid else {
        throw LicenseError.invalidSignature
    }
    
    let payload = try JSONDecoder().decode(LicensePayload.self, from: messageData)
    
    guard payload.expiresAt > Date().timeIntervalSince1970 * 1000 else {
        throw LicenseError.expired
    }
    
    guard payload.status == "active" else {
        throw LicenseError.revoked
    }
    
    return payload
}
```

## Rate Limiting

- **Activate**: 10 requests per minute per IP
- **Validate**: 20 requests per minute per IP
- **Deactivate**: 10 requests per minute per IP

## Error Format

All API errors follow this format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `MISSING_KEY`: License key not provided
- `MISSING_DEVICE_ID`: Device ID hash not provided
- `MISSING_INSTANCE_ID`: Instance ID not provided
- `LICENSE_NOT_FOUND`: License key not found
- `LICENSE_REVOKED`: License has been revoked
- `MAX_ACTIVATIONS_REACHED`: All activation slots are used
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `ACTIVATION_ERROR`: Generic activation error
- `VALIDATION_ERROR`: Generic validation error
- `DEACTIVATION_ERROR`: Generic deactivation error

## Integration Recommendations

1. **Store the token securely**: Use macOS Keychain to store the license key, instance_id, and token
2. **Validate on startup**: Check the token on app launch
3. **Refresh proactively**: Refresh the token when it has less than 24 hours remaining
4. **Handle revocation gracefully**: If validation returns `revoked`, disable Pro features and show a message
5. **Offline grace period**: Continue working for up to 7 days if the validation request fails due to network issues
6. **Device ID**: Use `IOPlatformUUID` or similar stable hardware identifier, hashed with SHA-256
7. **No PII**: Never send raw device identifiers, serial numbers, or other personal information

## Trial Implementation

The 7-day free trial is implemented in the macOS app, not the licensing API. The app should:

1. Track the trial start date locally
2. Allow full Pro features for 7 days
3. After 7 days, prompt the user to purchase
4. Upon purchase, call the `/activate` endpoint with the license key

## Support

For licensing support or questions, contact: support@spinespy.com
