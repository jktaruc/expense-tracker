package com.expensetracker.backend.service;

import com.expensetracker.backend.dto.FinancialSummaryDTO;
import com.expensetracker.backend.dto.MonthlyFinancialDTO;
import com.expensetracker.backend.dto.TransactionItemDTO;
import com.expensetracker.backend.entity.Expense;
import com.expensetracker.backend.entity.Income;
import com.expensetracker.backend.repository.ExpenseRepository;
import com.expensetracker.backend.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class FinancialSummaryService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    public FinancialSummaryDTO getFinancialSummary(LocalDate startDate, LocalDate endDate) {
        // Get data
        List<Expense> expenses = expenseRepository.findByDateBetween(startDate, endDate);
        List<Income> incomes = incomeRepository.findByDateBetween(startDate, endDate);

        FinancialSummaryDTO summary = new FinancialSummaryDTO();

        // Calculate expense totals
        Double totalExpenses = expenses.stream()
                .mapToDouble(Expense::getAmount)
                .sum();
        summary.setTotalExpenses(totalExpenses);
        summary.setTotalExpenseTransactions(expenses.size());

        // Calculate income totals
        Double totalIncome = incomes.stream()
                .mapToDouble(Income::getAmount)
                .sum();
        summary.setTotalIncome(totalIncome);
        summary.setTotalIncomeTransactions(incomes.size());

        // Calculate combined metrics
        Double netBalance = totalIncome - totalExpenses;
        summary.setNetBalance(netBalance);

        // Savings rate
        Double savingsRate = totalIncome > 0
                ? ((totalIncome - totalExpenses) / totalIncome * 100)
                : 0.0;
        summary.setSavingsRate(savingsRate);

        // Monthly averages
        long monthsBetween = java.time.temporal.ChronoUnit.MONTHS.between(startDate, endDate) + 1;
        summary.setMonthlyAverageExpenses(monthsBetween > 0 ? totalExpenses / monthsBetween : 0.0);
        summary.setMonthlyAverageIncome(monthsBetween > 0 ? totalIncome / monthsBetween : 0.0);

        // Expenses by category
        Map<String, Double> expensesByCategory = expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getAmount)
                ));
        summary.setExpensesByCategory(expensesByCategory);

        // Income by category
        Map<String, Double> incomeByCategory = incomes.stream()
                .collect(Collectors.groupingBy(
                        Income::getCategory,
                        Collectors.summingDouble(Income::getAmount)
                ));
        summary.setIncomeByCategory(incomeByCategory);

        // Monthly trend
        summary.setMonthlyTrend(calculateMonthlyTrend(expenses, incomes));

        // Top expenses
        List<TransactionItemDTO> topExpenses = expenses.stream()
                .sorted(Comparator.comparing(Expense::getAmount).reversed())
                .limit(5)
                .map(e -> new TransactionItemDTO(
                        e.getId(),
                        e.getTitle(),
                        e.getCategory(),
                        e.getAmount(),
                        e.getDate().toString(),
                        "EXPENSE"
                ))
                .collect(Collectors.toList());
        summary.setTopExpenses(topExpenses);

        // Top incomes
        List<TransactionItemDTO> topIncomes = incomes.stream()
                .sorted(Comparator.comparing(Income::getAmount).reversed())
                .limit(5)
                .map(i -> new TransactionItemDTO(
                        i.getId(),
                        i.getTitle(),
                        i.getCategory(),
                        i.getAmount(),
                        i.getDate().toString(),
                        "INCOME"
                ))
                .collect(Collectors.toList());
        summary.setTopIncomes(topIncomes);

        // Recent transactions (combined)
        List<TransactionItemDTO> recentTransactions = Stream.concat(
                        expenses.stream().map(e -> new TransactionItemDTO(
                                e.getId(),
                                e.getTitle(),
                                e.getCategory(),
                                e.getAmount(),
                                e.getDate().toString(),
                                "EXPENSE"
                        )),
                        incomes.stream().map(i -> new TransactionItemDTO(
                                i.getId(),
                                i.getTitle(),
                                i.getCategory(),
                                i.getAmount(),
                                i.getDate().toString(),
                                "INCOME"
                        ))
                )
                .sorted(Comparator.comparing(TransactionItemDTO::getDate).reversed())
                .limit(10)
                .collect(Collectors.toList());
        summary.setRecentTransactions(recentTransactions);

        return summary;
    }

    private List<MonthlyFinancialDTO> calculateMonthlyTrend(List<Expense> expenses, List<Income> incomes) {
        // Group expenses by month
        Map<String, List<Expense>> expensesByMonth = expenses.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM"))
                ));

        // Group incomes by month
        Map<String, List<Income>> incomesByMonth = incomes.stream()
                .collect(Collectors.groupingBy(
                        i -> i.getDate().format(DateTimeFormatter.ofPattern("yyyy-MM"))
                ));

        // Get all unique months
        Set<String> allMonths = new TreeSet<>();
        allMonths.addAll(expensesByMonth.keySet());
        allMonths.addAll(incomesByMonth.keySet());

        return allMonths.stream()
                .map(month -> {
                    Double monthExpenses = expensesByMonth.getOrDefault(month, Collections.emptyList())
                            .stream()
                            .mapToDouble(Expense::getAmount)
                            .sum();

                    Double monthIncome = incomesByMonth.getOrDefault(month, Collections.emptyList())
                            .stream()
                            .mapToDouble(Income::getAmount)
                            .sum();

                    Integer expenseCount = expensesByMonth.getOrDefault(month, Collections.emptyList()).size();
                    Integer incomeCount = incomesByMonth.getOrDefault(month, Collections.emptyList()).size();

                    return new MonthlyFinancialDTO(
                            month,
                            monthExpenses,
                            monthIncome,
                            monthIncome - monthExpenses,
                            expenseCount,
                            incomeCount
                    );
                })
                .sorted(Comparator.comparing(MonthlyFinancialDTO::getMonth))
                .collect(Collectors.toList());
    }
}