# Finance
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
## Environment variables
- `SERVER_PORT` - Port on which server will be running
- `DATABASE_URL` - Database JDBC URL
- `DATABASE_USERNAME` - Database username
- `DATABASE_PASSWORD` - Database password
## Installation
### Standalone
#### Backend
**1.** Download latest .jar from [releases](https://github.com/zrdzn/finance/releases)

**2.** Run downloaded .jar
```bash
java -jar finance-backend-0.1.0-SNAPSHOT.jar
```
#### Frontend
**1.** Download latest .zip from [releases](https://github.com/zrdzn/finance/releases)

**2.** Unzip downloaded .zip

**3.** Run frontend service with npm
```bash
npm run start
```

### Docker
**1.** Pull images from Docker Hub
```bash
docker pull zrdzn/finance-backend:latest
docker pull zrdzn/finance-frontend:latest
```
**2.** Run images
```bash
docker-compose up -d
```
## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE)