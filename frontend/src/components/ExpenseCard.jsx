import "../styles/ExpenseCard.css";
import { formatDate } from "../utils/date-utils.js";

export default function ExpenseCard({ expense, onDelete, isDeleting }) {
    return (
        <div className="expense-grid">
            <div
                key={expense.id}
                className={`expense-card ${isDeleting ? 'fade-out' : ''}`}
            >
                <h3>{expense.title || "Untitled"}</h3>
                <p><strong>Category:</strong> {expense.category}</p>
                <p><strong>Amount:</strong> ${expense.amount}</p>
                <p><strong>Date:</strong> {formatDate(expense.date)}</p>

                <button
                    className="expense-close-btn"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(expense);
                    }}
                    aria-label="Delete expense"
                >
                    ✕
                </button>
            </div>
        </div>
    );
}