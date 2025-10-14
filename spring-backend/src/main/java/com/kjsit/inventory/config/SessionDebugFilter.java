package com.kjsit.inventory.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Enumeration;

@Component
public class SessionDebugFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        System.out.println("===== SESSION DEBUG =====");
        System.out.println("Request URI: " + httpRequest.getRequestURI());
        System.out.println("Request Method: " + httpRequest.getMethod());
        System.out.println("Origin: " + httpRequest.getHeader("Origin"));
        System.out.println("Cookie Header: " + httpRequest.getHeader("Cookie"));

        HttpSession session = httpRequest.getSession(false);
        if (session != null) {
            System.out.println("Session ID: " + session.getId());
            System.out.println("Session Attributes:");
            Enumeration<String> attributeNames = session.getAttributeNames();
            while (attributeNames.hasMoreElements()) {
                String attrName = attributeNames.nextElement();
                System.out.println("  " + attrName + " = " + session.getAttribute(attrName));
            }
        } else {
            System.out.println("No session found!");
        }
        System.out.println("========================");

        chain.doFilter(request, response);
    }
}
