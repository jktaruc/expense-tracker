package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
public class ExpenseController {

    private final ExpenseRepository repo;

    public ExpenseController(ExpenseRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return repo.findAll();
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return repo.save(expense);
    }

    // ✅ DELETE by id
    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable String id) {
        repo.deleteById(id);
    }

    @PostMapping("/expenses")
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Expense savedExpense = repo.save(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
    }

}
