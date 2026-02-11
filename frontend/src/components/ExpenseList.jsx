import React, { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "./Modal";
import EditExpenseForm from "./EditExpenseForm";
import { formatDate } from "../utils/date-utils.js";
import "../styles/ExpenseList.css";

export default function ExpenseList({ refresh }) {
    const [expenses, setExpenses] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [editingExpense, setEditingExpense] = useState(null);

    const deleteExpense = async (expense) => {
        if (!window.confirm(`Delete "${expense.title}"?`)) {
            return;
        }

        setDeletingId(expense.id);

        try {
            await api.delete(`/expenses/${expense.id}`);

            setTimeout(() => {
                setExpenses(prev => prev.filter(e => e.id !== expense.id));
                setDeletingId(null);
            }, 300);
        } catch (err) {
            console.error("Failed to delete expense", err);
            alert("Failed to delete expense");
            setDeletingId(null);
        }
    };

    const handleEdit = (expense) => {
        setEditingExpense(expense);
    };

    const handleSaveEdit = (updatedExpense) => {
        setExpenses(prev =>
            prev.map(e => e.id === updatedExpense.id ? updatedExpense : e)
        );
        setEditingExpense(null);
    };

    const handleCancelEdit = () => {
        setEditingExpense(null);
    };

    useEffect(() => {
        api.get("/expenses")
            .then(res => setExpenses(res.data))
            .catch(err => console.error(err));
    }, [refresh]);

    return (
        <>
            {expenses.length === 0 && (
                <p className="no-expenses">No expenses yet.</p>
            )}

            {expenses.length > 0 && (
                <div className="expense-grid">
                    {expenses.map((expense) => (
                        <div
                            key={expense.id}
                            className={`expense-card ${deletingId === expense.id ? 'fade-out' : ''}`}
                        >
                            <h3>{expense.title || "Untitled"}</h3>
                            <p><strong>Category:</strong> {expense.category}</p>
                            <p><strong>Amount:</strong> ${expense.amount}</p>
                            <p><strong>Date:</strong> {formatDate(expense.date)}</p>

                            <div className="card-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(expense)}
                                    aria-label="Edit expense"
                                    title="Edit"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="expense-close-btn"
                                    onClick={() => deleteExpense(expense)}
                                    aria-label="Delete expense"
                                    title="Delete"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <Modal
                isOpen={!!editingExpense}
                onClose={handleCancelEdit}
                title="Edit Expense"
            >
                {editingExpense && (
                    <EditExpenseForm
                        expense={editingExpense}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                    />
                )}
            </Modal>
        </>
    );
}
