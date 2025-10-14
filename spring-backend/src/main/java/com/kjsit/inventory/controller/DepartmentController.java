package com.kjsit.inventory.controller;

import com.kjsit.inventory.dto.ApiResponse;
import com.kjsit.inventory.entity.Department;
import com.kjsit.inventory.service.DepartmentService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
public class DepartmentController {

    private final DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Department>>> getAllDepartments() {
        List<Department> departments = departmentService.findAll();
        return ResponseEntity.ok(ApiResponse.success(departments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Department>> getDepartmentById(@PathVariable Integer id) {
        Optional<Department> department = departmentService.findById(id);

        if (department.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Department not found"));
        }

        return ResponseEntity.ok(ApiResponse.success(department.get()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Department>> createDepartment(
            @RequestBody Department department,
            HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        if (!"admin".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only admins can create departments"));
        }

        try {
            Department createdDepartment = departmentService.createDepartment(department);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Department created successfully", createdDepartment));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Department>> updateDepartment(
            @PathVariable Integer id,
            @RequestBody Department department,
            HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        if (!"admin".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only admins can update departments"));
        }

        Optional<Department> existingDepartment = departmentService.findById(id);
        if (existingDepartment.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Department not found"));
        }

        department.setId(id);
        Department updatedDepartment = departmentService.updateDepartment(department);
        return ResponseEntity.ok(ApiResponse.success("Department updated successfully", updatedDepartment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(
            @PathVariable Integer id,
            HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        if (!"admin".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only admins can delete departments"));
        }

        Optional<Department> department = departmentService.findById(id);
        if (department.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Department not found"));
        }

        try {
            departmentService.deleteDepartment(id);
            return ResponseEntity.ok(ApiResponse.success("Department deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Cannot delete department: " + e.getMessage()));
        }
    }
}
