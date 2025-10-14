package com.kjsit.inventory.service;

import com.kjsit.inventory.entity.Department;
import com.kjsit.inventory.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<Department> findAll() {
        return departmentRepository.findAll();
    }

    public Optional<Department> findById(Integer id) {
        return departmentRepository.findById(id);
    }

    public Optional<Department> findByName(String name) {
        return departmentRepository.findByName(name);
    }

    @Transactional
    public Department createDepartment(Department department) {
        if (departmentRepository.findByName(department.getName()).isPresent()) {
            throw new RuntimeException("Department with name '" + department.getName() + "' already exists");
        }
        return departmentRepository.save(department);
    }

    @Transactional
    public Department updateDepartment(Department department) {
        return departmentRepository.save(department);
    }

    @Transactional
    public void deleteDepartment(Integer id) {
        departmentRepository.deleteById(id);
    }
}
