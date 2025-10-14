# KJSIT Inventory Management System - Spring Boot Backend

## Overview
This is the Spring Boot backend for the KJSIT Inventory Management System. It has been migrated from a traditional Maven Servlet-based application to a modern Spring Boot REST API.

## Technology Stack
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- MySQL Database
- Lombok
- Maven

## Prerequisites
- Java 17 or higher
- MySQL 8.0+
- Maven 3.6+

## Database Setup

1. Create MySQL database:
```sql
CREATE DATABASE IF NOT EXISTS kjsit_inventory CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Update database credentials in `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/kjsit_inventory
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Run the SQL schema from `database/kjsit_inventory_mysql_schema.sql` to create tables and sample data.

## Running the Application

### Using Maven

1. Navigate to the spring-backend directory:
```bash
cd spring-backend
```

2. Build the application:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8080/api`

### Using Java JAR

1. Build the JAR file:
```bash
mvn clean package
```

2. Run the JAR:
```bash
java -jar target/inventory-management-1.0.0.jar
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Inventory Items
- `GET /api/items` - Get all items
- `GET /api/items/{id}` - Get item by ID
- `GET /api/items/low-stock` - Get low stock items
- `POST /api/items` - Create new item (Staff/Admin only)
- `PUT /api/items/{id}` - Update item (Staff/Admin only)
- `POST /api/items/{id}/approve` - Approve item (Admin only)
- `DELETE /api/items/{id}` - Delete item (Admin only)

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/{id}` - Get transaction by ID
- `POST /api/transactions` - Create transaction request
- `POST /api/transactions/{id}/approve` - Approve transaction (Admin only)
- `POST /api/transactions/{id}/return` - Return borrowed item
- `DELETE /api/transactions/{id}` - Delete transaction (Admin only)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

## Default Users

| Username | Password | Role    |
|----------|----------|---------|
| admin    | password | admin   |
| staff1   | password | staff   |
| faculty1 | password | faculty |
| student1 | password | student |

## Project Structure

```
spring-backend/
├── src/
│   ├── main/
│   │   ├── java/com/kjsit/inventory/
│   │   │   ├── config/           # Configuration classes
│   │   │   ├── controller/       # REST Controllers
│   │   │   ├── dto/              # Data Transfer Objects
│   │   │   ├── entity/           # JPA Entities
│   │   │   ├── repository/       # Spring Data Repositories
│   │   │   ├── service/          # Business Logic Layer
│   │   │   └── InventoryManagementApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
└── README.md
```

## Development

### Hot Reload
Spring Boot DevTools is included for automatic application restart during development.

### Logging
Application logs are configured in `application.properties`. Default log level is DEBUG for the application package.

### Database Schema Updates
The application is configured with `spring.jpa.hibernate.ddl-auto=update` which will automatically update the database schema. For production, change this to `validate` and use proper migrations.

## Building for Production

1. Update `application.properties` for production settings
2. Build the application:
```bash
mvn clean package -DskipTests
```

3. The JAR file will be created in `target/inventory-management-1.0.0.jar`

## Testing

Run tests using:
```bash
mvn test
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure the database exists

### Port Already in Use
Change the port in `application.properties`:
```properties
server.port=8081
```

### Session Issues
Sessions are stored in memory by default. For production, configure a persistent session store.

## Migration Notes

This application has been migrated from:
- Traditional Servlets → Spring MVC REST Controllers
- JDBC DAOs → Spring Data JPA Repositories
- Manual connection management → Spring Boot auto-configuration
- Session-based auth remains the same

## Support

For issues and questions, please contact the development team.
