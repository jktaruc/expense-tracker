import '../../styles/StatsCards.css';

function FinancialStatsCards({ summary }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const stats = [
    {
      label: 'Total Income',
      value: formatCurrency(summary.totalIncome),
      icon: '💰',
      color: 'green',
      subtext: `${summary.totalIncomeTransactions} transactions`
    },
    {
      label: 'Total Expenses',
      value: formatCurrency(summary.totalExpenses),
      icon: '💸',
      color: 'red',
      subtext: `${summary.totalExpenseTransactions} transactions`
    },
    {
      label: 'Net Balance',
      value: formatCurrency(summary.netBalance),
      icon: summary.netBalance >= 0 ? '✅' : '⚠️',
      color: summary.netBalance >= 0 ? 'blue' : 'orange',
      subtext: summary.netBalance >= 0 ? 'Surplus' : 'Deficit'
    },
    {
      label: 'Savings Rate',
      value: formatPercentage(summary.savingsRate),
      icon: '📊',
      color: 'purple',
      subtext: 'of income saved'
    }
  ];

  return (
    <div className="stats-cards">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card ${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
            {stat.subtext && <div className="stat-subtext">{stat.subtext}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FinancialStatsCards;
