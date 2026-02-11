package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.ExpenseSummaryDTO;
import com.expensetracker.backend.dto.MonthlyExpenseDTO;
import com.expensetracker.backend.dto.ExpenseItemDTO;
import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseSummaryService {

    private final ExpenseRepository expenseRepository;

    public ExpenseSummaryDTO getSummary(LocalDate startDate, LocalDate endDate) {
        // Get all expenses in date range
        List<Expense> expenses = expenseRepository.findByDateBetween(startDate, endDate);

        ExpenseSummaryDTO summary = new ExpenseSummaryDTO();

        if (expenses.isEmpty()) {
            // Return empty summary if no expenses
            summary.setTotalExpenses(0.0);
            summary.setMonthlyAverage(0.0);
            summary.setTotalTransactions(0);
            summary.setHighestExpense(0.0);
            summary.setLowestExpense(0.0);
            summary.setExpensesByCategory(new HashMap<>());
            summary.setMonthlyTrend(new ArrayList<>());
            summary.setTopExpenses(new ArrayList<>());
            summary.setRecentExpenses(new ArrayList<>());
            return summary;
        }

        // Calculate total expenses
        double total = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
        summary.setTotalExpenses(total);

        // Total transactions
        summary.setTotalTransactions(expenses.size());

        // Calculate monthly average
        long monthsBetween = java.time.temporal.ChronoUnit.MONTHS.between(startDate, endDate) + 1;
        Double monthlyAvg = monthsBetween > 0 ? total / monthsBetween : 0.0;
        summary.setMonthlyAverage(monthlyAvg);

        // Highest and lowest expense
        summary.setHighestExpense(
                expenses.stream()
                        .mapToDouble(Expense::getAmount)
                        .max()
                        .orElse(0.0)
        );
        summary.setLowestExpense(
                expenses.stream()
                        .mapToDouble(Expense::getAmount)
                        .min()
                        .orElse(0.0)
        );

        // Group expenses by category
        Map<String, Double> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));
        summary.setExpensesByCategory(byCategory);

        // Calculate monthly trend
        Map<String, List<Expense>> byMonth = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM"))
                ));

        List<MonthlyExpenseDTO> monthlyTrend = byMonth.entrySet().stream()
                .map(entry -> {
                    Double monthTotal = entry.getValue().stream()
                            .mapToDouble(Expense::getAmount)
                            .sum();
                    return new MonthlyExpenseDTO(
                            entry.getKey(),
                            monthTotal,
                            entry.getValue().size()
                    );
                })
                .sorted(Comparator.comparing(MonthlyExpenseDTO::getMonth))
                .collect(Collectors.toList());
        summary.setMonthlyTrend(monthlyTrend);

        // Top 5 expenses by amount
        List<ExpenseItemDTO> topExpenses = expenses.stream()
                .sorted(Comparator.comparing(Expense::getAmount).reversed())
                .limit(5)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        summary.setTopExpenses(topExpenses);

        // Recent 5 expenses by date
        List<ExpenseItemDTO> recentExpenses = expenses.stream()
                .sorted(Comparator.comparing(Expense::getDate).reversed())
                .limit(5)
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        summary.setRecentExpenses(recentExpenses);

        return summary;
    }

    private ExpenseItemDTO convertToDTO(Expense expense) {
        return new ExpenseItemDTO(
                expense.getId(),
                expense.getTitle(),
                expense.getCategory(),
                expense.getAmount(),
                expense.getDate().toString()
        );
    }
}
