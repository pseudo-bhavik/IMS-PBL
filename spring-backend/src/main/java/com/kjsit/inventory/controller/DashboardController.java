package com.kjsit.inventory.controller;

import com.kjsit.inventory.dto.ApiResponse;
import com.kjsit.inventory.entity.InventoryItem;
import com.kjsit.inventory.entity.Transaction;
import com.kjsit.inventory.service.InventoryItemService;
import com.kjsit.inventory.service.TransactionService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final InventoryItemService inventoryItemService;
    private final TransactionService transactionService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboardStats(HttpSession session) {
        Integer userId = (Integer) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        List<InventoryItem> allItems = inventoryItemService.findAll();
        List<InventoryItem> approvedItems = inventoryItemService.findByStatus(
                InventoryItem.ItemStatus.approved);
        List<InventoryItem> lowStockItems = inventoryItemService.findLowStockItems();
        List<Transaction> pendingTransactions = transactionService.findByStatus(
                Transaction.TransactionStatus.pending);

        long totalQuantity = approvedItems.stream()
                .mapToLong(InventoryItem::getTotalQuantity)
                .sum();
        long availableQuantity = approvedItems.stream()
                .mapToLong(InventoryItem::getQuantity)
                .sum();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalItems", allItems.size());
        stats.put("approvedItems", approvedItems.size());
        stats.put("lowStockItems", lowStockItems.size());
        stats.put("pendingTransactions", pendingTransactions.size());
        stats.put("totalQuantity", totalQuantity);
        stats.put("availableQuantity", availableQuantity);
        stats.put("borrowedQuantity", totalQuantity - availableQuantity);

        return ResponseEntity.ok(ApiResponse.success(stats));
    }
}
