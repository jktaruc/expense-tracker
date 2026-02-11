import '../../styles/ExpensesList.css';

function RecentTransactions({ transactions }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  if (!transactions || transactions.length === 0) {
    return <p className="no-expenses">No transactions found</p>;
  }

  return (
    <div className="expenses-list">
      <ul>
        {transactions.map((transaction) => (
          <li key={transaction.id} className="expense-item">
            <div className="transaction-type-badge" style={
              transaction.type === 'INCOME' 
                ? { backgroundColor: '#4caf50', color: 'white' }
                : { backgroundColor: '#f44336', color: 'white' }
            }>
              {transaction.type === 'INCOME' ? '↑' : '↓'}
            </div>
            <div className="expense-details">
              <div className="expense-description">
                {transaction.title}
                <span style={{ 
                  marginLeft: '10px', 
                  fontSize: '0.85em',
                  color: transaction.type === 'INCOME' ? '#4caf50' : '#f44336',
                  fontWeight: 'bold'
                }}>
                  {transaction.type === 'INCOME' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </div>
              <div className="expense-meta">
                <span className="category">{transaction.category}</span>
                <span className="date">{formatDate(transaction.date)}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecentTransactions;
