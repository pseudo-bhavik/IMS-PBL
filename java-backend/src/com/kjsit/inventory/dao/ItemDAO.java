package com.kjsit.inventory.dao;

import com.kjsit.inventory.model.Item;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Item Data Access Object
 * Handles all database operations related to inventory items
 */
public class ItemDAO {

    /**
     * Get all inventory items with category and department names
     * @return List of all items
     */
    public List<Item> getAllItems() {
        List<Item> items = new ArrayList<>();
        String query = "SELECT i.*, c.category_name, d.department_name " +
                      "FROM inventory_items i " +
                      "JOIN categories c ON i.category_id = c.category_id " +
                      "JOIN departments d ON i.department_id = d.department_id " +
                      "ORDER BY i.item_id";

        try (Connection conn = DatabaseConnection.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                Item item = extractItemFromResultSet(rs);
                items.add(item);
            }

        } catch (SQLException e) {
            System.err.println("Error getting all items: " + e.getMessage());
            e.printStackTrace();
        }

        return items;
    }

    /**
     * Get item by ID
     * @param itemId Item ID
     * @return Item object or null
     */
    public Item getItemById(int itemId) {
        String query = "SELECT i.*, c.category_name, d.department_name " +
                      "FROM inventory_items i " +
                      "JOIN categories c ON i.category_id = c.category_id " +
                      "JOIN departments d ON i.department_id = d.department_id " +
                      "WHERE i.item_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, itemId);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                return extractItemFromResultSet(rs);
            }

        } catch (SQLException e) {
            System.err.println("Error getting item: " + e.getMessage());
            e.printStackTrace();
        }

        return null;
    }

    /**
     * Create new inventory item
     * @param item Item object
     * @param userId User creating the item
     * @return true if successful
     */
    public boolean createItem(Item item, int userId) {
        String query = "INSERT INTO inventory_items (item_name, description, category_id, " +
                      "department_id, quantity, total_quantity, unit, created_by) " +
                      "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, item.getItemName());
            stmt.setString(2, item.getDescription());
            stmt.setInt(3, item.getCategoryId());
            stmt.setInt(4, item.getDepartmentId());
            stmt.setInt(5, item.getQuantity());
            stmt.setInt(6, item.getTotalQuantity());
            stmt.setString(7, item.getUnit());
            stmt.setInt(8, userId);

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            System.err.println("Error creating item: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Update inventory item
     * @param item Item object with updated values
     * @return true if successful
     */
    public boolean updateItem(Item item) {
        String query = "UPDATE inventory_items SET item_name = ?, description = ?, " +
                      "category_id = ?, department_id = ?, quantity = ?, total_quantity = ?, " +
                      "unit = ? WHERE item_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setString(1, item.getItemName());
            stmt.setString(2, item.getDescription());
            stmt.setInt(3, item.getCategoryId());
            stmt.setInt(4, item.getDepartmentId());
            stmt.setInt(5, item.getQuantity());
            stmt.setInt(6, item.getTotalQuantity());
            stmt.setString(7, item.getUnit());
            stmt.setInt(8, item.getItemId());

            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            System.err.println("Error updating item: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Delete inventory item
     * @param itemId Item ID
     * @return true if successful
     */
    public boolean deleteItem(int itemId) {
        String query = "DELETE FROM inventory_items WHERE item_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, itemId);
            int rowsAffected = stmt.executeUpdate();
            return rowsAffected > 0;

        } catch (SQLException e) {
            System.err.println("Error deleting item: " + e.getMessage());
            e.printStackTrace();
            return false;
        }
    }

    /**
     * Get items by category
     * @param categoryId Category ID
     * @return List of items
     */
    public List<Item> getItemsByCategory(int categoryId) {
        List<Item> items = new ArrayList<>();
        String query = "SELECT i.*, c.category_name, d.department_name " +
                      "FROM inventory_items i " +
                      "JOIN categories c ON i.category_id = c.category_id " +
                      "JOIN departments d ON i.department_id = d.department_id " +
                      "WHERE i.category_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, categoryId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                items.add(extractItemFromResultSet(rs));
            }

        } catch (SQLException e) {
            System.err.println("Error getting items by category: " + e.getMessage());
            e.printStackTrace();
        }

        return items;
    }

    /**
     * Get items by department
     * @param departmentId Department ID
     * @return List of items
     */
    public List<Item> getItemsByDepartment(int departmentId) {
        List<Item> items = new ArrayList<>();
        String query = "SELECT i.*, c.category_name, d.department_name " +
                      "FROM inventory_items i " +
                      "JOIN categories c ON i.category_id = c.category_id " +
                      "JOIN departments d ON i.department_id = d.department_id " +
                      "WHERE i.department_id = ?";

        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement stmt = conn.prepareStatement(query)) {

            stmt.setInt(1, departmentId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) {
                items.add(extractItemFromResultSet(rs));
            }

        } catch (SQLException e) {
            System.err.println("Error getting items by department: " + e.getMessage());
            e.printStackTrace();
        }

        return items;
    }

    /**
     * Extract Item object from ResultSet
     * @param rs ResultSet
     * @return Item object
     */
    private Item extractItemFromResultSet(ResultSet rs) throws SQLException {
        Item item = new Item();
        item.setItemId(rs.getInt("item_id"));
        item.setItemName(rs.getString("item_name"));
        item.setDescription(rs.getString("description"));
        item.setCategoryId(rs.getInt("category_id"));
        item.setCategoryName(rs.getString("category_name"));
        item.setDepartmentId(rs.getInt("department_id"));
        item.setDepartmentName(rs.getString("department_name"));
        item.setQuantity(rs.getInt("quantity"));
        item.setTotalQuantity(rs.getInt("total_quantity"));
        item.setUnit(rs.getString("unit"));
        item.setCreatedAt(rs.getTimestamp("created_at"));
        item.setUpdatedAt(rs.getTimestamp("updated_at"));
        return item;
    }
}
