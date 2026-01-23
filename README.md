# Satyasakshi Backend API

A vehicle management system for tracking stolen vehicles, recovered vehicles, re-registrations, and traffic challans with ZIPNET integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:8080`

## ⚙️ Setup

### Database Configuration
Edit `config/db.js`:
```javascript
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "satyasakshi"
});
```

Create database:
```sql
CREATE DATABASE satyasakshi;
```

## 📁 Project Structure

```
├── controllers/     # Request handlers
├── services/        # Business logic
├── routes/          # API routes
├── middleware/      # JWT authentication
├── config/          # Database config
├── cron/            # Scheduled tasks
└── index.js         # Entry point
```

## 📡 API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

**Vehicles:**
- `POST /api/save-vehicle` - Save vehicle
- `GET /api/search-vehicle` - Search vehicle

**Stolen Vehicles:**
- `GET /api/stolen-vehicles` - Get stolen vehicles

**Recovered Vehicles:**
- `POST /api/recovered-vehicle` - Add recovered vehicle
- `GET /api/recovered-vehicle` - Get recovered vehicles
- `GET /api/sync-recovered` - Manual sync from ZIPNET

**Other:**
- `GET /api/challans` - Get challans
- `GET /api/re-registration` - Get re-registration data

**Admin (Protected):**
- `POST /api/admins` - Create admin (SUPER_ADMIN)
- `GET /api/admins` - List admins (SUPER_ADMIN)
- `GET /api/admin/recovered/count` - Vehicle count (ADMIN)

## 🔐 Authentication

Uses JWT tokens. Include in header:
```
Authorization: Bearer <token>
```

**Roles:** SUPER_ADMIN, ADMIN, USER, FEILD EXECUTIVE

## ⏰ Cron Jobs

- Daily sync at 2:00 AM (ZIPNET data)
- Manual sync on server startup

## 📦 Tech Stack

- **Express.js** v5.2.1 - Web framework
- **MySQL 2** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **node-cron** - Task scheduling
- **axios** - HTTP client
- **cheerio** - Web scraping
- **nodemon** - Dev auto-reload

## ✅ Features

✅ Vehicle registration and search
✅ Stolen/recovered vehicle tracking
✅ JWT authentication with roles
✅ Admin panel
✅ Automated ZIPNET sync
✅ Traffic challan management
✅ Vehicle re-registration
✅ CORS enabled

## 📝 License

ISC

---

**Author:** Laxman Gudimalla | **Updated:** January 2026