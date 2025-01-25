# Bicycle Store

Welcome to Bicycle Store. Bicycle store is a platform where a person can manage products and order any product.

**Key Features:**

- User can create new product
- User can get all products and search by product name, brand and type
- User can get a single product
- User can update a product information
- User can delete a product
- User can order any product
- User can get the total revenue

## Getting Started Locally

- **Clone this repository:** `https://github.com/sakib-xrz/level-2-batch-4-assignment-2-set-4.git`
- **Install necessary dependency:** `npm install`
- **Rename env file:** Rename `.env.example` file as `.env`
- **Add database uri:** Replace the value of `DATABASE_URL` with your database uri
- **Run project:** Finally run the project using this command `npm run dev`

## Base URL

https://bicycle-store-backend.vercel.app

## Postman Collection

For detailed information about each API endpoint, request parameters, responses, and more, please refer to the [Postman API Documentation](https://documenter.getpostman.com/view/38964010/2sAYBUDXqB).

## API Documentation

Welcome to the API documentation for the Bicycle Store. Below you will find the base URL and a link to the comprehensive Postman documentation.

## Endpoints

### Products (Bicycle)

#### 1. Create a Bicycle

- **Endpoint:** `/api/products`
- **Method:** `POST`
- **Body:**

```
{
  "name": "Roadster 5000",
  "brand": "SpeedX",
  "price": 300,
  "type": "Road",
  "description": "A premium road bike designed for speed and performance.",
  "quantity": 20,
  "inStock": true
}
```

- **Response:**

```
{
    "statusCode": 201,
    "success": true,
    "message": "Bicycle created successfully",
    "data": {
        "name": "Roadster 5000",
        "brand": "SpeedX",
        "price": 300,
        "type": "Road",
        "description": "A premium road bike designed for speed and performance.",
        "quantity": 20,
        "inStock": true,
        "_id": "67432539341e19a4d4bfab83",
        "createdAt": "2024-11-24T13:08:09.545Z",
        "updatedAt": "2024-11-24T13:08:09.545Z",
        "__v": 0
    }
}
```

---

#### 2. Get All Bicycles

- **Endpoint:** `/api/products`
- **Method:** `GET`
- **Query:** `/api/products?searchTerm=roadster`

- **Response:**

```
{
    "statusCode": 200,
    "success": true,
    "message": "Bicycles retrieved successfully",
    "meta": {
        "total": 21
    },
    "data": [
        {
            "_id": "6740565436e55ee850aa8aea",
            "name": "Roadster 5000",
            "brand": "SpeedX",
            "price": 200,
            "type": "Road",
            "description": "A premium road bike designed for speed and performance.",
            "quantity": 10,
            "inStock": true,
            "createdAt": "2024-11-22T10:00:52.367Z",
            "updatedAt": "2024-11-24T08:47:56.355Z",
            "__v": 0
        },
        // more data here..
    ]
}
```

---

#### 3. Get a Specific Bicycle

- **Endpoint:** `/api/products/:productId`
- **Method:** `GET`

- **Response:** The details of a specific bicycle by ID.

```
{
    "statusCode": 200,
    "success": true,
    "message": "Bicycle retrieved successfully",
    "data": {
        "_id": "6740565436e55ee850aa8aed",
        "name": "Racer Elite",
        "brand": "Velocity",
        "price": 500,
        "type": "Road",
        "description": "Designed for professional racers seeking ultimate speed.",
        "quantity": 10,
        "inStock": true,
        "createdAt": "2024-11-22T10:00:52.370Z",
        "updatedAt": "2024-11-22T10:00:52.370Z",
        "__v": 0
    }
}
```

---

#### 4. Update a Bicycle

- **Endpoint:** `/api/products/:productId`
- **Method:** `PUT`
- **Body:**

```
{
  "price": 350,
  "quantity": 15
}
```

- **Response:** Success message and updated bicycle details.

```
{
    "statusCode": 200,
    "success": true,
    "message": "Bicycle updated successfully",
    "data": {
        "_id": "6740565436e55ee850aa8aed",
        "name": "Racer Elite",
        "brand": "Velocity",
        "price": 350, // Price updated
        "type": "Road",
        "description": "Designed for professional racers seeking ultimate speed.",
        "quantity": 15, // Quantity updated
        "inStock": true,
        "createdAt": "2024-11-22T10:00:52.370Z",
        "updatedAt": "2024-11-24T13:19:14.661Z", // Updated timestamp
        "__v": 0
    }
}
```

---

#### 5. Delete a Bicycle

- **Endpoint:** `/api/products/:productId`
- **Method:** `DELETE`
- **Response:** Success message confirming the bicycle has been deleted.

```
{
    "statusCode": 200,
    "success": true,
    "message": "Bicycle deleted successfully",
    "data": {}
}
```

---

#### Orders (Bicycle)

#### 1. Order a Bicycle

- **Endpoint:** `/api/orders`
- **Method:** `POST`
- **Body:**

```
{
  "email": "customer@example.com",
  "product": "6743293933aaaad8284f4a72",
  "quantity": 1,
  "totalPrice": 200
}
```

- **Response:**

```
{
    "statusCode": 201,
    "success": true,
    "message": "Order created successfully",
    "data": {
        "email": "customer@example.com",
        "product": "6743293933aaaad8284f4a72",
        "quantity": 1,
        "totalPrice": 200,
        "_id": "6743296633aaaad8284f4a76",
        "createdAt": "2024-11-24T13:25:58.465Z",
        "updatedAt": "2024-11-24T13:25:58.465Z",
        "__v": 0
    }
}
```

---

#### 2. Calculate Revenue from Orders

- **Endpoint:** `/api/orders/revenue`
- **Method:** `GET`
- **Response:**

```
{
    "statusCode": 200,
    "success": true,
    "message": "Revenue fetched successfully",
    "data": {
        "totalRevenue": 2200
    }
}
```
