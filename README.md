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
The project is structured using DDD to organize the system into distinct domains,
with a [design](https://learn.microsoft.com/en-us/dotnet/architecture/microservices/microservice-ddd-cqrs-patterns/ddd-oriented-microservice) 
that supports future migration to microservices.
## 🛠️ Features

### AI Image Analysis
- Upload images of receipts and invoices to automatically extract transaction data
- AI-powered image recognition scans and identifies products, prices, and transaction details
- Edit and verify AI-extracted data before finalizing the transaction
- Supports various receipt formats from different merchants and shops

### Vault Management
- A Vault is a central place for managing:
    - Members
    - Transactions
    - Recurring transactions
    - Products
    - Categories
- Users can create multiple vaults and automatically become members with owner roles

### Products and Categories
- Create and manage products and categories for easy reuse when adding transaction records
- Each product that has assigned category will have a label next to its name

### Transactions
- Create detailed transactions, with the ability to:
    - Specify description, currency, transaction method and type of transaction
    - Add existing products to transactions
    - Manage existing transactions
- Schedule recurring transactions to automate transactions

#### Export Transactions
- Easily export transactions to a .CSV file for offline access and analysis

#### Import Transactions
- Import transactions from a .CSV file to quickly add multiple transactions by mapping columns to fields

### Statistics and Reporting
- View various statistics, including:
    - Total amount of transactions
    - Total income and expenses over specific periods

### User and Member Management
- Invite new users to vaults
- Setup two-factor authentication for security
- Verify accounts via email
- Change avatar, username, email and password
- Manage existing vault members and assign roles

### Vault Settings
- Customize settings for each vault to suit your needs
- Change vault name, currency and default transaction method
- Delete vaults and all associated data

### Currency Conversion
- View real exchange rates to display financial data in different currencies
- Exchange rates are displayed based on currency set in vault settings

### Responsive Design
- The application follows a mobile-first approach, ensuring full responsiveness and accessibility on all devices
## 🛠️ Infrastructure
### Backend
- The backend provides access to other infrastructure elements, such as the database, and offers a REST API for clients.
  - **Language:** [Kotlin](https://kotlinlang.org/)
  - **Framework:** [Spring](https://spring.io/)
  - **Default port:** 8080
### Frontend
- The frontend consists of a dashboard accessible via a website.
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
  - **Framework:** [Next.JS](https://nextjs.org/)
  - **Default port:** 3010
### AI
- The AI system is used to analyze images and extract transaction data.
  - **Service:** [OpenAI](https://openai.com/)
  - **Client:** [simple-openai](https://github.com/sashirestela/simple-openai)
### Database
- The database stores all data required for the application to function.
  - **Management System:** [PostgreSQL](https://www.postgresql.org/)
  - **ORM:** [Hibernate](https://hibernate.org/)
  - **Migrations:** [Liquibase](https://www.liquibase.com/) ([view files](https://github.com/zrdzn/finance/tree/main/finance-backend/src/main/resources/database))
### Storage
- The storage system is used to store files, such as user avatars.
  - **Service:** [Amazon S3](https://aws.amazon.com/s3/)
  - **Client:** [MinIO](https://min.io/)
  - **Test client:** [LocalStack](https://localstack.cloud/)
### Mailing
- The mail system is used to send emails to users, such as verification emails.
  - **Test client:** [MailHog](https://github.com/mailhog/MailHog)
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
- `STORAGE_ACCESS_KEY` - S3 access key
- `STORAGE_SECRET_KEY` - S3 secret key
- `STORAGE_REGION` - S3 region
- `STORAGE_ENDPOINT` - S3 endpoint
- `OPENAI_API_KEY` - OpenAI API key
## 🏛️ Architecture

## 🚀 Installation
### Docker
**1.** Pull images from Docker Hub
```bash
docker pull zrdzn/finance-backend:latest
docker pull zrdzn/finance-frontend:latest
```
**2.** Configure `.env` file to your needs

**3.** Run images
```bash
docker run -d --name finance-backend -p 8080:8080 --env-file .env zrdzn/finance-backend:latest
docker run -d --name finance-frontend -p 3010:3010 --env-file .env zrdzn/finance-frontend:latest
```

### AI Features (Optional)
**1.** Sign up for an OpenAI API key at [OpenAI](https://platform.openai.com/)

**2.** Add your API key to the `.env` file
```bash
OPENAI_API_KEY=your-api-key
```
## 🧑‍💻 Developers
### API Documentation
- You can access the **Swagger** UI for detailed API documentation at `<backend-url>/swagger-ui.html`.
- Additionally, an **OpenAPI** specification is available at `<backend-url>/v3/api-docs` for integration and development purposes.
### Building from Source
To build the backend from source, you can follow these simple steps:

**1.** Clone the repository:
```bash
git clone https://github.com/zrdzn/finance.git
cd finance/finance-backend
```
**2.** Build the backend using Gradle:
```bash
./gradlew bootJar
```
## 📄 License
- This project is licensed under the MIT License - see the [LICENSE](LICENSE)
