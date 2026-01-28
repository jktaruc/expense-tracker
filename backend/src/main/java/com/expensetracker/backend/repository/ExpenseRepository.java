package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, String> {
    List<Expense> findByUserId(String userId);

    // Add these new methods:
    List<Expense> findByDateBetween(LocalDate startDate, LocalDate endDate);

}
