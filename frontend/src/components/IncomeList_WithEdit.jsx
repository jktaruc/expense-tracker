import React, { useEffect, useState } from "react";
import api from "../api/api";
import Modal from "./Modal";
import EditIncomeForm from "./EditIncomeForm";
import { formatDate } from "../utils/dateUtils";
import "../styles/IncomeList.css";

export default function IncomeList({ refresh }) {
    const [incomes, setIncomes] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [editingIncome, setEditingIncome] = useState(null);

    const deleteIncome = async (income) => {
        if (!window.confirm(`Delete "${income.title}"?`)) {
            return;
        }

        setDeletingId(income.id);

        try {
            await api.delete(`/incomes/${income.id}`);
            
            setTimeout(() => {
                setIncomes(prev => prev.filter(i => i.id !== income.id));
                setDeletingId(null);
            }, 300);
        } catch (err) {
            console.error("Failed to delete income", err);
            alert("Failed to delete income");
            setDeletingId(null);
        }
    };

    const handleEdit = (income) => {
        setEditingIncome(income);
    };

    const handleSaveEdit = (updatedIncome) => {
        setIncomes(prev => 
            prev.map(i => i.id === updatedIncome.id ? updatedIncome : i)
        );
        setEditingIncome(null);
    };

    const handleCancelEdit = () => {
        setEditingIncome(null);
    };

    useEffect(() => {
        api.get("/incomes")
            .then(res => setIncomes(res.data))
            .catch(err => console.error(err));
    }, [refresh]);

    return (
        <>
            {incomes.length === 0 && (
                <p className="no-incomes">No income entries yet.</p>
            )}

            {incomes.length > 0 && (
                <div className="income-grid">
                    {incomes.map((income) => (
                        <div 
                            key={income.id} 
                            className={`income-card ${deletingId === income.id ? 'fade-out' : ''}`}
                        >
                            <h3>{income.title || "Untitled"}</h3>
                            <p><strong>Category:</strong> {income.category}</p>
                            <p><strong>Amount:</strong> ${income.amount}</p>
                            <p><strong>Date:</strong> {formatDate(income.date)}</p>

                            <div className="card-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => handleEdit(income)}
                                    aria-label="Edit income"
                                    title="Edit"
                                >
                                    ✏️
                                </button>
                                <button
                                    className="income-close-btn"
                                    onClick={() => deleteIncome(income)}
                                    aria-label="Delete income"
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
                isOpen={!!editingIncome}
                onClose={handleCancelEdit}
                title="Edit Income"
            >
                {editingIncome && (
                    <EditIncomeForm
                        income={editingIncome}
                        onSave={handleSaveEdit}
                        onCancel={handleCancelEdit}
                    />
                )}
            </Modal>
        </>
    );
}
