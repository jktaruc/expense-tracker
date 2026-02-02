import React, { useState } from "react";
import api from "../api/api";

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
            
            // Reset form
            setIncome({
                title: "",
                category: "Salary",
                amount: "",
                date: new Date().toISOString().split('T')[0]
            });
            
            // Trigger refresh in parent
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
        <form onSubmit={handleSubmit} style={styles.form}>
            <select 
                name="category" 
                value={income.category} 
                onChange={handleChange}
                style={styles.input}
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
                style={styles.input}
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
                style={styles.input}
            />

            <input
                type="date"
                name="date"
                value={income.date}
                onChange={handleChange}
                required
                style={styles.input}
            />

            <button type="submit" style={styles.button}>
                Add Income
            </button>
        </form>
    );
}

const styles = {
    form: {
        display: "flex",
        gap: "10px",
        marginBottom: "20px",
        flexWrap: "wrap"
    },
    input: {
        padding: "8px 12px",
        border: "1px solid #ddd",
        borderRadius: "4px",
        fontSize: "14px"
    },
    button: {
        padding: "8px 20px",
        backgroundColor: "#4caf50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        fontWeight: "bold"
    }
};
