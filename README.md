# E-Commerce Backend API

A full-featured **Node.js + Express + MongoDB** backend project built for the **NTI Node.js Backend Development Exam**.  
This project combines three main domains in one backend system:

- **Authentication & User Management**
- **E-Commerce System**
- **HR Management System**
- **Real-Time Notifications with Socket.io**

The repository currently contains modules for auth, users, categories, subcategories, products, cart, orders, staff, attendance, deductions, salary, and socket setup, and the project uses `bcrypt`, `cloudinary`, `dotenv`, `express`, `joi`, `jsonwebtoken`, `mongoose`, `multer`, `nodemailer`, and `socket.io`. 0

---

## Project Overview

This backend was developed to satisfy the exam requirements for:

- secure authentication with JWT
- email verification and password reset
- user profile management
- category, subcategory, and product management
- cart and checkout flow
- admin order management
- staff and attendance handling
- salary and deduction calculations
- real-time admin offers using Socket.io

According to the exam PDF, the core project requires auth, users, categories, products, cart, orders, HR, and Socket.io, while **Stripe/card payment**, **ticket support**, and **Cypress testing** are bonus or extra-credit parts. 1 2

---

## Implemented Features

### 1) Authentication & User Management
- User signup
- User login
- Email verification
- Resend verification email
- Forgot password
- Reset password
- JWT-based authentication
- Role-based authorization
- User profile retrieval
- User profile update
- Soft delete for user accounts
- User avatar upload

The exam requires signup, login, verify email, resend verification, forgot password, reset password, and profile APIs, which match the scope of this project. 3

### 2) Category & Subcategory Management
- Create category
- Update category
- Soft delete category
- List categories
- Create subcategory
- Update subcategory
- Soft delete subcategory
- Get category subcategories
- Get subcategory details

These are part of the required e-commerce module in the exam specification. 4

### 3) Product Management
- Add product
- Update product
- Soft delete product
- Update stock quantity
- Get all active products
- Get single product details
- Filter by category
- Filter by subcategory
- Support filtering, sorting, and pagination

The exam product module explicitly requires admin product CRUD, stock update, public product listing, and query support such as pagination and price filters. 5

### 4) Cart System
- Add item to cart
- View cart
- Update quantity
- Remove item from cart
- Clear cart

The exam requires product existence checks, stock validation, quantity updates, and cart total calculation. 6

### 5) Order System
- Checkout cart
- Get user orders
- Get single order details
- Get all orders as admin
- Update order status as admin
- Cash on Delivery checkout flow

The exam makes **Cash on Delivery** the required payment method and treats **Visa/Card via Stripe** as a bonus implementation. 7

### 6) HR Management System
- Staff management
- Daily attendance check-in
- Daily attendance check-out
- Manual deductions
- Monthly salary calculation
- Salary payment status update
- Salary adjustment handling

The exam includes staff APIs, attendance APIs, salary and deduction APIs, plus monthly salary calculation and payment marking. 8

### 7) Real-Time Notifications
- Socket.io setup
- Admin broadcast offers/messages
- Authenticated user connections
- Real-time delivery of offers to connected users

The exam requires a simple admin broadcast system where authenticated admins can send offers and all connected users receive them instantly. 9

### 8) Image Uploads
- File upload handling with Multer
- Cloud image hosting with Cloudinary

The repo includes both `multer` and `cloudinary` in dependencies, and the exam lists Multer as required and cloud storage as bonus. 10 11 12

---

## Not Implemented

The following parts from the exam are **not implemented in this repository**:

- **Stripe / Visa card payment**
- **Ticket Support System**
- **Testing with Cypress**

These are listed in the exam as bonus or extra-credit sections rather than core required sections. 13 14

---

## Tech Stack

- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**
- **JWT**
- **bcrypt**
- **Joi**
- **N