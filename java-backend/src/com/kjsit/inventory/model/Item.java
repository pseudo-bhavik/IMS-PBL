package com.kjsit.inventory.model;

import java.sql.Timestamp;

/**
 * Item Model Class
 * Represents an inventory item
 */
public class Item {

    private int itemId;
    private String itemName;
    private String description;
    private int categoryId;
    private String categoryName;
    private int departmentId;
    private String departmentName;
    private int quantity;
    private int totalQuantity;
    private String unit;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private int createdBy;

    // Constructors
    public Item() {
    }

    public Item(String itemName, String description, int categoryId, int departmentId,
                int quantity, int totalQuantity, String unit) {
        this.itemName = itemName;
        this.description = description;
        this.categoryId = categoryId;
        this.departmentId = departmentId;
        this.quantity = quantity;
        this.totalQuantity = totalQuantity;
        this.unit = unit;
    }

    // Getters and Setters
    public int getItemId() {
        return itemId;
    }

    public void setItemId(int itemId) {
        this.itemId = itemId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(int categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public int getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(int departmentId) {
        this.departmentId = departmentId;
    }

    public String getDepartmentName() {
        return departmentName;
    }

    public void setDepartmentName(String departmentName) {
        this.departmentName = departmentName;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public int getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(int totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(int createdBy) {
        this.createdBy = createdBy;
    }

    /**
     * Get item status based on quantity
     */
    public String getStatus() {
        if (quantity == 0) {
            return "out";
        } else if (quantity <= (totalQuantity * 0.2)) {
            return "low";
        } else {
            return "available";
        }
    }

    @Override
    public String toString() {
        return "Item{" +
                "itemId=" + itemId +
                ", itemName='" + itemName + '\'' +
                ", quantity=" + quantity +
                ", totalQuantity=" + totalQuantity +
                ", status='" + getStatus() + '\'' +
                '}';
    }
}
