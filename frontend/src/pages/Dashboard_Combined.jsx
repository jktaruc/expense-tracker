import React, { useState } from "react";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";
import AddIncome from "../components/AddIncome";
import IncomeList from "../components/IncomeList";
import "../css/Dashboard.css";

export default function Dashboard() {
    const [refreshFlag, setRefreshFlag] = useState(false);
    const [activeTab, setActiveTab] = useState("expenses"); // "expenses" or "income"

    const triggerRefresh = () => setRefreshFlag(prev => !prev);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Financial Dashboard</h1>
            
            {/* Tab Navigation */}
            <div style={styles.tabContainer}>
                <button 
                    onClick={() => setActiveTab("expenses")}
                    style={{
                        ...styles.tab,
                        ...(activeTab === "expenses" ? styles.activeTab : {})
                    }}
                >
                    💸 Expenses
                </button>
                <button 
                    onClick={() => setActiveTab("income")}
                    style={{
                        ...styles.tab,
                        ...(activeTab === "income" ? styles.activeTab : {})
                    }}
                >
                    💰 Income
                </button>
            </div>

            {/* Expenses Tab */}
            {activeTab === "expenses" && (
                <div>
                    <h2>Track Your Expenses</h2>
                    <AddExpense onAdd={triggerRefresh} />
                    <ExpenseList refresh={refreshFlag} />
                </div>
            )}

            {/* Income Tab */}
            {activeTab === "income" && (
                <div>
                    <h2>Track Your Income</h2>
                    <AddIncome onAdd={triggerRefresh} />
                    <IncomeList refresh={refreshFlag} />
                </div>
            )}
        </div>
    );
}

const styles = {
    tabContainer: {
        display: "flex",
        gap: "10px",
        marginBottom: "30px",
        borderBottom: "2px solid #e0e0e0"
    },
    tab: {
        padding: "12px 24px",
        border: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        borderBottom: "3px solid transparent",
        transition: "all 0.3s ease",
        color: "#666"
    },
    activeTab: {
        borderBottom: "3px solid #667eea",
        color: "#667eea",
        fontWeight: "600"
    }
};
