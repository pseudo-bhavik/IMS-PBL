package com.kjsit.inventory.controller;

import com.kjsit.inventory.dto.ApiResponse;
import com.kjsit.inventory.entity.Category;
import com.kjsit.inventory.service.CategoryService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getAllCategories() {
        List<Category> categories = categoryService.findAll();
        return ResponseEntity.ok(ApiResponse.success(categories));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> getCategoryById(@PathVariable Integer id) {
        Optional<Category> category = categoryService.findById(id);

        if (category.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Category not found"));
        }

        return ResponseEntity.ok(ApiResponse.success(category.get()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Category>> createCategory(
            @RequestBody Category category,
            HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        if (!"admin".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only admins can create categories"));
        }

        try {
            Category createdCategory = categoryService.createCategory(category);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Category created successfully", createdCategory));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(
            @PathVariable Integer id,
            @RequestBody Category category,
            HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        if (!"admin".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only admins can update categories"));
        }

        Optional<Category> existingCategory = categoryService.findById(id);
        if (existingCategory.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Category not found"));
        }

        category.setId(id);
        Category updatedCategory = categoryService.updateCategory(category);
        return ResponseEntity.ok(ApiResponse.success("Category updated successfully", updatedCategory));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
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
                    .body(ApiResponse.error("Only admins can delete categories"));
        }

        Optional<Category> category = categoryService.findById(id);
        if (category.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Category not found"));
        }

        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.ok(ApiResponse.success("Category deleted successfully", null));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error("Cannot delete category: " + e.getMessage()));
        }
    }
}
