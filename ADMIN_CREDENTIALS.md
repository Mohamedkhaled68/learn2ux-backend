# 🔐 Admin Credentials

## First Admin Account

**Email:** `aa@aa.com`  
**Password:** `Pass123$`

---

## How to Login

### Using PowerShell:

```powershell
$body = @{
    email = "aa@aa.com"
    password = "Pass123$"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $token"
```

### Using cURL:

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aa@aa.com","password":"Pass123$"}'
```

### Using Postman:

1. Method: `POST`
2. URL: `http://localhost:5000/api/admin/login`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):

```json
{
    "email": "aa@aa.com",
    "password": "Pass123$"
}
```

---

## Register New Admin

### Request:

```http
POST http://localhost:5000/api/admin/register
Content-Type: application/json

{
  "email": "newemail@example.com",
  "password": "yourpassword"
}
```

**Note:** Only email and password are required now. No username or name fields needed.

---

## Admin Model Structure

```javascript
{
  email: String (required, unique),
  password: String (required, hashed),
  isActive: Boolean (default: true),
  createdAt: Date,
  lastLogin: Date
}
```

---

## Response Format

### Login Response:

```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "admin": {
            "id": "69088b73cda9a404f4118192",
            "email": "aa@aa.com",
            "lastLogin": "2025-11-03T11:01:07.801Z"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

### Register Response:

```json
{
    "success": true,
    "message": "Admin registered successfully",
    "data": {
        "admin": {
            "id": "...",
            "email": "newemail@example.com",
            "isActive": true,
            "createdAt": "2025-11-03T..."
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

---

## Utilities

### Create First Admin (if not exists):

```bash
npm run create-admin
```

### Test Login:

```bash
node testLogin.js
```

---

## 🔒 Security Notes

-   Password is hashed using bcryptjs with 10 salt rounds
-   JWT token expires after 7 days (configurable in .env)
-   Password must be at least 6 characters
-   Email must be valid format and unique

---

**Last Updated:** November 3, 2025
