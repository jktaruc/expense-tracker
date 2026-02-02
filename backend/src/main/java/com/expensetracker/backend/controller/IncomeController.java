package com.expensetracker.backend.controller;

import com.expensetracker.backend.entity.Income;
import com.expensetracker.backend.repository.IncomeRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incomes")
@CrossOrigin(origins = "http://localhost:5173")
public class IncomeController {

    private final IncomeRepository repo;

    public IncomeController(IncomeRepository repo) {
        this.repo = repo;
    }

    @GetMapping
    public List<Income> getAllIncomes() {
        return repo.findAll();
    }

    @PostMapping
    public Income addIncome(@RequestBody Income income) {
        return repo.save(income);
    }

    @DeleteMapping("/{id}")
    public void deleteIncome(@PathVariable String id) {
        repo.deleteById(id);
    }

    @PostMapping("/incomes")
    public ResponseEntity<Income> createIncome(@RequestBody Income income) {
        Income savedIncome = repo.save(income);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedIncome);
    }
}
