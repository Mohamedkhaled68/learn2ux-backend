# API Testing Examples

This file contains example API requests you can use to test the Learn2UX backend API.

You can use tools like:

-   **Postman** (https://www.postman.com/)
-   **Thunder Client** (VS Code extension)
-   **cURL** (command line)
-   **REST Client** (VS Code extension)

## 1. Check Server Health

```http
GET http://localhost:5000/health
```

## 2. Register First Admin

```http
POST http://localhost:5000/api/admin/register
Content-Type: application/json

{
  "username": "admin",
  "email": "admin@learn2ux.com",
  "password": "admin123",
  "name": "Admin User"
}
```

**Save the token from the response!**

## 3. Login (if already registered)

```http
POST http://localhost:5000/api/admin/login
Content-Type: application/json

{
  "email": "admin@learn2ux.com",
  "password": "admin123"
}
```

## 4. Get Current Admin Profile

```http
GET http://localhost:5000/api/admin/me
Authorization: Bearer YOUR_TOKEN_HERE
```

## 5. Create a Category

```http
POST http://localhost:5000/api/categories
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": {
    "en": "Design Principles",
    "ar": "مبادئ التصميم"
  },
  "description": {
    "en": "Learn the fundamental principles of UI/UX design that help create beautiful and functional interfaces",
    "ar": "تعلم المبادئ الأساسية لتصميم واجهة المستخدم وتجربة المستخدم التي تساعد في إنشاء واجهات جميلة ووظيفية"
  }
}
```

**Save the category ID from the response!**

## 6. Get All Categories

```http
GET http://localhost:5000/api/categories
```

## 7. Create a Question

```http
POST http://localhost:5000/api/questions
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "categoryId": "YOUR_CATEGORY_ID_HERE",
  "question": {
    "en": "What is the golden ratio in design?",
    "ar": "ما هي النسبة الذهبية في التصميم؟"
  },
  "answer": {
    "en": "The golden ratio (approximately 1.618) is a mathematical ratio commonly found in nature and used in design to create aesthetically pleasing compositions. It can be applied to layout proportions, typography, and spacing.",
    "ar": "النسبة الذهبية (حوالي 1.618) هي نسبة رياضية توجد بشكل شائع في الطبيعة وتستخدم في التصميم لإنشاء تركيبات جمالية. يمكن تطبيقها على نسب التخطيط والطباعة والمسافات."
  },
  "links": [
    {
      "title": {
        "en": "Learn More About Golden Ratio",
        "ar": "اعرف المزيد عن النسبة الذهبية"
      },
      "url": "https://www.interaction-design.org/literature/article/the-golden-ratio-principles-of-form-and-layout"
    }
  ]
}
```

## 8. Get All Questions

```http
GET http://localhost:5000/api/questions
```

## 9. Get Questions by Category

```http
GET http://localhost:5000/api/questions?categoryId=YOUR_CATEGORY_ID_HERE
```

## 10. Update a Category

```http
PUT http://localhost:5000/api/categories/CATEGORY_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": {
    "en": "Design Principles - Updated",
    "ar": "مبادئ التصميم - محدث"
  },
  "description": {
    "en": "Updated description here",
    "ar": "الوصف المحدث هنا"
  }
}
```

## 11. Update a Question

```http
PUT http://localhost:5000/api/questions/QUESTION_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "categoryId": "YOUR_CATEGORY_ID_HERE",
  "question": {
    "en": "Updated question text?",
    "ar": "نص السؤال المحدث؟"
  },
  "answer": {
    "en": "Updated answer text",
    "ar": "نص الإجابة المحدث"
  },
  "links": []
}
```

## 12. Delete a Question

```http
DELETE http://localhost:5000/api/questions/QUESTION_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

## 13. Delete a Category (and all its questions)

```http
DELETE http://localhost:5000/api/categories/CATEGORY_ID_HERE
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## Testing with cURL (Command Line)

### Register Admin

```bash
curl -X POST http://localhost:5000/api/admin/register \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"admin\",\"email\":\"admin@learn2ux.com\",\"password\":\"admin123\",\"name\":\"Admin User\"}"
```

### Login

```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@learn2ux.com\",\"password\":\"admin123\"}"
```

### Get Categories

```bash
curl http://localhost:5000/api/categories
```

### Create Category (with authentication)

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d "{\"title\":{\"en\":\"Design Principles\",\"ar\":\"مبادئ التصميم\"},\"description\":{\"en\":\"Learn design\",\"ar\":\"تعلم التصميم\"}}"
```

---

## PowerShell Testing

### Register Admin

```powershell
$body = @{
    username = "admin"
    email = "admin@learn2ux.com"
    password = "admin123"
    name = "Admin User"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/admin/register" -Method Post -Body $body -ContentType "application/json"
```

### Get All Categories

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Get
```
