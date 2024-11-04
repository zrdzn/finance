# Finance
## 📖 Overview
**Finance** is a tool for managing personal and shared finances.
It allows users to create vaults where they can track payments, 
manage products, and categorize expenses.
Users can invite others to their vaults to collaborate.
The app provides detailed statistics, such as total income and expenses, 
and allows users to export transactions to a .CSV file.
With currency conversion and a design optimized for mobile devices,
**Finance** makes it easy to manage finances on any device.
The backend is built with Kotlin and offers a REST API, 
while the frontend uses Next.js with TypeScript.
Data is securely stored in a PostgreSQL database.
## 🛠️ Features

### 🔐 Vault Management
- A Vault is a central place for managing:
    - Members
    - Transactions
    - Products
    - Categories
- Users can create multiple vaults and automatically become members with owner roles

### 🛒 Products and Categories
- Create and manage products and categories for easy reuse when adding payment records
- Each product that has assigned category will have a label next to its name

### 💳 Transactions
- Create detailed transactions, with the ability to:
    - Specify description, currency, payment method and type of transaction
    - Add existing products to transactions
    - Manage existing transactions

#### 📝 Export Transactions to .CSV File
- Easily export transactions to a .CSV file for offline access and analysis

### 📊 Statistics and Reporting
- View various statistics, including:
    - Total amount of transactions
    - Total income and expenses over specific periods

### 👥 User and Member Management
- Invite new users to vaults
- Manage existing vault members and assign roles

### ⚙️ Vault Settings
- Customize settings for each vault to suit your needs

### 💱 Currency Conversion
- View real exchange rates to display financial data in different currencies

### 📱 Responsive Design
- The application follows a mobile-first approach, ensuring full responsiveness and accessibility on all devices
## 🛠️ Infrastructure
### 💻 Backend
- The backend provides access to other infrastructure elements, such as the database, and offers a REST API for clients.
  - **Language:** [Kotlin](https://kotlinlang.org/)
  - **Framework:** [Spring](https://spring.io/)
### 🌐 Frontend
- The frontend consists of a dashboard accessible via a website.
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
  - **Framework:** [Next.JS](https://nextjs.org/)
### 🗄️ Database
- The database stores all data required for the application to function.
  - **Management System:** [PostgreSQL](https://www.postgresql.org/)
  - **Migration Files:** [View schema](https://github.com/zrdzn/finance/tree/main/finance-backend/src/main/resources/database)
## ⚙️ Environment Variables
- `SERVER_PORT` - Port on which server will be running
- `CLIENT_URL` - Frontend URL
- `DATABASE_URL` - Database JDBC URL
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `NEXT_PUBLIC_API_URL` - Backend URL
- `MAIL_HOST` - SMTP server host
- `MAIL_PORT` - SMTP server port
- `MAIL_USERNAME` - SMTP server username
- `MAIL_PASSWORD` - SMTP server password
- `MAIL_FROM` - Email address from which emails will be sent
## 🚀 Installation
### 🐳 Docker
**1.** Pull images from Docker Hub
```bash
docker pull zrdzn/finance-backend:latest
docker pull zrdzn/finance-frontend:latest
```
**2.** Configure `.env` file to your needs

**3.** Copy docker [compose file](compose.yml)

**4.** Run images
```bash
docker-compose up backend -d
docker-compose up frontend -d
```
## 🧑‍💻 Developers
### 📜 API Documentation
- You can access the **Swagger** UI for detailed API documentation at `<backend-url>/swagger-ui.html`.
- Additionally, an **OpenAPI** specification is available at `<backend-url>/v3/api-docs` for integration and development purposes.
### 🏗️ Building from Source
To build the backend from source, you can follow these simple steps:

1. Clone the repository:
```bash
git clone https://github.com/zrdzn/finance.git
cd finance/finance-backend
```
2. Build the backend using Gradle:
```bash
./gradlew bootJar
```
## 📄 License
- This project is licensed under the MIT License - see the [LICENSE](LICENSE)
