import React, { useState } from "react";
import api from "../api/api";
import "../styles/AddExpense.css";
import { getTodayDate } from "../utils/date-utils.js";

export default function AddExpense({ onAdd }) {
    const CATEGORIES = [
        "Food",
        "Transport",
        "Bills",
        "Shopping",
        "Entertainment",
        "Other",
    ];
    const [expense, setExpense] = useState({
        title: "",
        category: CATEGORIES[0],
        amount: "",
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/expenses", {
                ...expense,
                amount: parseFloat(expense.amount)
            });

            setExpense({
                title: "",
                category: CATEGORIES[0],
                amount: "",
                date: getTodayDate()
            });

            if (onAdd) onAdd();
        } catch (err) {
            console.error("Failed to add expense", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setExpense(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="add-expense-form">
            <select
                name="category"
                value={expense.category}
                onChange={handleChange}
                className="add-expense-input"
            >
                {CATEGORIES.map(cat => (
                    <option value={cat}>
                        {cat}
                    </option>
                ))}
            </select>

            <input
                type="text"
                name="title"
                placeholder="Description"
                value={expense.title}
                onChange={handleChange}
                required
                className="add-expense-input"
            />

            <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={expense.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="add-expense-input"
            />

            <input
                type="date"
                name="date"
                value={expense.date}
                onChange={handleChange}
                required
                className="add-expense-input"
            />

            <button type="submit" className="add-expense-button">
                Add Expense
            </button>
        </form>
    );
}