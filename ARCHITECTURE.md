# 🏗️ Learn2UX Backend Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                        │
│                    React / Vue / Angular                         │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 │ HTTP/HTTPS Requests
                 │ (JSON)
                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS.JS SERVER                             │
│                    (Port 5000)                                   │
├─────────────────────────────────────────────────────────────────┤
│  Middleware Layer:                                               │
│  ┌──────────────┬──────────────┬──────────────┬──────────────┐ │
│  │   Helmet     │     CORS     │    Morgan    │  Body Parser │ │
│  │  (Security)  │ (Cross-Orig) │  (Logging)   │    (JSON)    │ │
│  └──────────────┴──────────────┴──────────────┴──────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│  Routes Layer:                                                   │
│  ┌──────────────────┬──────────────────┬──────────────────┐    │
│  │  Admin Routes    │ Category Routes  │ Question Routes  │    │
│  │  /api/admin/*    │ /api/categories  │ /api/questions   │    │
│  └─────────┬────────┴────────┬─────────┴────────┬─────────┘    │
│            │                 │                  │                │
│            ▼                 ▼                  ▼                │
│  ┌──────────────────┬──────────────────┬──────────────────┐    │
│  │ authenticate.js  │   validate.js    │ errorHandler.js  │    │
│  │ (JWT Verify)     │ (Input Check)    │ (Error Format)   │    │
│  └─────────┬────────┴────────┬─────────┴────────┬─────────┘    │
│            │                 │                  │                │
│            ▼                 ▼                  ▼                │
│  Controllers Layer:                                              │
│  ┌──────────────────┬──────────────────┬──────────────────┐    │
│  │ adminController  │categoryController│questionController│    │
│  │ - register()     │ - getAll()       │ - getAll()       │    │
│  │ - login()        │ - getById()      │ - getById()      │    │
│  │ - getMe()        │ - create()       │ - create()       │    │
│  │                  │ - update()       │ - update()       │    │
│  │                  │ - delete()       │ - delete()       │    │
│  └─────────┬────────┴────────┬─────────┴────────┬─────────┘    │
│            │                 │                  │                │
│            ▼                 ▼                  ▼                │
│  Models Layer (Mongoose ODM):                                    │
│  ┌──────────────────┬──────────────────┬──────────────────┐    │
│  │   Admin Model    │  Category Model  │  Question Model  │    │
│  │   - username     │  - title (ar/en) │  - categoryId    │    │
│  │   - email        │  - description   │  - question      │    │
│  │   - password     │  - timestamps    │  - answer        │    │
│  │   - isActive     │                  │  - links[]       │    │
│  └─────────┬────────┴────────┬─────────┴────────┬─────────┘    │
│            │                 │                  │                │
└────────────┼─────────────────┼──────────────────┼────────────────┘
             │                 │                  │
             ▼                 ▼                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas Database                        │
│                       (Cloud Database)                           │
├─────────────────────────────────────────────────────────────────┤
│  Collections:                                                    │
│  ┌──────────────────┬──────────────────┬──────────────────┐    │
│  │     admins       │    categories    │    questions     │    │
│  └──────────────────┴──────────────────┴──────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Examples

### 1. Admin Login Flow

```
Client                   Server                    Database
  │                        │                          │
  │  POST /api/admin/login │                          │
  ├───────────────────────>│                          │
  │  {email, password}     │                          │
  │                        │  Find admin by email     │
  │                        ├─────────────────────────>│
  │                        │                          │
  │                        │<─────────────────────────┤
  │                        │  Admin document          │
  │                        │                          │
  │                        │  Compare password        │
  │                        │  (bcrypt)                │
  │                        │                          │
  │                        │  Generate JWT Token      │
  │                        │  (jwt.sign)              │
  │                        │                          │
  │<───────────────────────┤                          │
  │  {success, token}      │                          │
  │                        │                          │
```

### 2. Create Category Flow (Protected)

```
Client                   Server                    Database
  │                        │                          │
  │  POST /api/categories  │                          │
  │  Authorization: Bearer │                          │
  ├───────────────────────>│                          │
  │  {title, description}  │                          │
  │                        │                          │
  │                        │  Verify JWT Token        │
  │                        │  (authenticate.js)       │
  │                        │                          │
  │                        │  Validate Input          │
  │                        │  (validate.js)           │
  │                        │                          │
  │                        │  Create Category         │
  │                        ├─────────────────────────>│
  │                        │                          │
  │                        │<─────────────────────────┤
  │                        │  Saved category          │
  │                        │                          │
  │<───────────────────────┤                          │
  │  {success, data}       │                          │
  │                        │                          │
```

### 3. Get Questions by Category (Public)

```
Client                   Server                    Database
  │                        │                          │
  │  GET /api/questions    │                          │
  │  ?categoryId=123       │                          │
  ├───────────────────────>│                          │
  │                        │                          │
  │                        │  Validate categoryId     │
  │                        │  (validate.js)           │
  │                        │                          │
  │                        │  Find questions          │
  │                        │  where categoryId=123    │
  │                        ├─────────────────────────>│
  │                        │                          │
  │                        │<─────────────────────────┤
  │                        │  Question documents      │
  │                        │  + Category info         │
  │                        │                          │
  │<───────────────────────┤                          │
  │  {success, count, data}│                          │
  │                        │                          │
```

---

## Data Models Relationships

```
┌─────────────────────┐
│       Admin         │
│─────────────────────│
│ _id (ObjectId)      │
│ username (unique)   │
│ email (unique)      │
│ password (hashed)   │
│ name                │
│ isActive            │
│ createdAt           │
│ lastLogin           │
└─────────────────────┘
         │
         │ (No direct relationship)
         │
         ▼
    (Manages all content via JWT authentication)


┌─────────────────────┐              ┌─────────────────────┐
│     Category        │              │      Question       │
│─────────────────────│              │─────────────────────│
│ _id (ObjectId)      │◄─────────────┤ categoryId (ref)    │
│ title.en            │  One-to-Many │ question.en         │
│ title.ar            │              │ question.ar         │
│ description.en      │              │ answer.en           │
│ description.ar      │              │ answer.ar           │
│ createdAt           │              │ links[]             │
│ updatedAt           │              │  ├─ title.en        │
└─────────────────────┘              │  ├─ title.ar        │
                                     │  └─ url             │
                                     │ createdAt           │
                                     │ updatedAt           │
                                     └─────────────────────┘

Relationship:
- One Category can have many Questions
- Each Question belongs to one Category
- Deleting a Category deletes all its Questions (cascade)
```

---

## Authentication & Authorization Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
└─────────────────────────────────────────────────────────────┘

1. Registration/Login
   ┌─────────┐      ┌──────────────┐      ┌──────────────┐
   │  Client │─────>│ POST /login  │─────>│ Verify Creds │
   └─────────┘      └──────────────┘      └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │ Generate JWT │
                                          │ Token with:  │
                                          │ - Admin ID   │
                                          │ - Expires 7d │
                                          └──────┬───────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │ Return Token │
                                          │ to Client    │
                                          └──────────────┘

2. Protected Request
   ┌─────────┐      ┌──────────────────┐      ┌────────────────┐
   │ Client  │─────>│ Authorization:   │─────>│ authenticate() │
   │         │      │ Bearer TOKEN     │      │ middleware     │
   └─────────┘      └──────────────────┘      └───────┬────────┘
                                                       │
                                                       ▼
                                               ┌───────────────┐
                                               │ Verify Token  │
                                               │ - Valid?      │
                                               │ - Expired?    │
                                               └───────┬───────┘
                                                       │
                                      ┌────────────────┴────────────────┐
                                      ▼                                 ▼
                              ┌───────────────┐               ┌────────────────┐
                              │ Token Valid   │               │ Token Invalid  │
                              │ - Find Admin  │               │ - Return 401   │
                              │ - Attach req  │               └────────────────┘
                              │ - Continue    │
                              └───────────────┘
```

---

## Folder Structure & Responsibilities

```
src/
│
├── config/                    # Configuration Files
│   ├── config.js             # Environment variables wrapper
│   └── database.js           # MongoDB connection logic
│
├── models/                    # Database Schemas
│   ├── Admin.js              # Admin user schema
│   │   └── Methods:          # - comparePassword()
│   │                         # - updateLastLogin()
│   ├── Category.js           # Category schema (bilingual)
│   └── Question.js           # Question schema (bilingual + links)
│
├── middleware/                # Request Interceptors
│   ├── authenticate.js       # JWT verification
│   ├── validate.js           # express-validator wrapper
│   └── errorHandler.js       # Global error handling
│
├── controllers/               # Business Logic
│   ├── adminController.js    # Admin operations
│   │   ├── register()        # Create new admin
│   │   ├── login()           # Authenticate & return token
│   │   └── getMe()           # Get current admin info
│   │
│   ├── categoryController.js # Category operations
│   │   ├── getAllCategories()
│   │   ├── getCategoryById()
│   │   ├── createCategory()
│   │   ├── updateCategory()
│   │   └── deleteCategory()
│   │
│   └── questionController.js # Question operations
│       ├── getAllQuestions() # with optional categoryId filter
│       ├── getQuestionById()
│       ├── createQuestion()
│       ├── updateQuestion()
│       └── deleteQuestion()
│
├── routes/                    # API Endpoints Definition
│   ├── adminRoutes.js        # /api/admin/*
│   │   ├── POST /register    # + validation
│   │   ├── POST /login       # + validation
│   │   └── GET /me           # + authenticate
│   │
│   ├── categoryRoutes.js     # /api/categories/*
│   │   ├── GET /             # public
│   │   ├── GET /:id          # public + validation
│   │   ├── POST /            # + authenticate + validation
│   │   ├── PUT /:id          # + authenticate + validation
│   │   └── DELETE /:id       # + authenticate + validation
│   │
│   └── questionRoutes.js     # /api/questions/*
│       ├── GET /             # public + query validation
│       ├── GET /:id          # public + validation
│       ├── POST /            # + authenticate + validation
│       ├── PUT /:id          # + authenticate + validation
│       └── DELETE /:id       # + authenticate + validation
│
└── server.js                  # Express App Entry Point
    ├── Middleware setup
    ├── Routes registration
    ├── Error handling
    └── Server start
```

---

## Security Layers

```
┌────────────────────────────────────────────────────────────┐
│                    Security Layers                          │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Transport Layer                                         │
│     └─ HTTPS (Production)                                   │
│                                                             │
│  2. Headers Security (Helmet.js)                            │
│     ├─ X-XSS-Protection                                     │
│     ├─ X-Frame-Options                                      │
│     ├─ X-Content-Type-Options                               │
│     └─ Content-Security-Policy                              │
│                                                             │
│  3. CORS Protection                                         │
│     └─ Whitelist allowed origins                            │
│                                                             │
│  4. Authentication (JWT)                                    │
│     ├─ Token-based authentication                           │
│     ├─ 7-day expiration                                     │
│     └─ Signed with secret key                               │
│                                                             │
│  5. Password Security (bcryptjs)                            │
│     ├─ Salt rounds: 10                                      │
│     ├─ One-way hashing                                      │
│     └─ Never stored in plain text                           │
│                                                             │
│  6. Input Validation (express-validator)                    │
│     ├─ Type validation                                      │
│     ├─ Length validation                                    │
│     ├─ Format validation (email, URL, etc.)                 │
│     └─ Sanitization                                         │
│                                                             │
│  7. Database Security (Mongoose)                            │
│     ├─ Schema validation                                    │
│     ├─ Injection prevention                                 │
│     └─ Type casting                                         │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

---

## Error Handling Hierarchy

```
Request Error Handling Flow:

Request
   │
   ▼
┌──────────────────┐
│ Express Routes   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Validation       │───> Validation Error ──┐
│ Middleware       │                        │
└────────┬─────────┘                        │
         │                                  │
         ▼                                  │
┌──────────────────┐                        │
│ Authentication   │───> Auth Error ────────┤
│ Middleware       │    (401, 403)          │
└────────┬─────────┘                        │
         │                                  │
         ▼                                  │
┌──────────────────┐                        │
│ Controller       │───> Business Error ────┤
│ Logic            │    (404, 400)          │
└────────┬─────────┘                        │
         │                                  │
         ▼                                  │
┌──────────────────┐                        │
│ Database         │───> DB Error ──────────┤
│ Operation        │    (Validation, Cast)  │
└────────┬─────────┘                        │
         │                                  │
         │  Success                         │
         ▼                                  │
    Response                                │
                                           │
         All Errors                         │
         │                                  │
         ▼                                  │
┌──────────────────────────────────────────┴┐
│        Global Error Handler                │
│        (errorHandler.js)                   │
├────────────────────────────────────────────┤
│ - Catches all errors                       │
│ - Formats error response                   │
│ - Returns appropriate status code          │
│ - Logs error (if configured)               │
└────────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│     Formatted JSON Error Response        │
│     {                                    │
│       success: false,                    │
│       message: "...",                    │
│       errors: [...]                      │
│     }                                    │
└──────────────────────────────────────────┘
```

---

This architecture provides:

-   ✅ Clear separation of concerns
-   ✅ Scalable structure
-   ✅ Easy to test
-   ✅ Secure by default
-   ✅ Maintainable code
-   ✅ RESTful API design
