package com.expensetracker.backend.dto;

import lombok.*;
import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FinancialSummaryDTO {
    // Expense data
    private Double totalExpenses;
    private Integer totalExpenseTransactions;
    private Map<String, Double> expensesByCategory;
    
    // Income data
    private Double totalIncome;
    private Integer totalIncomeTransactions;
    private Map<String, Double> incomeByCategory;
    
    // Combined metrics
    private Double netBalance;  // income - expenses
    private Double savingsRate; // (income - expenses) / income * 100
    private Double monthlyAverageExpenses;
    private Double monthlyAverageIncome;
    
    // Trends
    private List<MonthlyFinancialDTO> monthlyTrend;
    
    // Top items
    private List<TransactionItemDTO> topExpenses;
    private List<TransactionItemDTO> topIncomes;
    private List<TransactionItemDTO> recentTransactions;
}

