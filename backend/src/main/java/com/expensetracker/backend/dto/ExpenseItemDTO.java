package com.expensetracker.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseItemDTO {
    private String id;
    private String title;
    private String category;
    private Double amount;
    private String date;
}
