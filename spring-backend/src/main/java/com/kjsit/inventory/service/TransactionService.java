package com.kjsit.inventory.service;

import com.kjsit.inventory.entity.InventoryItem;
import com.kjsit.inventory.entity.Transaction;
import com.kjsit.inventory.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final InventoryItemService inventoryItemService;

    public List<Transaction> findAll() {
        return transactionRepository.findAll();
    }

    public Optional<Transaction> findById(Integer id) {
        return transactionRepository.findById(id);
    }

    public List<Transaction> findByUserId(Integer userId) {
        return transactionRepository.findByUserId(userId);
    }

    public List<Transaction> findByStatus(Transaction.TransactionStatus status) {
        return transactionRepository.findByStatus(status);
    }

    @Transactional
    public Transaction createTransaction(Transaction transaction, String userRole) {
        InventoryItem item = inventoryItemService.findById(transaction.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (item.getStatus() != InventoryItem.ItemStatus.approved) {
            throw new RuntimeException("Item is not approved for transactions");
        }

        if (transaction.getTransactionType() == Transaction.TransactionType.borrow) {
            if (!item.getIsBorrowable()) {
                throw new RuntimeException("Item is not borrowable");
            }
            if (!isUserAllowedToBorrow(item, userRole)) {
                throw new RuntimeException("You are not authorized to borrow this item");
            }
        } else if (transaction.getTransactionType() == Transaction.TransactionType.issue) {
            if (!item.getIsIssuable()) {
                throw new RuntimeException("Item is not issuable");
            }
            if (!isUserAllowedToIssue(item, userRole)) {
                throw new RuntimeException("You are not authorized to request issue for this item");
            }
        }

        transaction.setStatus(Transaction.TransactionStatus.pending);
        return transactionRepository.save(transaction);
    }

    private boolean isUserAllowedToBorrow(InventoryItem item, String userRole) {
        if (item.getBorrowableBy() == null || item.getBorrowableBy().isEmpty()) {
            return false;
        }
        try {
            String borrowableBy = item.getBorrowableBy();
            return borrowableBy.contains("\"" + userRole + "\"");
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isUserAllowedToIssue(InventoryItem item, String userRole) {
        if (item.getIssuableBy() == null || item.getIssuableBy().isEmpty()) {
            return false;
        }
        try {
            String issuableBy = item.getIssuableBy();
            return issuableBy.contains("\"" + userRole + "\"");
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public Transaction approveTransaction(Integer transactionId, Integer adminId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        InventoryItem item = inventoryItemService.findById(transaction.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (item.getQuantity() < transaction.getQuantity()) {
            throw new RuntimeException("Insufficient quantity available");
        }

        inventoryItemService.updateQuantity(item.getId(), -transaction.getQuantity());

        if (transaction.getTransactionType() == Transaction.TransactionType.borrow) {
            transaction.setStatus(Transaction.TransactionStatus.approved);
        } else {
            transaction.setStatus(Transaction.TransactionStatus.issued);
        }

        transaction.setApprovedBy(adminId);
        transaction.setApprovedDate(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    @Transactional
    public Transaction returnItem(Integer transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new RuntimeException("Transaction not found"));

        if (transaction.getTransactionType() != Transaction.TransactionType.borrow) {
            throw new RuntimeException("Only borrowed items can be returned");
        }

        if (transaction.getStatus() != Transaction.TransactionStatus.approved) {
            throw new RuntimeException("Transaction is not approved");
        }

        inventoryItemService.updateQuantity(transaction.getItemId(), transaction.getQuantity());

        transaction.setStatus(Transaction.TransactionStatus.returned);
        transaction.setReturnDate(LocalDateTime.now());

        return transactionRepository.save(transaction);
    }

    @Transactional
    public void deleteTransaction(Integer id) {
        transactionRepository.deleteById(id);
    }
}
