package com.kjsit.inventory.repository;

import com.kjsit.inventory.entity.InventoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryItemRepository extends JpaRepository<InventoryItem, Integer> {
    List<InventoryItem> findByCategoryId(Integer categoryId);
    List<InventoryItem> findByDepartmentId(Integer departmentId);
    List<InventoryItem> findByStatus(InventoryItem.ItemStatus status);

    @Query("SELECT i FROM InventoryItem i WHERE i.status = 'approved' AND i.quantity <= (i.totalQuantity * 0.2)")
    List<InventoryItem> findLowStockItems();
}
