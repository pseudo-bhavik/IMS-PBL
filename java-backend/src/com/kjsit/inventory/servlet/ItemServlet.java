package com.kjsit.inventory.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.kjsit.inventory.dao.ItemDAO;
import com.kjsit.inventory.model.Item;
import com.kjsit.inventory.model.User;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/**
 * Item Servlet
 * Handles CRUD operations for inventory items
 */
@WebServlet("/api/items")
public class ItemServlet extends HttpServlet {

    private ItemDAO itemDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        itemDAO = new ItemDAO();
        gson = new Gson();
    }

    /**
     * GET - Retrieve items
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {
            String itemIdParam = request.getParameter("id");
            String categoryIdParam = request.getParameter("categoryId");
            String departmentIdParam = request.getParameter("departmentId");

            JsonObject jsonResponse = new JsonObject();

            if (itemIdParam != null) {
                // Get single item
                int itemId = Integer.parseInt(itemIdParam);
                Item item = itemDAO.getItemById(itemId);

                if (item != null) {
                    jsonResponse.addProperty("success", true);
                    jsonResponse.add("item", gson.toJsonTree(item));
                } else {
                    jsonResponse.addProperty("success", false);
                    jsonResponse.addProperty("message", "Item not found");
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                }
            } else if (categoryIdParam != null) {
                // Get items by category
                int categoryId = Integer.parseInt(categoryIdParam);
                List<Item> items = itemDAO.getItemsByCategory(categoryId);
                jsonResponse.addProperty("success", true);
                jsonResponse.add("items", gson.toJsonTree(items));
            } else if (departmentIdParam != null) {
                // Get items by department
                int departmentId = Integer.parseInt(departmentIdParam);
                List<Item> items = itemDAO.getItemsByDepartment(departmentId);
                jsonResponse.addProperty("success", true);
                jsonResponse.add("items", gson.toJsonTree(items));
            } else {
                // Get all items
                List<Item> items = itemDAO.getAllItems();
                jsonResponse.addProperty("success", true);
                jsonResponse.add("items", gson.toJsonTree(items));
            }

            out.print(gson.toJson(jsonResponse));

        } catch (Exception e) {
            System.err.println("Error in GET items: " + e.getMessage());
            e.printStackTrace();

            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("success", false);
            errorResponse.addProperty("message", "Server error: " + e.getMessage());

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(errorResponse));
        } finally {
            out.flush();
        }
    }

    /**
     * POST - Create new item (Admin/Staff only)
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {
            // Check authentication
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("user") == null) {
                sendUnauthorizedResponse(response, out);
                return;
            }

            User user = (User) session.getAttribute("user");
            if (!user.getRole().equals("admin") && !user.getRole().equals("staff")) {
                sendForbiddenResponse(response, out);
                return;
            }

            // Read request body
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            // Parse JSON
            Item item = gson.fromJson(sb.toString(), Item.class);

            // Create item
            boolean success = itemDAO.createItem(item, user.getUserId());

            JsonObject jsonResponse = new JsonObject();
            if (success) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Item created successfully");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Failed to create item");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

            out.print(gson.toJson(jsonResponse));

        } catch (Exception e) {
            System.err.println("Error in POST item: " + e.getMessage());
            e.printStackTrace();

            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("success", false);
            errorResponse.addProperty("message", "Server error: " + e.getMessage());

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(errorResponse));
        } finally {
            out.flush();
        }
    }

    /**
     * PUT - Update item (Admin/Staff only)
     */
    @Override
    protected void doPut(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {
            // Check authentication
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("user") == null) {
                sendUnauthorizedResponse(response, out);
                return;
            }

            User user = (User) session.getAttribute("user");
            if (!user.getRole().equals("admin") && !user.getRole().equals("staff")) {
                sendForbiddenResponse(response, out);
                return;
            }

            // Read request body
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            // Parse JSON
            Item item = gson.fromJson(sb.toString(), Item.class);

            // Update item
            boolean success = itemDAO.updateItem(item);

            JsonObject jsonResponse = new JsonObject();
            if (success) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Item updated successfully");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Failed to update item");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

            out.print(gson.toJson(jsonResponse));

        } catch (Exception e) {
            System.err.println("Error in PUT item: " + e.getMessage());
            e.printStackTrace();

            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("success", false);
            errorResponse.addProperty("message", "Server error: " + e.getMessage());

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(errorResponse));
        } finally {
            out.flush();
        }
    }

    /**
     * DELETE - Delete item (Admin only)
     */
    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {
            // Check authentication
            HttpSession session = request.getSession(false);
            if (session == null || session.getAttribute("user") == null) {
                sendUnauthorizedResponse(response, out);
                return;
            }

            User user = (User) session.getAttribute("user");
            if (!user.getRole().equals("admin")) {
                sendForbiddenResponse(response, out);
                return;
            }

            String itemIdParam = request.getParameter("id");
            if (itemIdParam == null) {
                JsonObject errorResponse = new JsonObject();
                errorResponse.addProperty("success", false);
                errorResponse.addProperty("message", "Item ID is required");
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                out.print(gson.toJson(errorResponse));
                return;
            }

            int itemId = Integer.parseInt(itemIdParam);
            boolean success = itemDAO.deleteItem(itemId);

            JsonObject jsonResponse = new JsonObject();
            if (success) {
                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Item deleted successfully");
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Failed to delete item");
                response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }

            out.print(gson.toJson(jsonResponse));

        } catch (Exception e) {
            System.err.println("Error in DELETE item: " + e.getMessage());
            e.printStackTrace();

            JsonObject errorResponse = new JsonObject();
            errorResponse.addProperty("success", false);
            errorResponse.addProperty("message", "Server error: " + e.getMessage());

            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print(gson.toJson(errorResponse));
        } finally {
            out.flush();
        }
    }

    @Override
    protected void doOptions(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        setCorsHeaders(response);
        response.setStatus(HttpServletResponse.SC_OK);
    }

    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Max-Age", "3600");
    }

    private void sendUnauthorizedResponse(HttpServletResponse response, PrintWriter out) {
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("success", false);
        jsonResponse.addProperty("message", "Unauthorized - Please login");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        out.print(gson.toJson(jsonResponse));
    }

    private void sendForbiddenResponse(HttpServletResponse response, PrintWriter out) {
        JsonObject jsonResponse = new JsonObject();
        jsonResponse.addProperty("success", false);
        jsonResponse.addProperty("message", "Forbidden - Insufficient permissions");
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        out.print(gson.toJson(jsonResponse));
    }
}
