import React, { useEffect, useRef, useState } from "react";
import api from "../api/api";

export default function ExpenseList({ refresh}) {
    const [expenses, setExpenses] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const deleteTimerRef = useRef(null);

    const deleteExpense = (expense) => {
        setDeletingId(expense.id);

        // wait for fade animation
        setTimeout(() => {
            setExpenses(prev => prev.filter(e => e.id !== expense.id));
            setPendingDelete(expense);

            deleteTimerRef.current = setTimeout(async () => {
                try {
                    await api.delete(`/expenses/${expense.id}`);
                    setPendingDelete(null);
                } catch (err) {
                    console.error("Failed to delete expense", err);
                }
            }, 5000);
        }, 300); // match fade duration
    };

    const undoDelete = () => {
        clearTimeout(deleteTimerRef.current);

        setExpenses(prev => [pendingDelete, ...prev]);
        setPendingDelete(null);
        setDeletingId(null); // 👈 important
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "No date";

        const [year, month, day] = isoDate.split("-");
        return `${month}-${day}-${year}`;
    };

    useEffect(() => {
        api.get("/expenses")
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err));
    }, [refresh]); // refresh triggers re-fetch

    return (
        <>
            {pendingDelete && (
                <div style={styles.undoMessage}>
                    Expense deleted
                    <button onClick={undoDelete} style={styles.undoBtn}>
                        Undo
                    </button>
                </div>
            )}

            {expenses.length === 0 && (
                <p>No expenses yet.</p>
            )}

            {expenses.length > 0 && (
                <div style={styles.grid}>
                    {expenses.map((expense) => (
                        <div key={expense.id} style={{
                            ...styles.card,
                            ...(deletingId === expense.id ? styles.fadeOut : {})
                        }}>
                            <h3>{expense.title || "Untitled"}</h3>
                            <p><strong>Category:</strong> {expense.category}</p>
                            <p><strong>Amount:</strong> ${expense.amount}</p>
                            <p><strong>Date:</strong> {formatDate(expense.date)}</p>

                            <button
                                style={styles.closeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteExpense(expense);
                                }}
                                aria-label="Delete expense"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
}

const styles = {
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "16px",
        marginTop: "20px"
    },
    card: {
        position: "relative",
        padding: "16px",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        backgroundColor: "#fff"
    },
    fadeOut: {
        opacity: 0,
        transform: "scale(0.95)",
        transition: "opacity 0.3s ease, transform 0.3s ease"
    },
    undoMessage: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "16px",
        padding: "10px",
        backgroundColor: "#fff8e1",
        border: "1px solid #ffe082",
        borderRadius: "6px"
    },
    undoBtn: {
        background: "none",
        border: "none",
        color: "#1976d2",
        cursor: "pointer",
        fontWeight: "bold"
    },
    closeBtn: {
        position: "absolute",
        top: "8px",
        right: "8px",
        border: "none",
        background: "transparent",
        fontSize: "18px",
        cursor: "pointer",
        color: "#999",
        lineHeight: 1
    }
};