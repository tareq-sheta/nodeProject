🛍️ Storefront API
This project is the backend API for a storefront application. It's built with Node.js, Express, TypeScript, and MongoDB to provide all the necessary endpoints for user management, product handling, and order processing.

🚀 Getting Started
📦 Prerequisites & Installation
To run this project, you need Node.js and npm installed.

Clone the repository:

Bash

git clone [your-repo-url]
cd storefront-backend
Install dependencies:

Bash

npm install
⚙️ Configuration
Environment Variables: Create a .env file in the project's root directory. This file holds your database credentials and other secret keys.

ENV=dev
MONGO_HOST=127.0.0.1
MONGO_DB=nodeProj
TOKEN_SECRET=your_super_secret_token
PEPPER=your_pepper_string
PORT=8888
Database Connection: The application connects to MongoDB using Mongoose. The connection logic is handled by the src/config/db.ts file, which uses the environment variables you've set up.

Server Port: 8888

Database Port: 27017 (default for MongoDB)

📈 API Endpoints
This API is designed with a RESTful architecture, separating concerns into controllers and models. All sensitive endpoints are secured with JSON Web Tokens (JWT) for authentication.

Users
HTTP Method Route Description Protected (Requires JWT)
POST /users/authenticate Authenticates a user and returns a JWT. No
POST /users Creates a new user account. No
GET /users Retrieves all users. Yes
GET /users/:id Retrieves one user by ID. Yes
PUT /users/:id Updates a user account. Yes
DELETE /users/:id Deletes a user account. Yes

Export to Sheets
Products
HTTP Method Route Description Protected (Requires JWT)
GET /products Retrieves all products. No
GET /products/:id Retrieves a single product by ID. No
POST /products Creates a new product. Yes
PUT /products/:id Updates an existing product. Yes
DELETE /products/:id Deletes a product. Yes

Export to Sheets
Orders
HTTP Method Route Description Protected (Requires JWT)
GET /orders Retrieves all orders. Yes
GET /orders/:id Retrieves a single order by ID. Yes
POST /orders Creates a new order. Yes
PUT /orders/:id Updates an existing order. Yes
DELETE /orders/:id Deletes an order. Yes

Export to Sheets
🗄️ Database Schema
The project uses MongoDB as its database, with data organized into collections that follow these schemas. The relationships between collections are handled at the application level. .

Users Collection:

\_id: MongoDB's default unique identifier.

username: String, required.

password: String, required (hashed using bcrypt).
role: String, required (user or selleror admin).
-----------------------

Products Collection:

\_id: MongoDB's default unique identifier.

name: String, required.

price: Number, required.

photo: String , optional default .

seller_id: String (references the User's 

category: String, optional.

-----------------------
Orders Collection:

\_id: MongoDB's default unique identifier.

user_id: String (references the User's \_id).

product_id: String (references the Product's \_id).

quantity: Number, required.

status: String, required (active or complete).

-----------------------
cart Collection:

user_id: String (references the User's 

product_id: String (references the Product's 

quantity: Number, required.


🛡️ Security & Features
Password Hashing: Passwords are not stored in plain text. They are hashed using bcrypt before being saved to the database, with a salt and pepper to ensure security. The hashing function is in a dedicated file to maintain a clean separation of concerns.

Authentication: JWTs are used for secure authentication. Upon successful login, a token is issued and must be included in the headers of all protected requests.

Testing: The project includes a comprehensive test suite to ensure all endpoints and functions work as expected.

To run tests: npm test

Code Quality: eslint and prettier are configured to enforce code quality and a consistent style.

Migrations: Since MongoDB is a NoSQL database, traditional migrations are not used. Schema changes are handled directly in the Mongoose models.
