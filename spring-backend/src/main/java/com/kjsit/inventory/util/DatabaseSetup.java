package com.kjsit.inventory.util;

import com.kjsit.inventory.entity.User;
import com.kjsit.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Database Setup Utility
 * This class runs on application startup and ensures users exist in the database
 * Comment out @Component annotation after first successful run
 */
@Component
@RequiredArgsConstructor
public class DatabaseSetup implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        System.out.println("==============================================");
        System.out.println("DATABASE SETUP - Checking Users");
        System.out.println("==============================================");

        // Check if users exist
        long userCount = userRepository.count();
        System.out.println("Current users in database: " + userCount);

        if (userCount == 0) {
            System.out.println("No users found. Creating default users...");
            createDefaultUsers();
        } else {
            System.out.println("Users already exist. Listing all users:");
            userRepository.findAll().forEach(user ->
                System.out.println("  - " + user.getUsername() + " (" + user.getRole() + ")")
            );
        }

        // Verify admin user exists
        userRepository.findByUsername("admin").ifPresentOrElse(
            user -> System.out.println("✓ Admin user found: " + user.getUsername()),
            () -> {
                System.out.println("✗ Admin user NOT found! Creating now...");
                createAdminUser();
            }
        );

        System.out.println("==============================================");
        System.out.println("Database setup complete!");
        System.out.println("Default password for all users: 'password'");
        System.out.println("==============================================");
    }

    private void createDefaultUsers() {
        String defaultPassword = passwordEncoder.encode("password");

        // Admin user
        User admin = new User();
        admin.setUsername("admin");
        admin.setPasswordHash(defaultPassword);
        admin.setName("Admin User");
        admin.setEmail("admin@kjsit.edu.in");
        admin.setRole(User.Role.admin);
        admin.setDepartmentId(6);
        admin.setIsActive(true);
        userRepository.save(admin);
        System.out.println("✓ Created user: admin");

        // Staff user 1
        User staff1 = new User();
        staff1.setUsername("staff1");
        staff1.setPasswordHash(defaultPassword);
        staff1.setName("Staff Member");
        staff1.setEmail("staff1@kjsit.edu.in");
        staff1.setRole(User.Role.staff);
        staff1.setDepartmentId(1);
        staff1.setIsActive(true);
        userRepository.save(staff1);
        System.out.println("✓ Created user: staff1");

        // Faculty user
        User faculty1 = new User();
        faculty1.setUsername("faculty1");
        faculty1.setPasswordHash(defaultPassword);
        faculty1.setName("Dr. Jane Smith");
        faculty1.setEmail("jane.smith@kjsit.edu.in");
        faculty1.setRole(User.Role.faculty);
        faculty1.setDepartmentId(1);
        faculty1.setIsActive(true);
        userRepository.save(faculty1);
        System.out.println("✓ Created user: faculty1");

        // Student user
        User student1 = new User();
        student1.setUsername("student1");
        student1.setPasswordHash(defaultPassword);
        student1.setName("John Doe");
        student1.setEmail("john.doe@somaiya.edu");
        student1.setRole(User.Role.student);
        student1.setDepartmentId(1);
        student1.setIsActive(true);
        userRepository.save(student1);
        System.out.println("✓ Created user: student1");
    }

    private void createAdminUser() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPasswordHash(passwordEncoder.encode("password"));
        admin.setName("Admin User");
        admin.setEmail("admin@kjsit.edu.in");
        admin.setRole(User.Role.admin);
        admin.setDepartmentId(6);
        admin.setIsActive(true);
        userRepository.save(admin);
        System.out.println("✓ Admin user created successfully");
    }
}
