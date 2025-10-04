# Java Backend Implementation Guide

This directory contains the Java Servlet code for the KJSIT Inventory Management System backend.

## Prerequisites

Before implementing the Java backend, ensure you have:

1. **JDK 11 or higher** installed
2. **Apache Tomcat 9.0 or higher** installed
3. **MySQL 8.0 or higher** installed and running
4. **MySQL Connector/J** (JDBC driver) - Version 8.0.33 or compatible
5. **Maven** (optional but recommended for dependency management)

## Project Structure

```
java-backend/
├── src/
│   └── com/
│       └── kjsit/
│           └── inventory/
│               ├── model/
│               │   ├── User.java
│               │   ├── Item.java
│               │   ├── Transaction.java
│               │   ├── Category.java
│               │   └── Department.java
│               ├── dao/
│               │   ├── DatabaseConnection.java
│               │   ├── UserDAO.java
│               │   ├── ItemDAO.java
│               │   └── TransactionDAO.java
│               ├── servlet/
│               │   ├── LoginServlet.java
│               │   ├── ItemServlet.java
│               │   ├── TransactionServlet.java
│               │   └── DashboardServlet.java
│               └── util/
│                   ├── ResponseUtil.java
│                   └── ValidationUtil.java
├── web/
│   └── WEB-INF/
│       └── web.xml
└── pom.xml (if using Maven)
```

## Maven Configuration (pom.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.kjsit</groupId>
    <artifactId>inventory-management</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>war</packaging>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    </properties>

    <dependencies>
        <!-- Servlet API -->
        <dependency>
            <groupId>javax.servlet</groupId>
            <artifactId>javax.servlet-api</artifactId>
            <version>4.0.1</version>
            <scope>provided</scope>
        </dependency>

        <!-- MySQL Connector -->
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
            <version>8.0.33</version>
        </dependency>

        <!-- JSON Processing -->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>2.10.1</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-war-plugin</artifactId>
                <version>3.3.2</version>
            </plugin>
        </plugins>
    </build>
</project>
```

## Database Configuration

Create a file `database.properties` in `src/` directory:

```properties
db.url=jdbc:mysql://localhost:3306/kjsit_inventory?useSSL=false&serverTimezone=UTC
db.username=root
db.password=your_mysql_password
db.driver=com.mysql.cj.jdbc.Driver
```

## Implementation Steps

### Step 1: Set Up Database

1. Open MySQL command line or MySQL Workbench
2. Create the database:
   ```sql
   CREATE DATABASE kjsit_inventory;
   USE kjsit_inventory;
   ```
3. Run the schema.sql file:
   ```bash
   mysql -u root -p kjsit_inventory < database/schema.sql
   ```
4. Run the data.sql file:
   ```bash
   mysql -u root -p kjsit_inventory < database/data.sql
   ```

### Step 2: Create Maven Project

```bash
mvn archetype:generate -DgroupId=com.kjsit -DartifactId=inventory-management -DarchetypeArtifactId=maven-archetype-webapp -DinteractiveMode=false
```

### Step 3: Add Dependencies

Update your `pom.xml` with the dependencies shown above.

### Step 4: Implement Java Classes

Create the Java files in the following order:

1. **Model Classes** (User.java, Item.java, Transaction.java, etc.)
2. **DatabaseConnection.java** - Database connection utility
3. **DAO Classes** - Data Access Objects
4. **Servlet Classes** - Request handlers
5. **Utility Classes** - Helper methods

### Step 5: Configure web.xml

Create `WEB-INF/web.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<web-app xmlns="http://xmlns.jcp.org/xml/ns/javaee"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/javaee
         http://xmlns.jcp.org/xml/ns/javaee/web-app_4_0.xsd"
         version="4.0">

    <display-name>KJSIT Inventory Management System</display-name>

    <!-- Servlet Mappings -->
    <servlet>
        <servlet-name>LoginServlet</servlet-name>
        <servlet-class>com.kjsit.inventory.servlet.LoginServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>LoginServlet</servlet-name>
        <url-pattern>/api/login</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>ItemServlet</servlet-name>
        <servlet-class>com.kjsit.inventory.servlet.ItemServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>ItemServlet</servlet-name>
        <url-pattern>/api/items</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>TransactionServlet</servlet-name>
        <servlet-class>com.kjsit.inventory.servlet.TransactionServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>TransactionServlet</servlet-name>
        <url-pattern>/api/transactions</url-pattern>
    </servlet-mapping>

    <servlet>
        <servlet-name>DashboardServlet</servlet-name>
        <servlet-class>com.kjsit.inventory.servlet.DashboardServlet</servlet-class>
    </servlet>
    <servlet-mapping>
        <servlet-name>DashboardServlet</servlet-name>
        <url-pattern>/api/dashboard</url-pattern>
    </servlet-mapping>

    <!-- CORS Filter -->
    <filter>
        <filter-name>CorsFilter</filter-name>
        <filter-class>com.kjsit.inventory.filter.CorsFilter</filter-class>
    </filter>
    <filter-mapping>
        <filter-name>CorsFilter</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>

    <!-- Welcome File -->
    <welcome-file-list>
        <welcome-file>index.html</welcome-file>
    </welcome-file-list>
</web-app>
```

### Step 6: Build the Project

```bash
mvn clean package
```

This will create a WAR file in the `target/` directory.

### Step 7: Deploy to Tomcat

1. Copy the generated WAR file from `target/inventory-management.war`
2. Paste it into Tomcat's `webapps/` directory
3. Start Tomcat server:
   ```bash
   # On Windows
   catalina.bat start

   # On Linux/Mac
   ./catalina.sh start
   ```
4. Access the application at: `http://localhost:8080/inventory-management/`

## API Endpoints

### Authentication

- **POST** `/api/login` - User login
  ```json
  Request: {
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }
  Response: {
    "success": true,
    "user": {...}
  }
  ```

### Inventory Items

- **GET** `/api/items` - Get all items
- **GET** `/api/items?id=1` - Get item by ID
- **POST** `/api/items` - Create new item (Admin/Staff only)
- **PUT** `/api/items` - Update item (Admin/Staff only)
- **DELETE** `/api/items?id=1` - Delete item (Admin/Staff only)

### Transactions

- **GET** `/api/transactions` - Get all transactions
- **GET** `/api/transactions?userId=1` - Get user's transactions
- **POST** `/api/transactions` - Create checkout request (Student)
- **PUT** `/api/transactions/approve` - Approve request (Admin/Staff)
- **PUT** `/api/transactions/reject` - Reject request (Admin/Staff)

### Dashboard

- **GET** `/api/dashboard?role=admin&userId=1` - Get dashboard statistics

## Updating Frontend to Use API

Replace the mock data calls in JavaScript files with fetch API calls:

### Example: auth.js

```javascript
// Replace the mock login with API call
const response = await fetch('http://localhost:8080/inventory-management/api/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password, role })
});

const data = await response.json();
if (data.success) {
    setCurrentUser(data.user);
    window.location.href = 'dashboard.html';
} else {
    alert('Invalid credentials!');
}
```

## Testing the Backend

1. **Test Database Connection**: Run a simple servlet that queries the database
2. **Test Login**: Use the login page to authenticate
3. **Test CRUD Operations**: Add, edit, view, and delete items
4. **Test Transactions**: Create and approve/reject requests

## Troubleshooting

### Common Issues

1. **ClassNotFoundException: com.mysql.cj.jdbc.Driver**
   - Make sure MySQL Connector JAR is in `WEB-INF/lib/` or added via Maven

2. **Connection Refused**
   - Check if MySQL is running
   - Verify database credentials in database.properties

3. **404 Error**
   - Check servlet mappings in web.xml
   - Verify URL patterns match your API calls

4. **CORS Errors**
   - Implement CORS filter (included in example servlets)
   - Set proper headers in responses

5. **Port Conflicts**
   - Change Tomcat port in `server.xml` if 8080 is in use

## Security Considerations

1. **Password Hashing**: Use BCrypt or similar for password hashing
2. **SQL Injection**: Always use PreparedStatements
3. **Session Management**: Implement proper session handling
4. **Input Validation**: Validate all user inputs
5. **HTTPS**: Use HTTPS in production

## Next Steps

1. Implement all model classes
2. Create DAO classes for database operations
3. Implement servlet classes for API endpoints
4. Add authentication filters
5. Test all endpoints
6. Update frontend JavaScript to use real API
7. Deploy to production server

## Support

For issues or questions:
- Check Apache Tomcat logs: `logs/catalina.out`
- Check MySQL logs
- Review servlet error messages in browser console
