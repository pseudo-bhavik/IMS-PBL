package com.kjsit.inventory.controller;

import com.kjsit.inventory.dto.ApiResponse;
import com.kjsit.inventory.dto.LoginRequest;
import com.kjsit.inventory.entity.User;
import com.kjsit.inventory.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<Map<String, Object>>> login(
            @RequestBody LoginRequest loginRequest,
            HttpSession session) {

        System.out.println("===== LOGIN REQUEST =====");
        System.out.println("Username: " + loginRequest.getUsername());
        System.out.println("Session ID before login: " + session.getId());

        Optional<User> userOpt = userService.findByUsername(loginRequest.getUsername());

        if (userOpt.isEmpty()) {
            System.out.println("User not found: " + loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid username or password"));
        }

        User user = userOpt.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            System.out.println("Password mismatch for user: " + loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid username or password"));
        }

        if (!user.getIsActive()) {
            System.out.println("User account is inactive: " + loginRequest.getUsername());
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Account is inactive"));
        }

        session.setAttribute("userId", user.getId());
        session.setAttribute("username", user.getUsername());
        session.setAttribute("role", user.getRole().name());

        System.out.println("Login successful!");
        System.out.println("Session ID after login: " + session.getId());
        System.out.println("User ID set in session: " + user.getId());
        System.out.println("Role set in session: " + user.getRole().name());

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole().name());
        userData.put("departmentId", user.getDepartmentId());

        return ResponseEntity.ok(ApiResponse.success("Login successful", userData));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        Optional<User> userOpt = userService.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found"));
        }

        User user = userOpt.get();

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("username", user.getUsername());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole().name());
        userData.put("departmentId", user.getDepartmentId());

        return ResponseEntity.ok(ApiResponse.success(userData));
    }
}
