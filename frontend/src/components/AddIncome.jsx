import React, { useState } from "react";
import api from "../api/api";
import "../styles/AddIncome.css";
import { getTodayDate } from "../utils/date-utils.js";

export default function AddIncome({ onAdd }) {
    const [income, setIncome] = useState({
        title: "",
        category: "Salary",
        amount: "",
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/incomes", {
                ...income,
                amount: parseFloat(income.amount)
            });

            setIncome({
                title: "",
                category: "Salary",
                amount: "",
                date: getTodayDate()
            });

            if (onAdd) onAdd();
        } catch (err) {
            console.error("Failed to add income", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setIncome(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="add-income-form">
            <select
                name="category"
                value={income.category}
                onChange={handleChange}
                className="add-income-input"
            >
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Business">Business</option>
                <option value="Gift">Gift</option>
                <option value="Other">Other</option>
            </select>

            <input
                type="text"
                name="title"
                placeholder="Description"
                value={income.title}
                onChange={handleChange}
                required
                className="add-income-input"
            />

            <input
                type="number"
                name="amount"
                placeholder="Amount"
                value={income.amount}
                onChange={handleChange}
                step="0.01"
                min="0"
                required
                className="add-income-input"
            />

            <input
                type="date"
                name="date"
                value={income.date}
                onChange={handleChange}
                required
                className="add-income-input"
            />

            <button type="submit" className="add-income-button">
                Add Income
            </button>
        </form>
    );
}
