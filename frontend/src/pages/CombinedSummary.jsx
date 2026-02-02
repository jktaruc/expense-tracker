import { useState, useEffect } from 'react';
import axios from 'axios';
import FinancialStatsCards from '../components/summary/FinancialStatsCards';
import IncomeVsExpenseChart from '../components/summary/IncomeVsExpenseChart';
import CategoryBreakdown from '../components/summary/CategoryBreakdown';
import MonthlyTrendChart from '../components/summary/MonthlyTrendChart';
import RecentTransactions from '../components/summary/RecentTransactions';
import DateRangePicker from '../components/summary/DateRangePicker';
import '../styles/Summary.css';

function CombinedSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: getDateMonthsAgo(6),
    endDate: getTodayDate()
  });

  useEffect(() => {
    fetchSummary();
  }, [dateRange]);

  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/expenses/financial-summary', {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }
      });
      console.log('Financial summary:', response.data);
      setSummary(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load financial summary');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRangeChange = (newRange) => {
    setDateRange(newRange);
  };

  if (loading) {
    return <div className="loading">Loading financial summary...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!summary) {
    return <div className="no-data">No data available</div>;
  }

  return (
    <div className="summary-page">
      <div className="summary-header">
        <h1>Financial Summary</h1>
        <DateRangePicker 
          dateRange={dateRange}
          onChange={handleDateRangeChange}
        />
      </div>

      <FinancialStatsCards summary={summary} />

      <div className="charts-grid">
        <div className="chart-container">
          <h2>Income vs Expenses</h2>
          <IncomeVsExpenseChart data={summary.monthlyTrend} />
        </div>

        <div className="chart-container">
          <h2>Category Breakdown</h2>
          <CategoryBreakdown 
            expenses={summary.expensesByCategory} 
            income={summary.incomeByCategory}
          />
        </div>
      </div>

      <div className="expenses-lists">
        <div className="list-container">
          <h2>Recent Transactions</h2>
          <RecentTransactions transactions={summary.recentTransactions} />
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

function getDateMonthsAgo(months) {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString().split('T')[0];
}

export default CombinedSummary;
