import "../styles/IncomeCard.css";
import { formatDate } from "../utils/date-utils.js";

export default function IncomeCard({ income, onDelete, isDeleting }) {
    return (
        <div
            key={income.id}
            className={`income-card ${isDeleting ? 'fade-out' : ''}`}
        >
            <h3>{income.title || "Untitled"}</h3>
            <p><strong>Category:</strong> {income.category}</p>
            <p><strong>Amount:</strong> ${income.amount}</p>
            <p><strong>Date:</strong> {formatDate(income.date)}</p>

            <button
                className="income-close-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(income);
                }}
                aria-label="Delete income"
            >
                ✕
            </button>
        </div>
    );
}