package com.kjsit.inventory.controller;

import com.kjsit.inventory.dto.ApiResponse;
import com.kjsit.inventory.entity.Transaction;
import com.kjsit.inventory.service.TransactionService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Transaction>>> getAllTransactions(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false) String status) {

        List<Transaction> transactions;

        if (userId != null) {
            transactions = transactionService.findByUserId(userId);
        } else if (status != null) {
            Transaction.TransactionStatus transactionStatus = Transaction.TransactionStatus.valueOf(status);
            transactions = transactionService.findByStatus(transactionStatus);
        } else {
            transactions = transactionService.findAll();
        }

        return ResponseEntity.ok(ApiResponse.success(transactions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Transaction>> getTransactionById(@PathVariable Integer id) {
        Optional<Transaction> transaction = transactionService.findById(id);

        if (transaction.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Transaction not found"));
        }

        return ResponseEntity.ok(ApiResponse.success(transaction.get()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Transaction>> createTransaction(
            @RequestBody Transaction transaction,
            HttpSession session) {

        System.out.println("===== CREATE TRANSACTION REQUEST =====");
        System.out.println("Session ID: " + (session != null ? session.getId() : "null"));

        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        System.out.println("User ID from session: " + userId);
        System.out.println("Role from session: " + role);
        System.out.println("Transaction type: " + transaction.getTransactionType());

        if (userId == null) {
            System.out.println("DENIED: User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        transaction.setUserId(userId);

        try {
            System.out.println("ALLOWED: Creating transaction for user: " + userId + " with role: " + role);
            Transaction createdTransaction = transactionService.createTransaction(transaction, role);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Transaction created successfully", createdTransaction));
        } catch (RuntimeException e) {
            System.out.println("ERROR: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse<Transaction>> approveTransaction(
            @PathVariable Integer id,
            HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        if (!"admin".equals(role) && !"staff".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Only admins and staff can approve transactions"));
        }

        try {
            Transaction approvedTransaction = transactionService.approveTransaction(id, userId);
            return ResponseEntity.ok(
                    ApiResponse.success("Transaction approved successfully", approvedTransaction));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<ApiResponse<Transaction>> returnItem(
            @PathVariable Integer id,
            HttpSession session) {

        Integer userId = (Integer) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        try {
            Transaction returnedTransaction = transactionService.returnItem(id);
            return ResponseEntity.ok(
                    ApiResponse.success("Item returned successfully", returnedTransaction));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteTransaction(
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
                    .body(ApiResponse.error("Only admins can delete transactions"));
        }

        Optional<Transaction> transaction = transactionService.findById(id);
        if (transaction.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(ApiResponse.error("Transaction not found"));
        }

        transactionService.deleteTransaction(id);
        return ResponseEntity.ok(ApiResponse.success("Transaction deleted successfully", null));
    }
}
