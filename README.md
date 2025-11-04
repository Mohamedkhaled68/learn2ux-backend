# Learn2UX Backend API

A complete RESTful API backend for a bilingual (Arabic/English) UI/UX documentation platform built with Express.js and MongoDB.

## 📋 Features

-   ✅ **Bilingual Support**: All content stored in both Arabic and English
-   🔐 **JWT Authentication**: Secure admin authentication with JWT tokens
-   📚 **Categories Management**: CRUD operations for organizing questions
-   ❓ **Questions & Answers**: Full question management with external links support
-   🛡️ **Protected Routes**: Admin-only endpoints for content management
-   ✔️ **Input Validation**: Comprehensive validation using express-validator
-   🌐 **CORS Enabled**: Configured for cross-origin requests
-   🔒 **Security**: Helmet.js for security headers
-   📝 **Logging**: Morgan for HTTP request logging

## 🏗️ Project Structure

```
learn2ux-backend/
├── src/
│   ├── config/
│   │   ├── config.js           # Environment configuration
│   │   └── database.js         # MongoDB connection setup
│   ├── controllers/
│   │   ├── adminController.js  # Admin authentication logic
│   │   ├── categoryController.js
│   │   └── questionController.js
│   ├── middleware/
│   │   ├── authenticate.js     # JWT authentication middleware
│   │   ├── errorHandler.js     # Global error handler
│   │   └── validate.js         # Validation middleware
│   ├── models/
│   │   ├── Admin.js            # Admin schema
│   │   ├── Category.js         # Category schema
│   │   └── Question.js         # Question schema
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── questionRoutes.js
│   └── server.js               # Express app setup
├── .env                        # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB Atlas account or local MongoDB installation
-   npm or yarn

### Installation

1. **Clone the repository** (or ensure you're in the project directory)

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Environment Variables**

    The `.env` file is already configured with your MongoDB connection. Review and update if needed:

    ```env
    # MongoDB Configuration
    MONGODB_URI=mongodb+srv://mohamedkhaled6083:dQvdVSDiduobwylY@node0.khii8.mongodb.net/?retryWrites=true&w=majority&appName=node0
    DB_NAME=learn2ux

    # Server Configuration
    PORT=5000
    NODE_ENV=development

    # JWT Configuration
    JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
    JWT_EXPIRE=7d

    # CORS Configuration
    ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
    ```

    ⚠️ **Important**: Change the `JWT_SECRET` before deploying to production!

4. **Run the server**

    Development mode (with auto-restart):

    ```bash
    npm run dev
    ```

    Production mode:

    ```bash
    npm start
    ```

5. **Verify the server is running**

    Open your browser or use curl:

    ```bash
    curl http://localhost:5000/health
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

## 📡 API Endpoints

### Base URL

```
http://localhost:5000/api
```

### Admin Authentication

#### Register Admin

```http
POST /api/admin/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@learn2ux.com",
  "password": "password123",
  "name": "Admin User"
}
```

**Response:**

```json
{
    "success": true,
    "message": "Admin registered successfully",
    "data": {
        "admin": {
            "id": "...",
            "username": "admin",
            "email": "admin@learn2ux.com",
            "name": "Admin User",
            "isActive": true,
            "createdAt": "..."
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

#### Login Admin

```http
POST /api/admin/login
Content-Type: application/json

{
  "email": "admin@learn2ux.com",
  "password": "password123"
}
```

#### Get Current Admin

```http
GET /api/admin/me
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Categories

#### Get All Categories (Public)

```http
GET /api/categories
```

**Response:**

```json
{
    "success": true,
    "count": 2,
    "data": [
        {
            "_id": "...",
            "title": {
                "en": "Design Principles",
                "ar": "مبادئ التصميم"
            },
            "description": {
                "en": "Learn the fundamental principles of UI/UX design",
                "ar": "تعلم المبادئ الأساسية لتصميم واجهة المستخدم وتجربة المستخدم"
            },
            "createdAt": "...",
            "updatedAt": "..."
        }
    ]
}
```

#### Get Category by ID (Public)

```http
GET /api/categories/:id
```

#### Create Category (Admin Only)

```http
POST /api/categories
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": {
    "en": "Design Principles",
    "ar": "مبادئ التصميم"
  },
  "description": {
    "en": "Learn the fundamental principles of UI/UX design",
    "ar": "تعلم المبادئ الأساسية لتصميم واجهة المستخدم وتجربة المستخدم"
  }
}
```

#### Update Category (Admin Only)

```http
PUT /api/categories/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "title": {
    "en": "Updated Title",
    "ar": "عنوان محدث"
  },
  "description": {
    "en": "Updated description",
    "ar": "وصف محدث"
  }
}
```

#### Delete Category (Admin Only)

```http
DELETE /api/categories/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

### Questions

#### Get All Questions (Public)

```http
GET /api/questions
```

Get questions by category:

```http
GET /api/questions?categoryId=CATEGORY_ID
```

**Response:**

```json
{
    "success": true,
    "count": 1,
    "data": [
        {
            "_id": "...",
            "categoryId": {
                "_id": "...",
                "title": {
                    "en": "Design Principles",
                    "ar": "مبادئ التصميم"
                }
            },
            "question": {
                "en": "What is the golden ratio in design?",
                "ar": "ما هي النسبة الذهبية في التصميم؟"
            },
            "answer": {
                "en": "The golden ratio is a mathematical ratio...",
                "ar": "النسبة الذهبية هي نسبة رياضية..."
            },
            "links": [
                {
                    "title": {
                        "en": "Learn More",
                        "ar": "اعرف المزيد"
                    },
                    "url": "https://example.com/golden-ratio"
                }
            ],
            "createdAt": "...",
            "updatedAt": "..."
        }
    ]
}
```

#### Get Question by ID (Public)

```http
GET /api/questions/:id
```

#### Create Question (Admin Only)

```http
POST /api/questions
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "categoryId": "CATEGORY_ID",
  "question": {
    "en": "What is the golden ratio in design?",
    "ar": "ما هي النسبة الذهبية في التصميم؟"
  },
  "answer": {
    "en": "The golden ratio is a mathematical ratio commonly used in design...",
    "ar": "النسبة الذهبية هي نسبة رياضية تستخدم بشكل شائع في التصميم..."
  },
  "links": [
    {
      "title": {
        "en": "Learn More",
        "ar": "اعرف المزيد"
      },
      "url": "https://example.com/golden-ratio"
    }
  ]
}
```

#### Update Question (Admin Only)

```http
PUT /api/questions/:id
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "categoryId": "CATEGORY_ID",
  "question": {
    "en": "Updated question?",
    "ar": "سؤال محدث؟"
  },
  "answer": {
    "en": "Updated answer",
    "ar": "جواب محدث"
  },
  "links": []
}
```

#### Delete Question (Admin Only)

```http
DELETE /api/questions/:id
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

To get a token:

1. Register a new admin using `/api/admin/register`
2. Or login with existing credentials using `/api/admin/login`
3. Copy the token from the response
4. Include it in the Authorization header for protected routes

## 🗄️ Database Models

### Category Model

```javascript
{
  title: {
    en: String (required, max 200 chars),
    ar: String (required, max 200 chars)
  },
  description: {
    en: String (required, max 1000 chars),
    ar: String (required, max 1000 chars)
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Question Model

```javascript
{
  categoryId: ObjectId (ref: Category, required),
  question: {
    en: String (required, max 500 chars),
    ar: String (required, max 500 chars)
  },
  answer: {
    en: String (required),
    ar: String (required)
  },
  links: [{
    title: {
      en: String,
      ar: String
    },
    url: String (required, must be valid URL)
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model

```javascript
{
  username: String (required, unique, 3-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  name: String (optional, max 100 chars),
  isActive: Boolean (default: true),
  createdAt: Date,
  lastLogin: Date
}
```

## 🛠️ Technologies Used

-   **Express.js** - Web framework
-   **MongoDB & Mongoose** - Database and ODM
-   **JWT (jsonwebtoken)** - Authentication
-   **bcryptjs** - Password hashing
-   **express-validator** - Input validation
-   **helmet** - Security headers
-   **cors** - Cross-origin resource sharing
-   **morgan** - HTTP request logger
-   **dotenv** - Environment variables

## 📝 Scripts

```bash
npm start      # Start the server (production)
npm run dev    # Start with nodemon (development)
```

## 🔧 Configuration

### CORS

Update `ALLOWED_ORIGINS` in `.env` to allow specific frontend origins:

```env
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

### JWT Expiration

Adjust token expiration time in `.env`:

```env
JWT_EXPIRE=7d    # 7 days
JWT_EXPIRE=24h   # 24 hours
JWT_EXPIRE=30m   # 30 minutes
```

## 🚨 Error Handling

The API includes comprehensive error handling:

-   **400 Bad Request** - Validation errors
-   **401 Unauthorized** - Authentication required
-   **403 Forbidden** - Access denied
-   **404 Not Found** - Resource not found
-   **500 Internal Server Error** - Server errors

All errors return in this format:

```json
{
    "success": false,
    "message": "Error description",
    "errors": [] // Validation errors (if applicable)
}
```

## 📄 License

ISC

## 👨‍💻 Development Notes

-   Always use the provided JWT token for admin operations
-   All bilingual fields (title, description, question, answer) require both `en` and `ar` properties
-   Links in questions must start with `http://` or `https://`
-   Deleting a category will also delete all associated questions
-   Passwords are automatically hashed before storing in the database

## 🎯 Next Steps

1. **Create your first admin account**:

    ```bash
    curl -X POST http://localhost:5000/api/admin/register \
      -H "Content-Type: application/json" \
      -d '{"username":"admin","email":"admin@learn2ux.com","password":"password123","name":"Admin"}'
    ```

2. **Create a category**:
   Use the token from step 1 to create your first category

3. **Add questions**:
   Add questions to your categories

4. **Integrate with frontend**:
   Connect your React/Vue/Angular frontend to these APIs

---

**Happy Coding! 🚀**
