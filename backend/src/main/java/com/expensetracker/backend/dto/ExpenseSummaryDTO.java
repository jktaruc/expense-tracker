package com.expensetracker.backend.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSummaryDTO {
    private Double totalExpenses;
    private Double monthlyAverage;
    private Integer totalTransactions;
    private Double highestExpense;
    private Double lowestExpense;
    private Map<String, Double> expensesByCategory;
    private List<MonthlyExpenseDTO> monthlyTrend;
    private List<ExpenseItemDTO> topExpenses;
    private List<ExpenseItemDTO> recentExpenses;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class MonthlyExpenseDTO {
    private String month;
    private Double total;
    private Integer count;
}

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
class ExpenseItemDTO {
    private String id;
    private String title;
    private String category;
    private Double amount;
    private String date;
}