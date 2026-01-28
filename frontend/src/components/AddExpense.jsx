import React, { useState } from "react";
import api from "../api/api";

export default function AddExpense({ onAdd }) {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const today = new Date().toISOString().split("T")[0];
    const CATEGORIES = [
        "Food",
        "Transport",
        "Bills",
        "Shopping",
        "Entertainment",
        "Other",
    ];
    const [category, setCategory] = useState("Other");
    const [date, setDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // YYYY-MM-DD
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.post("/expenses", {
                title: description,
                amount: parseFloat(amount),
                category,
                date, // YYYY-MM-DD
            });

            setDescription("");
            setAmount("");
            setCategory("Other");

            // reset date to today
            setDate(new Date().toISOString().split("T")[0]);

            if (onAdd) onAdd();
        } catch (err) {
            console.error(err);
            alert("Failed to add expense");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                required
            />
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
            />
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit">Add Expense</button>
        </form>
    );
}
