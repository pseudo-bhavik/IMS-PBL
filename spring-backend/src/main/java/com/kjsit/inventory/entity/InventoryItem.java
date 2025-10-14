package com.kjsit.inventory.entity;

import com.fasterxml.jackson.annotation.JsonGetter;
import com.fasterxml.jackson.annotation.JsonSetter;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "inventory_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_id", nullable = false)
    private Integer categoryId;

    @Column(name = "department_id", nullable = false)
    private Integer departmentId;

    @Column(nullable = false)
    private Integer quantity = 0;

    @Column(name = "total_quantity", nullable = false)
    private Integer totalQuantity;

    @Column(length = 20)
    private String unit = "pcs";

    @Column(name = "is_borrowable")
    private Boolean isBorrowable = false;

    @Column(name = "is_issuable")
    private Boolean isIssuable = false;

    @Column(columnDefinition = "JSON")
    private String borrowableBy;

    @Column(columnDefinition = "JSON")
    private String issuableBy;

    @Transient
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @JsonGetter("borrowableBy")
    public List<String> getBorrowableByList() {
        return parseJsonToList(borrowableBy);
    }

    @JsonSetter("borrowableBy")
    public void setBorrowableByList(Object value) {
        if (value == null) {
            this.borrowableBy = "[]";
        } else if (value instanceof List) {
            try {
                this.borrowableBy = objectMapper.writeValueAsString(value);
            } catch (JsonProcessingException e) {
                this.borrowableBy = "[]";
            }
        } else if (value instanceof String) {
            this.borrowableBy = (String) value;
        } else {
            this.borrowableBy = "[]";
        }
    }

    @JsonGetter("issuableBy")
    public List<String> getIssuableByList() {
        return parseJsonToList(issuableBy);
    }

    @JsonSetter("issuableBy")
    public void setIssuableByList(Object value) {
        if (value == null) {
            this.issuableBy = "[]";
        } else if (value instanceof List) {
            try {
                this.issuableBy = objectMapper.writeValueAsString(value);
            } catch (JsonProcessingException e) {
                this.issuableBy = "[]";
            }
        } else if (value instanceof String) {
            this.issuableBy = (String) value;
        } else {
            this.issuableBy = "[]";
        }
    }

    private List<String> parseJsonToList(String json) {
        if (json == null || json.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (JsonProcessingException e) {
            return new ArrayList<>();
        }
    }

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ItemStatus status = ItemStatus.pending;

    @Column(name = "created_by")
    private Integer createdBy;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ItemStatus {
        pending, approved, rejected
    }

    @Transient
    public String getStockStatus() {
        if (quantity == 0) {
            return "out";
        } else if (quantity <= (totalQuantity * 0.2)) {
            return "low";
        } else {
            return "available";
        }
    }
}
