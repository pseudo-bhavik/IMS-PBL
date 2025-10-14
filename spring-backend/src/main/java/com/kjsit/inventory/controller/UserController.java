package com.kjsit.inventory.controller;

import com.kjsit.inventory.dto.ApiResponse;
import com.kjsit.inventory.entity.User;
import com.kjsit.inventory.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getAllUsers(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        if (!"admin".equals(role) && !"staff".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only admins and staff can view users"));
        }

        List<User> users = userService.findAll();
        List<Map<String, Object>> userData = users.stream().map(user -> {
            Map<String, Object> data = new HashMap<>();
            data.put("id", user.getId());
            data.put("username", user.getUsername());
            data.put("name", user.getName());
            data.put("email", user.getEmail());
            data.put("role", user.getRole().name());
            data.put("departmentId", user.getDepartmentId());
            return data;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(ApiResponse.success(userData));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserById(
            @PathVariable Integer id,
            HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        User user = userService.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("User not found"));
        }

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
