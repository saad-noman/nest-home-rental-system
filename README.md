# NEST: MERN-Based Home Rental System

## Overview 📊

NEST is a full-stack web application built with the **MERN** (MongoDB, Express, React, Node.js) stack that simplifies the home rental process. The platform allows homeowners to list rental properties and tenants to browse, book, and pay rent online. Role-based access provides dedicated dashboards for owners and tenants, while integrated features like booking requests, rent payment tracking, and an interactive map enhance the user experience.

![image_alt](https://github.com/saad-noman/nest-home-rental-system/blob/7d54a6860a5d2137f80d52f71721ca6b1938a213/nest_overview.jpg)

---

## Features ✨

### 👤 Role-Based Authentication

- User registration and login system.
- Supports multiple roles: **Owner**, and **Tenant**.

### 👤 Role-Based User Dashboards

- Customized dashboard views tailored to each user role.
- Optimized interface for tenants and owners to manage their activities efficiently.

### 📝 Property Management (Owners)

- **CRUD Operations:** Owners can create, read, update, and delete their property listings.
- **Calendar-Based Availability:** Mark specific dates to indicate property availability.

### 🔍 Property Browsing (Tenants)

- **Search & Filter:** Quickly browse available properties with images.
- **Sorting Options:** Sort properties by price, location, or availability.
- **Booking Requests:** Send booking requests to property owners.

### 💵 Rent Payment Management

- **Monthly Payment Tracking:** Track rent payments for each property.
- **Simulated Transaction System:** Provides a realistic transaction history.
- **Sortable Payment History:** Filter and sort payments by date, amount, or status.
- **Notifications:** Automated alerts for upcoming or overdue rent payments.

### ⭐ Rating and Review System

- Tenants can rate and review properties and property owners.
- Helps maintain transparency and trust within the platform.

### 🗺️ Interactive Map Integration

- Display property locations on an interactive map.
- Click on markers to view detailed property information.

---

## Technology Stack ⚙️

- **Frontend:** React, Tailwind CSS, HTML5
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT-based authentication
- **Maps Integration:** Interactive maps using Leaflet.js and OpenStreetMap
- **Version Control:** Git & GitHub

---

## Project Structure 🛠️

```
nest-home-rental/
├─ server/          # Node.js + Express API
├─ client/         # React + Tailwind CSS
├─ README.md
├─ package.json
└─ .gitignore
```

---
