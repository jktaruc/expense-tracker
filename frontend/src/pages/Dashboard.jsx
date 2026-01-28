import React, { useState } from "react";
import AddExpense from "../components/AddExpense";
import ExpenseList from "../components/ExpenseList";

export default function Dashboard() {
    const [refreshFlag, setRefreshFlag] = useState(false);

    const triggerRefresh = () => setRefreshFlag(prev => !prev);

    return (
        <div style={{ padding: "20px" }}>
            <h1>Expense Tracker Dashboard</h1>
            <AddExpense onAdd={triggerRefresh} />
            <ExpenseList refresh={refreshFlag} />
        </div>
    );
}

