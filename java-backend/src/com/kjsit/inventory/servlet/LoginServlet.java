package com.kjsit.inventory.servlet;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.kjsit.inventory.dao.UserDAO;
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

/**
 * Login Servlet
 * Handles user authentication
 */
@WebServlet("/api/login")
public class LoginServlet extends HttpServlet {

    private UserDAO userDAO;
    private Gson gson;

    @Override
    public void init() throws ServletException {
        userDAO = new UserDAO();
        gson = new Gson();
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {

        // Set CORS headers
        setCorsHeaders(response);

        // Set response type
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        PrintWriter out = response.getWriter();

        try {
            // Read request body
            BufferedReader reader = request.getReader();
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }

            // Parse JSON
            JsonObject jsonRequest = gson.fromJson(sb.toString(), JsonObject.class);
            String username = jsonRequest.get("username").getAsString();
            String password = jsonRequest.get("password").getAsString();
            String role = jsonRequest.get("role").getAsString();

            // Authenticate user
            User user = userDAO.authenticateUser(username, password, role);

            JsonObject jsonResponse = new JsonObject();

            if (user != null) {
                // Create session
                HttpSession session = request.getSession(true);
                session.setAttribute("user", user);
                session.setAttribute("userId", user.getUserId());
                session.setAttribute("role", user.getRole());
                session.setMaxInactiveInterval(3600); // 1 hour

                // Prepare response (don't send password)
                user.setPassword(null);

                jsonResponse.addProperty("success", true);
                jsonResponse.addProperty("message", "Login successful");
                jsonResponse.add("user", gson.toJsonTree(user));

                System.out.println("User logged in: " + user.getUsername());
            } else {
                jsonResponse.addProperty("success", false);
                jsonResponse.addProperty("message", "Invalid credentials");
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            }

            out.print(gson.toJson(jsonResponse));

        } catch (Exception e) {
            System.err.println("Error in login: " + e.getMessage());
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

    /**
     * Set CORS headers for cross-origin requests
     */
    private void setCorsHeaders(HttpServletResponse response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
        response.setHeader("Access-Control-Max-Age", "3600");
    }
}
