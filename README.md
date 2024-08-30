# Finance
## Live Preview
You can preview the live version of the application [here](https://zrdzn.dev).
## Features
### Vault Management
A Vault is a central place where you manage members, payments, products, categories — essentially everything within the application.
Each user can create multiple vaults, and automatically becomes a member with the owner role for the vaults they create.
### Products and Categories
Create and manage products and categories for easy reuse when adding payment records.
### Payment Records
Create detailed payment records with the ability to add existing products to these records. 
### Statistics and Reporting
View various statistics, including average expenses and total expenses over specific periods. 
### User and Member Management
Invite new users to vaults, manage existing vault members, and assign roles.
### Vault Settings
Customize the settings for each vault to suit your needs.
### Currency Conversion
View real exchange rates to display financial data in different currencies.
### Responsive Design
The application is designed with a mobile-first approach, ensuring that it is fully responsive and accessible on all device types.
## Infrastructure
### Backend
The backend provides access to other infrastructure elements, such as the database, and offers a REST API for clients.
  - **Language:** [Kotlin](https://kotlinlang.org/)
  - **Framework:** [Spring](https://spring.io/)
### Frontend
The frontend consists of a dashboard accessible via a website.
  - **Language:** [TypeScript](https://www.typescriptlang.org/)
  - **Framework:** [Next.JS](https://nextjs.org/)
### Database
The database stores all data required for the application to function.
  - **Management System:** [PostgreSQL](https://www.postgresql.org/)
  - **Migration Files:** [View schema](https://github.com/zrdzn/finance/tree/main/finance-backend/src/main/resources/database)
## Environment Variables
- `SERVER_PORT` - Port on which server will be running
- `CLIENT_URL` - Frontend URL
- `DATABASE_URL` - Database JDBC URL
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
- `NEXT_PUBLIC_BACKEND_URL` - Backend URL
## Installation
### Docker
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
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE)