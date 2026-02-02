package com.expensetracker.backend.repository;

import com.expensetracker.backend.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IncomeRepository extends JpaRepository<Income, String> {
    
    List<Income> findByDateBetween(LocalDate startDate, LocalDate endDate);
    
    // If you're using multi-user support:
    // List<Income> findByUserIdAndDateBetween(String userId, LocalDate startDate, LocalDate endDate);
}
