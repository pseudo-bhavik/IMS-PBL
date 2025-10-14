package com.kjsit.inventory.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "item_id", nullable = false)
    private Integer itemId;

    @Column(name = "user_id", nullable = false)
    private Integer userId;

    @Column(nullable = false)
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status = TransactionStatus.pending;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @CreationTimestamp
    @Column(name = "request_date", updatable = false)
    private LocalDateTime requestDate;

    @Column(name = "approved_date")
    private LocalDateTime approvedDate;

    @Column(name = "return_date")
    private LocalDateTime returnDate;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    public enum TransactionStatus {
        pending, approved, rejected, returned, issued
    }

    public enum TransactionType {
        borrow, issue
    }
}
