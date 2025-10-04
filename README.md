# KJSIT Inventory Management System

A full-stack college inventory management system built for K.J. Somaiya Institute of Technology (KJSIT) using HTML, CSS, JavaScript, MySQL, and Java Servlets.

## 🎯 Project Overview

This system manages inventory across all departments of KJSIT including:
- Computer Engineering
- Information Technology
- AI & Data Science
- Electronics & Telecommunication
- Basic Sciences & Humanities
- Administration
- Student Facilities

## 🎨 Features

### User Roles
1. **Admin**: Full system access, can manage all inventory and users
2. **Staff**: Can manage inventory, approve/reject student requests
3. **Student**: Can view inventory and request items

### Core Functionality
- User authentication with role-based access control
- Complete CRUD operations for inventory items
- Item checkout/return system
- Real-time inventory tracking
- Dashboard with statistics
- Transaction history
- Search and filter functionality
- Low stock alerts

## 🎨 Design

- **Color Scheme**: Red (#a50d23) and White (#FFFFFF)
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth transitions

## 📁 Project Structure

```
project/
├── public/                      # Frontend files
│   ├── index.html              # Login page
│   ├── dashboard.html          # Dashboard
│   ├── inventory.html          # Inventory management
│   ├── transactions.html       # Transaction history
│   ├── css/
│   │   └── style.css          # All styling
│   └── js/
│       ├── mock_data.js       # Mock data for testing
│       ├── auth.js            # Authentication logic
│       ├── dashboard.js       # Dashboard logic
│       ├── inventory.js       # Inventory management
│       └── transactions.js    # Transaction management
│
├── database/                    # Database files
│   ├── schema.sql              # Database schema
│   └── data.sql                # Sample data
│
└── java-backend/                # Java backend (to be implemented)
    ├── README-JAVA.md          # Java implementation guide
    └── src/                    # Java source files
        └── com/kjsit/inventory/
            ├── model/          # Data models
            ├── dao/            # Database access
            ├── servlet/        # Request handlers
            └── util/           # Utilities
```

## 🚀 Quick Start

### Option 1: Frontend Only (Current Setup)

The frontend is ready to use with mock data. You have two ways to run it:

**Method A: Using Development Server (Recommended)**
```bash
npm install
npm run dev
```
Then open your browser to the URL shown (typically http://localhost:5173)

**Method B: Direct File Access**
Open `public/index.html` directly in a web browser

**Demo Credentials:**
- **Admin**: username: `admin`, password: `admin123`, role: `admin`
- **Staff**: username: `staff`, password: `staff123`, role: `staff`
- **Faculty**: username: `faculty`, password: `faculty123`, role: `faculty`
- **Student**: username: `student`, password: `student123`, role: `student`

### Option 2: Full Stack Setup

To implement the complete system with Java backend and MySQL:

#### Prerequisites
- JDK 11 or higher
- Apache Tomcat 9.0 or higher
- MySQL 8.0 or higher
- Maven (optional)

#### Database Setup

1. **Install MySQL** and start the server

2. **Create the database:**
   ```bash
   mysql -u root -p
   ```
   ```sql
   CREATE DATABASE kjsit_inventory;
   USE kjsit_inventory;
   ```

3. **Run the schema:**
   ```bash
   mysql -u root -p kjsit_inventory < database/schema.sql
   ```

4. **Load sample data:**
   ```bash
   mysql -u root -p kjsit_inventory < database/data.sql
   ```

#### Java Backend Setup

Follow the detailed instructions in `java-backend/README-JAVA.md` to:
1. Set up Maven project
2. Configure database connection
3. Implement Java servlets
4. Deploy to Tomcat
5. Update frontend to use API

## 📊 Database Schema

### Main Tables
- **users**: User accounts (admin, staff, students)
- **categories**: Item categories (Electronics, Computers, etc.)
- **departments**: College departments
- **inventory_items**: All inventory items
- **transactions**: Checkout/return transactions

### Key Features
- Foreign key constraints for data integrity
- Triggers for automatic quantity updates
- Views for complex queries
- Stored procedures for common operations
- Indexes for performance optimization

## 🔐 Security Features

- Role-based access control
- Password authentication (hash in production!)
- SQL injection prevention using PreparedStatements
- Session management
- CORS headers for API security

## 📱 User Interface

### Login Page
- Clean, modern login form
- Role selection (Admin/Staff/Student)
- Demo credentials displayed

### Dashboard
- Role-specific statistics
- Recent activity feed
- Pending requests (Admin/Staff)
- Current borrowings (Student)

### Inventory Page
- Grid view of all items
- Search and filter functionality
- Add/Edit/Delete (Admin/Staff)
- Request item (Student)
- Status indicators (Available/Low/Out of Stock)

### Transactions Page
- Complete transaction history
- Filter by status and department
- Approve/Reject actions (Admin/Staff)
- View own transactions (Student)

## 🎓 Educational Use

This project demonstrates:
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Java Servlets, JDBC
- **Database**: MySQL, normalization, triggers, stored procedures
- **Architecture**: MVC pattern, DAO pattern
- **Security**: Authentication, authorization, input validation
- **Best Practices**: Code organization, separation of concerns

## 📝 Demo Credentials

### Admin Access
- Username: `admin`
- Password: `admin123`
- Role: `admin`

### Staff Access
- Username: `staff`
- Password: `staff123`
- Role: `staff`

### Student Access
- Username: `student`
- Password: `student123`
- Role: `student`

## 🎯 Sample Inventory Data

The database includes realistic sample data for:
- 80+ inventory items across all departments
- 10+ categories
- 7 departments
- Multiple users with different roles
- Sample transactions in various states

## 🔧 Development

### Frontend Development
The frontend uses vanilla JavaScript with no frameworks. To modify:

1. **HTML**: Edit page structure in `.html` files
2. **CSS**: Update styles in `public/css/style.css`
3. **JavaScript**: Modify logic in `public/js/*.js` files

### Backend Development
See `java-backend/README-JAVA.md` for complete backend implementation guide.

## 🐛 Troubleshooting

### Frontend Issues
- **Page not loading**: Check browser console for errors
- **Styles not applying**: Clear browser cache
- **Login not working**: Verify credentials match demo accounts

### Backend Issues (When Implemented)
- **Database connection failed**: Check MySQL service and credentials
- **404 errors**: Verify Tomcat deployment and servlet mappings
- **CORS errors**: Ensure CORS headers are set in servlets

## 📚 Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Java Servlets, JDBC
- **Database**: MySQL 8.0
- **Server**: Apache Tomcat 9.0
- **Build Tool**: Maven (optional)

## 🎨 Color Reference

```css
Primary Red: #a50d23
White: #FFFFFF
Light Gray: #f5f5f5
Medium Gray: #e0e0e0
Dark Gray: #333333
Success Green: #28a745
Warning Yellow: #ffc107
Danger Red: #dc3545
```

## 📄 License

This project is created for educational purposes as a college project for KJSIT.

## 👥 Contributors

Created for K.J. Somaiya Institute of Technology

## 🙏 Acknowledgments

- KJSIT for project requirements and guidance
- All departments for inventory specifications

## 📞 Support

For questions or issues:
1. Check the troubleshooting section
2. Review `java-backend/README-JAVA.md` for backend help
3. Consult with your project guide

---

**Note**: This is a college project. Passwords are stored in plain text in the demo. For production use, implement proper password hashing (BCrypt, Argon2, etc.) and HTTPS.
