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