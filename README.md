# 🌟 The Volunteer

A full-stack application serving as a platform to connect volunteers with meaningful missions and exciting opportunities for community service. Built with **Node.js**, **Express**, and **PostgreSQL**.

---

## 🎯 Project Goal  
The Volunteer aims to make volunteering accessible and rewarding by bridging the gap between organizations in need and passionate individuals ready to make a difference.

---

## 🚀 Features
- 🔒 **Authentication System**: Secure login and registration using `passport.js` and hashed passwords.
- 🖥️ **Dynamic Views**: Renders pages with **EJS** templating.
- 📊 **PostgreSQL Database**: Manages user data and profiles.
- 🧩 **Session Management**: Persistent sessions using `express-session`.
- ✉️ **Flash Messages**: Provides feedback for actions like login errors or successful registration.

---

## 📂 Project Structure
- **Routes**: Defined for user registration, login, dashboard, and profile management.
- **Database**: Queries and stores user information in a PostgreSQL database.
- **Middleware**: Handles session persistence, form parsing, and authentication.

---

## 🛠️ Setup & Run

### Prerequisites
- Node.js
- PostgreSQL
- Environment file (`.env`) with the following variables:
  ```env
  SESSION_SECRET=<your_secret_key>
  PORT=3000
