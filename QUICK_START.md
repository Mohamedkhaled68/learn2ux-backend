# Quick Start Guide - Learn2UX Backend

Follow these simple steps to get your Learn2UX backend up and running!

## ✅ Prerequisites Check

Make sure you have:

-   ✓ Node.js installed (v14 or higher)
-   ✓ npm or yarn installed
-   ✓ MongoDB connection (already configured in .env)

## 🚀 Start the Server

### Option 1: Development Mode (Recommended for Development)

```bash
npm run dev
```

This starts the server with nodemon, which auto-restarts on file changes.

### Option 2: Production Mode

```bash
npm start
```

## 🔍 Verify Server is Running

Open your browser and go to:

```
http://localhost:5000/health
```

You should see:

```json
{
    "success": true,
    "message": "Server is running",
    "timestamp": "2025-11-03T...",
    "environment": "development"
}
```

## 📝 Next Steps

### 1. Login with Pre-Created Admin Account

The first admin account has already been created for you!

**Credentials:**

-   Email: `aa@aa.com`
-   Password: `Pass123$`

**Using PowerShell:**

```powershell
$body = @{
    email = "aa@aa.com"
    password = "Pass123$"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.data.token
Write-Host "Your token: $token"
```

**Using cURL:**

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"aa@aa.com","password":"Pass123$"}'
```

**💡 Important:** Save the token from the response! You'll need it for admin operations.

### 1a. (Optional) Register Additional Admin Accounts

If you need to create more admin accounts:

**Using PowerShell:**

```powershell
$body = @{
    email = "newemail@example.com"
    password = "yourpassword"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/admin/register" -Method Post -Body $body -ContentType "application/json"
```

**Using cURL:**

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email":"newemail@example.com","password":"yourpassword"}'
```

**Note:** Admin registration now only requires email and password (no username or name).

### 2. Create Your First Category

Replace `YOUR_TOKEN_HERE` with the token from step 1:

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

$body = @{
    title = @{
        en = "Design Principles"
        ar = "مبادئ التصميم"
    }
    description = @{
        en = "Learn the fundamental principles of UI/UX design"
        ar = "تعلم المبادئ الأساسية لتصميم واجهة المستخدم"
    }
} | ConvertTo-Json

$category = Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Post -Headers $headers -Body $body
Write-Host "Category created with ID: $($category.data._id)"
```

### 3. Create Your First Question

Replace `YOUR_TOKEN_HERE` and `YOUR_CATEGORY_ID` with actual values:

```powershell
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer YOUR_TOKEN_HERE"
}

$body = @{
    categoryId = "YOUR_CATEGORY_ID"
    question = @{
        en = "What is the golden ratio in design?"
        ar = "ما هي النسبة الذهبية في التصميم؟"
    }
    answer = @{
        en = "The golden ratio is a mathematical ratio commonly found in nature..."
        ar = "النسبة الذهبية هي نسبة رياضية توجد بشكل شائع في الطبيعة..."
    }
    links = @(
        @{
            title = @{
                en = "Learn More"
                ar = "اعرف المزيد"
            }
            url = "https://www.interaction-design.org/literature/article/the-golden-ratio"
        }
    )
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:5000/api/questions" -Method Post -Headers $headers -Body $body
```

### 4. View Your Data

Get all categories (no authentication needed):

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Get
```

Get all questions:

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/questions" -Method Get
```

## 🛠️ Alternative: Use Postman

1. Import the `Learn2UX-API.postman_collection.json` file into Postman
2. The collection includes all API endpoints
3. Variables like `token` and `categoryId` are automatically saved after each request
4. Simply run the requests in order:
    - Register Admin (saves token automatically)
    - Create Category (saves categoryId automatically)
    - Create Question (uses saved categoryId)

## 📚 Full Documentation

For complete API documentation, see:

-   `README.md` - Complete project documentation
-   `API_TESTING.md` - Detailed API testing examples

## 🎯 Server Information

-   **API Base URL:** http://localhost:5000/api
-   **Health Check:** http://localhost:5000/health
-   **Root Endpoint:** http://localhost:5000/ (shows all available endpoints)
-   **Default Port:** 5000 (can be changed in .env)

## 🔒 Security Notes

-   The JWT token expires after 7 days (configurable in .env)
-   Always use HTTPS in production
-   Change the JWT_SECRET in .env before deploying
-   Admin passwords are automatically hashed with bcrypt
-   All admin routes require JWT authentication

## ❓ Troubleshooting

### Server won't start

-   Check if port 5000 is already in use
-   Verify MongoDB connection string in .env
-   Run `npm install` to ensure all dependencies are installed

### Can't connect to MongoDB

-   Verify your MongoDB Atlas credentials
-   Check your IP whitelist in MongoDB Atlas
-   Ensure your internet connection is stable

### Authentication fails

-   Make sure you're including the token in the Authorization header
-   Format: `Authorization: Bearer YOUR_TOKEN_HERE`
-   Check if the token has expired (7 days by default)

## 🎉 You're All Set!

Your Learn2UX backend is now ready to use. Start building your UI/UX documentation platform!

For any issues or questions, refer to the full documentation in README.md
