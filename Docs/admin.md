# Admin API Specification

---

## Login Admin

**Description:**
Admin login to the system

**Access:**
Admin

### Endpoint : `POST /api/auth/admin/login`

#### Request Body :
```json
{
    "username": "John Doe",
    "password": "secret",
} 
```

#### Response Body (Success) :
```json
{
    "msg": "success",
    "token": "jwt",
    "adminId": "1",
    "role": "Role"
}
```

#### Response Body (Failed) :
```json 
{
    "msg": "Invalid username or password"
}
```

---
## Admin Profile

**Description:**
Admin gets information of his account

**Access:**
Admin

**Authorization:**
Required

### Endpoint : `GET /api/admin/profile`

#### Response Body (Success):
```json
{
    "username": "John Doe",
    "whatsappNumber": "13481234",
    "email" : "abc@gmail.com",
    "user_role": "Role",
}
```

#### Response Body (Failed):
```json
{
    "msg": "Failed"
}
```

---

## Update Admin Profile

**Description:**
Admin update profile, the fields are optionals but must requested with minimal one field to be updated

**Access:**
Admin

### Endpoint : `PATCH /api/admin/profile`


#### Request Body:
```json
{
    "username": "John Doe",
    "whatsappNumber": "13481234",
    "email" : "abc@gmail.com"
}
```

#### Response Body (Success):
```json
{
    "msg": "Success to update profile"
}
```

#### Response Body (Failed):
```json
{
    "msg": "Failed"
}
```

---

## Get All Students

**Description:**
Admin gets all the students list

**Access:**
Admin

**Authorization:**
Required

### Endpoint : `GET /api/admin/students`

#### Response Body (Success) :
```json
{
    "msg": "success",
    "students": [
        {
            "studentId": "22143214",
            "username": "John Doe",
            "whatsappNumber": "+6212342134",
            "email": "abc@gmail.com",
            "status": "Active",
        },
        {
            "studentId": "22143214",
            "username": "John Doe",
            "whatsappNumber": "+6212342134",
            "email": "abc@gmail.com",
            "status": "Inactive",
        },
        {
            "studentId": "22143214",
            "username": "John Doe",
            "whatsappNumber": "+6212342134",
            "email": "abc@gmail.com",
            "status": "Waiting",
        },
    ]
}
```

#### Response Body (Failed) :
```json 
{
    "msg": "Failed to fetch",
    "students": []
}
```

---

## Update Student Status

**Description:**
Admin updates student account

**Access:**
Admin

**Authorization:**
Required

### Endpoint : `PATCH /api/admin/students/{studentId}`

#### Request Body:

```json
{
    "status" : "inactive"
}
```

#### Response Body (Success):
```json
{
    "msg": "success to update"
}
```

#### Response Body (Failed):
```json
{
    "msg": "failed to update"
}
```

---

## Get Student Detail

**Description:**
Admin get student detail

**Access:**
Admin

**Authorization:**
Required

### `GET /api/admin/students/{studentId}`

#### Request Body (Success):

```json
{
    "msg": "Success",
    "student": {
        "studentId": "22143214",
        "fullName": "John Doe",
        "whatsappNumber": "+6212342134",
        "email": "abc@gmail.com",
        "status": "Inactive",
        "password": "secret123"
    }
}
```

#### Request Body (Failed):

```json
{
    "msg": "Failed",
    "student": {}
}
```