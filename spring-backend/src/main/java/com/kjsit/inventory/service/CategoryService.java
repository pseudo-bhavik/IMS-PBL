package com.kjsit.inventory.service;

import com.kjsit.inventory.entity.Category;
import com.kjsit.inventory.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> findAll() {
        return categoryRepository.findAll();
    }

    public Optional<Category> findById(Integer id) {
        return categoryRepository.findById(id);
    }

    public Optional<Category> findByName(String name) {
        return categoryRepository.findByName(name);
    }

    @Transactional
    public Category createCategory(Category category) {
        if (categoryRepository.findByName(category.getName()).isPresent()) {
            throw new RuntimeException("Category with name '" + category.getName() + "' already exists");
        }
        return categoryRepository.save(category);
    }

    @Transactional
    public Category updateCategory(Category category) {
        return categoryRepository.save(category);
    }

    @Transactional
    public void deleteCategory(Integer id) {
        categoryRepository.deleteById(id);
    }
}
