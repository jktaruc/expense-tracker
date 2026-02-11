package com.expensetracker.backend.controller;

import com.expensetracker.backend.dto.ExpenseSummaryDTO;
import com.expensetracker.backend.dto.FinancialSummaryDTO;
import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.service.ExpenseSummaryService;
import com.expensetracker.backend.service.FinancialSummaryService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    private final ExpenseRepository repo;
    private final ExpenseSummaryService summaryService;
    private final FinancialSummaryService financialSummaryService;

    public ExpenseController(ExpenseRepository repo,
                             ExpenseSummaryService summaryService,
                             FinancialSummaryService financialSummaryService) {
        this.repo = repo;
        this.summaryService = summaryService;
        this.financialSummaryService = financialSummaryService;
    }

    @GetMapping
    public List<Expense> getAllExpenses() {
        return repo.findAll();
    }

    @PostMapping
    public Expense addExpense(@RequestBody Expense expense) {
        return repo.save(expense);
    }

    // ✅ NEW: Update expense
    @PutMapping("/{id}")
    public ResponseEntity<Expense> updateExpense(@PathVariable String id, @RequestBody Expense expense) {
        return repo.findById(id)
                .map(existingExpense -> {
                    existingExpense.setTitle(expense.getTitle());
                    existingExpense.setCategory(expense.getCategory());
                    existingExpense.setAmount(expense.getAmount());
                    existingExpense.setDate(expense.getDate());
                    Expense updated = repo.save(existingExpense);
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public void deleteExpense(@PathVariable String id) {
        repo.deleteById(id);
    }

    @PostMapping("/expenses")
    public ResponseEntity<Expense> createExpense(@RequestBody Expense expense) {
        Expense savedExpense = repo.save(expense);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedExpense);
    }

    @GetMapping("/summary")
    public ResponseEntity<ExpenseSummaryDTO> getSummary(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(6);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        ExpenseSummaryDTO summary = summaryService.getSummary(startDate, endDate);
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/financial-summary")
    public ResponseEntity<FinancialSummaryDTO> getFinancialSummary(
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        if (startDate == null) {
            startDate = LocalDate.now().minusMonths(6);
        }
        if (endDate == null) {
            endDate = LocalDate.now();
        }

        FinancialSummaryDTO summary = financialSummaryService.getFinancialSummary(startDate, endDate);
        return ResponseEntity.ok(summary);
    }
}
