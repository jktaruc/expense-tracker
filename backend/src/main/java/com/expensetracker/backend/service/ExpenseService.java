package com.expensetracker.backend.service;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    public ExpenseService(ExpenseRepository expenseRepository) { this.expenseRepository = expenseRepository; }

    public List<Expense> getExpensesByUser(String userId) { return expenseRepository.findByUserId(userId); }
    public Expense createExpense(Expense expense) { return expenseRepository.save(expense); }
}
