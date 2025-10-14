package com.kjsit.inventory.repository;

import com.kjsit.inventory.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    List<Transaction> findByUserId(Integer userId);
    List<Transaction> findByItemId(Integer itemId);
    List<Transaction> findByStatus(Transaction.TransactionStatus status);
    List<Transaction> findByTransactionType(Transaction.TransactionType transactionType);
}
