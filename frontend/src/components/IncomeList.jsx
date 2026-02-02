import React, { useEffect, useRef, useState } from "react";
import api from "../api/api";

export default function IncomeList({ refresh }) {
    const [incomes, setIncomes] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [pendingDelete, setPendingDelete] = useState(null);
    const deleteTimerRef = useRef(null);

    const deleteIncome = (income) => {
        setDeletingId(income.id);

        setTimeout(() => {
            setIncomes(prev => prev.filter(i => i.id !== income.id));
            setPendingDelete(income);

            deleteTimerRef.current = setTimeout(async () => {
                try {
                    await api.delete(`/incomes/${income.id}`);
                    setPendingDelete(null);
                } catch (err) {
                    console.error("Failed to delete income", err);
                }
            }, 5000);
        }, 300);
    };

    const undoDelete = () => {
        clearTimeout(deleteTimerRef.current);
        setIncomes(prev => [pendingDelete, ...prev]);
        setPendingDelete(null);
        setDeletingId(null);
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return "No date";
        const [year, month, day] = isoDate.split("-");
        return `${month}-${day}-${year}`;
    };

    useEffect(() => {
        api.get("/incomes")
            .then(res => setIncomes(res.data))
            .catch(err => console.error(err));
    }, [refresh]);

    return (
        <>
            {pendingDelete && (
                <div style={styles.undoMessage}>
                    Income deleted
                    <button onClick={undoDelete} style={styles.undoBtn}>
                        Undo
                    </button>
                </div>
            )}

            {incomes.length === 0 && (
                <p>No income entries yet.</p>
            )}

            {incomes.length > 0 && (
                <div style={styles.grid}>
                    {incomes.map((income) => (
                        <div key={income.id} style={{
                            ...styles.card,
                            ...(deletingId === income.id ? styles.fadeOut : {})
                        }}>
                            <h3>{income.title || "Untitled"}</h3>
                            <p><strong>Category:</strong> {income.category}</p>
                            <p><strong>Amount:</strong> ${income.amount}</p>
                            <p><strong>Date:</strong> {formatDate(income.date)}</p>

                            <button
                                style={styles.closeBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteIncome(income);
                                }}
                                aria-label="Delete income"
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
        backgroundColor: "#e8f5e9", // Light green background for income
        border: "2px solid #4caf50"
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
        backgroundColor: "#e8f5e9",
        border: "1px solid #4caf50",
        borderRadius: "6px"
    },
    undoBtn: {
        background: "none",
        border: "none",
        color: "#2e7d32",
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
