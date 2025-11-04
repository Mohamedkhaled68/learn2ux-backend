# 🎨 Category Creation Guide

## Category Schema

When creating a category, you need to provide the following fields:

```typescript
{
    titleEn: string; // English title (max 200 chars)
    titleAr: string; // Arabic title (max 200 chars)
    descriptionEn: string; // English description (max 1000 chars)
    descriptionAr: string; // Arabic description (max 1000 chars)
    textColor: string; // Hex color for text (e.g., #FF5733)
    borderColor: string; // Hex color for border (e.g., #00ADEF)
    icon: string; // Base64 encoded SVG or PNG
    iconType: "svg" | "png"; // Type of icon
}
```

---

## Example: Create Category with SVG Icon

### SVG Icon (Recommended)

For SVG icons, you can send the SVG as a base64 encoded string or as the raw SVG text.

#### Option 1: Base64 Encoded SVG

```json
{
    "titleEn": "Design Principles",
    "titleAr": "مبادئ التصميم",
    "descriptionEn": "Learn the fundamental principles of UI/UX design",
    "descriptionAr": "تعلم المبادئ الأساسية لتصميم واجهة المستخدم",
    "textColor": "#2C3E50",
    "borderColor": "#3498DB",
    "icon": "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIj48cGF0aCBkPSJNMTIgMmwzLjA5IDYuMjZMIDE3LjQyIDkuMjVsMi41OCAwLjM3YTEgMSAwIDAgMS41NC44NGwtNS43NCA1Ljg0TDE1LjIxIDIzYTEgMSAwIDAgMS0xLjQzIDEuMDVMMTIgMjJsLTEuNzggMmExIDEgMCAwIDEtMS40My0xLjA1bDEuNDEtNi42OC01Ljc0LTUuODRhMSAxIDAgMCAxIC41NC0uODRsMi41OC0uMzd6Ii8+PC9zdmc+",
    "iconType": "svg"
}
```

#### Option 2: Raw SVG String

```json
{
    "titleEn": "Color Theory",
    "titleAr": "نظرية الألوان",
    "descriptionEn": "Understanding colors in design",
    "descriptionAr": "فهم الألوان في التصميم",
    "textColor": "#E74C3C",
    "borderColor": "#C0392B",
    "icon": "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'><circle cx='12' cy='12' r='10'/><path d='M12 6v6l4 2'/></svg>",
    "iconType": "svg"
}
```

---

## Example: Create Category with PNG Icon

For PNG icons, send the image as a base64 encoded data URL:

```json
{
    "titleEn": "Typography",
    "titleAr": "الطباعة",
    "descriptionEn": "Master the art of typography",
    "descriptionAr": "إتقان فن الطباعة",
    "textColor": "#16A085",
    "borderColor": "#1ABC9C",
    "icon": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "iconType": "png"
}
```

---

## Full API Request Example

### Using PowerShell:

```powershell
$token = "YOUR_JWT_TOKEN_HERE"

$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    titleEn = "Design Principles"
    titleAr = "مبادئ التصميم"
    descriptionEn = "Learn the fundamental principles of UI/UX design that help create beautiful interfaces"
    descriptionAr = "تعلم المبادئ الأساسية لتصميم واجهة المستخدم التي تساعد في إنشاء واجهات جميلة"
    textColor = "#2C3E50"
    borderColor = "#3498DB"
    icon = "<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'><circle cx='12' cy='12' r='10'/></svg>"
    iconType = "svg"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/categories" -Method Post -Headers $headers -Body $body
```

### Using cURL:

```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "titleEn": "Design Principles",
    "titleAr": "مبادئ التصميم",
    "descriptionEn": "Learn the fundamental principles of UI/UX design",
    "descriptionAr": "تعلم المبادئ الأساسية لتصميم واجهة المستخدم",
    "textColor": "#2C3E50",
    "borderColor": "#3498DB",
    "icon": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\"><circle cx=\"12\" cy=\"12\" r=\"10\"/></svg>",
    "iconType": "svg"
  }'
```

---

## Color Format

Both `textColor` and `borderColor` must be valid hex colors:

✅ Valid formats:

-   `#FF5733` (6-digit hex)
-   `#F57` (3-digit hex)

❌ Invalid formats:

-   `FF5733` (missing #)
-   `rgb(255, 87, 51)` (not hex)
-   `red` (color name)

---

## Icon Format

### For SVG (Recommended):

1. **Raw SVG**: Paste the SVG code directly
2. **Base64**: Encode your SVG to base64
    - Use: `data:image/svg+xml;base64,<base64-encoded-svg>`

### For PNG:

1. **Base64 only**: Encode your PNG to base64
    - Use: `data:image/png;base64,<base64-encoded-png>`

### Converting Image to Base64:

**In JavaScript (Browser):**

```javascript
// For file upload
const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

// Usage
const file = document.querySelector('input[type="file"]').files[0];
const base64 = await fileToBase64(file);
```

**Using Node.js:**

```javascript
const fs = require("fs");

const imageToBase64 = (filePath) => {
    const image = fs.readFileSync(filePath);
    return `data:image/png;base64,${image.toString("base64")}`;
};

const base64 = imageToBase64("./icon.png");
```

**Using Online Tools:**

-   https://www.base64-image.de/
-   https://base64.guru/converter/encode/image

---

## Response Example

```json
{
    "success": true,
    "message": "Category created successfully",
    "data": {
        "_id": "673abc123def456789012345",
        "titleEn": "Design Principles",
        "titleAr": "مبادئ التصميم",
        "descriptionEn": "Learn the fundamental principles of UI/UX design",
        "descriptionAr": "تعلم المبادئ الأساسية لتصميم واجهة المستخدم",
        "textColor": "#2C3E50",
        "borderColor": "#3498DB",
        "icon": "<svg xmlns='http://www.w3.org/2000/svg'...",
        "iconType": "svg",
        "createdAt": "2025-11-03T12:00:00.000Z",
        "updatedAt": "2025-11-03T12:00:00.000Z"
    }
}
```

---

## Update Category

To update a category, use the same format with PUT:

```http
PUT /api/categories/:categoryId
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "titleEn": "Updated Title",
  "titleAr": "عنوان محدث",
  "descriptionEn": "Updated description",
  "descriptionAr": "وصف محدث",
  "textColor": "#E74C3C",
  "borderColor": "#C0392B",
  "icon": "<svg>...</svg>",
  "iconType": "svg"
}
```

---

## Validation Rules

| Field         | Required | Type   | Validation                  |
| ------------- | -------- | ------ | --------------------------- |
| titleEn       | ✅ Yes   | String | Max 200 characters          |
| titleAr       | ✅ Yes   | String | Max 200 characters          |
| descriptionEn | ✅ Yes   | String | Max 1000 characters         |
| descriptionAr | ✅ Yes   | String | Max 1000 characters         |
| textColor     | ✅ Yes   | String | Hex color (#RGB or #RRGGBB) |
| borderColor   | ✅ Yes   | String | Hex color (#RGB or #RRGGBB) |
| icon          | ✅ Yes   | String | Base64 or raw SVG/PNG       |
| iconType      | ✅ Yes   | Enum   | Must be "svg" or "png"      |

---

## Common SVG Icons for UI/UX Categories

### Design Principles Icon:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <rect x="3" y="3" width="18" height="18" rx="2"/>
  <path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>
</svg>
```

### Color Theory Icon:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <circle cx="12" cy="12" r="10"/>
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>
</svg>
```

### Typography Icon:

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M4 7V4h16v3M9 20h6M12 4v16"/>
</svg>
```

---

## Testing Your Category

After creating a category, test it by getting all categories:

```bash
curl http://localhost:5000/api/categories
```

Or by ID:

```bash
curl http://localhost:5000/api/categories/YOUR_CATEGORY_ID
```

---

**Happy Creating! 🎨**
