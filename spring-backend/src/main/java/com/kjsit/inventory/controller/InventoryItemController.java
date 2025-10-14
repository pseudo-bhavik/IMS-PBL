package com.kjsit.inventory.controller;

import com.kjsit.inventory.dto.ApiResponse;
import com.kjsit.inventory.entity.InventoryItem;
import com.kjsit.inventory.service.InventoryItemService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/items")
@RequiredArgsConstructor
public class InventoryItemController {

    private final InventoryItemService inventoryItemService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<InventoryItem>>> getAllItems(
            @RequestParam(required = false) Integer categoryId,
            @RequestParam(required = false) Integer departmentId) {

        List<InventoryItem> items;

        if (categoryId != null) {
            items = inventoryItemService.findByCategoryId(categoryId);
        } else if (departmentId != null) {
            items = inventoryItemService.findByDepartmentId(departmentId);
        } else {
            items = inventoryItemService.findAll();
        }

        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryItem>> getItemById(@PathVariable Integer id) {
        Optional<InventoryItem> item = inventoryItemService.findById(id);

        if (item.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Item not found"));
        }

        return ResponseEntity.ok(ApiResponse.success(item.get()));
    }

    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse<List<InventoryItem>>> getLowStockItems() {
        List<InventoryItem> items = inventoryItemService.findLowStockItems();
        return ResponseEntity.ok(ApiResponse.success(items));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<InventoryItem>> createItem(
            @RequestBody InventoryItem item,
            HttpSession session) {

        System.out.println("===== CREATE ITEM REQUEST =====");
        System.out.println("Session ID: " + (session != null ? session.getId() : "null"));

        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        System.out.println("User ID from session: " + userId);
        System.out.println("Role from session: " + role);

        if (userId == null) {
            System.out.println("DENIED: User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        if (!"admin".equals(role) && !"staff".equals(role)) {
            System.out.println("DENIED: Insufficient permissions. Role: " + role);
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Insufficient permissions"));
        }

        System.out.println("ALLOWED: Creating item with role: " + role);
        InventoryItem createdItem = inventoryItemService.createItem(item, userId, role);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Item created successfully", createdItem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<InventoryItem>> updateItem(
            @PathVariable Integer id,
            @RequestBody InventoryItem item,
            HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        if (!"admin".equals(role) && !"staff".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Insufficient permissions"));
        }

        Optional<InventoryItem> existingItem = inventoryItemService.findById(id);
        if (existingItem.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Item not found"));
        }

        item.setId(id);
        InventoryItem updatedItem = inventoryItemService.updateItem(item);
        return ResponseEntity.ok(ApiResponse.success("Item updated successfully", updatedItem));
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<InventoryItem>> approveItem(
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
                    .body(ApiResponse.error("Only admins can approve items"));
        }

        try {
            InventoryItem approvedItem = inventoryItemService.approveItem(id, userId);
            return ResponseEntity.ok(ApiResponse.success("Item approved successfully", approvedItem));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteItem(
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
                    .body(ApiResponse.error("Only admins can delete items"));
        }

        Optional<InventoryItem> item = inventoryItemService.findById(id);
        if (item.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Item not found"));
        }

        inventoryItemService.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.success("Item deleted successfully", null));
    }
}
