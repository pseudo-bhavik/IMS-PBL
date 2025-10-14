package com.kjsit.inventory.service;

import com.kjsit.inventory.entity.InventoryItem;
import com.kjsit.inventory.repository.InventoryItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class InventoryItemService {

    private final InventoryItemRepository inventoryItemRepository;

    public List<InventoryItem> findAll() {
        return inventoryItemRepository.findAll();
    }

    public Optional<InventoryItem> findById(Integer id) {
        return inventoryItemRepository.findById(id);
    }

    public List<InventoryItem> findByCategoryId(Integer categoryId) {
        return inventoryItemRepository.findByCategoryId(categoryId);
    }

    public List<InventoryItem> findByDepartmentId(Integer departmentId) {
        return inventoryItemRepository.findByDepartmentId(departmentId);
    }

    public List<InventoryItem> findByStatus(InventoryItem.ItemStatus status) {
        return inventoryItemRepository.findByStatus(status);
    }

    public List<InventoryItem> findLowStockItems() {
        return inventoryItemRepository.findLowStockItems();
    }

    @Transactional
    public InventoryItem createItem(InventoryItem item, Integer createdBy, String userRole) {
        item.setCreatedBy(createdBy);
        if ("admin".equals(userRole)) {
            item.setStatus(InventoryItem.ItemStatus.approved);
            item.setApprovedBy(createdBy);
            item.setApprovedAt(LocalDateTime.now());
        } else {
            item.setStatus(InventoryItem.ItemStatus.pending);
        }
        return inventoryItemRepository.save(item);
    }

    @Transactional
    public InventoryItem updateItem(InventoryItem item) {
        return inventoryItemRepository.save(item);
    }

    @Transactional
    public InventoryItem approveItem(Integer itemId, Integer adminId) {
        InventoryItem item = inventoryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setStatus(InventoryItem.ItemStatus.approved);
        item.setApprovedBy(adminId);
        item.setApprovedAt(LocalDateTime.now());

        return inventoryItemRepository.save(item);
    }

    @Transactional
    public void deleteItem(Integer id) {
        inventoryItemRepository.deleteById(id);
    }

    @Transactional
    public void updateQuantity(Integer itemId, Integer quantityChange) {
        InventoryItem item = inventoryItemRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        item.setQuantity(item.getQuantity() + quantityChange);
        inventoryItemRepository.save(item);
    }
}
