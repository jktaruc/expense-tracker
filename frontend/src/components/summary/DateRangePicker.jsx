import '../../styles/DateRangePicker.css';

function DateRangePicker({ dateRange, onChange }) {
  const handlePresetClick = (preset) => {
    const today = new Date();
    let startDate, endDate = formatDate(today);

    switch (preset) {
      case 'thisMonth':
        startDate = formatDate(new Date(today.getFullYear(), today.getMonth(), 1));
        break;
      case 'lastMonth':
        const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
        startDate = formatDate(lastMonth);
        endDate = formatDate(lastMonthEnd);
        break;
      case 'last3Months':
        startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 3, today.getDate()));
        break;
      case 'last6Months':
        startDate = formatDate(new Date(today.getFullYear(), today.getMonth() - 6, today.getDate()));
        break;
      case 'thisYear':
        startDate = formatDate(new Date(today.getFullYear(), 0, 1));
        break;
      default:
        return;
    }

    onChange({ startDate, endDate });
  };

  const handleCustomChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...dateRange,
      [name]: value
    });
  };

  return (
    <div className="date-range-picker">
      <div className="preset-buttons">
        <button onClick={() => handlePresetClick('thisMonth')}>This Month</button>
        <button onClick={() => handlePresetClick('lastMonth')}>Last Month</button>
        <button onClick={() => handlePresetClick('last3Months')}>Last 3 Months</button>
        <button onClick={() => handlePresetClick('last6Months')}>Last 6 Months</button>
        <button onClick={() => handlePresetClick('thisYear')}>This Year</button>
      </div>
      
      <div className="custom-dates">
        <label>
          From:
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleCustomChange}
          />
        </label>
        <label>
          To:
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleCustomChange}
          />
        </label>
      </div>
    </div>
  );
}

// Helper function to format date as YYYY-MM-DD
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export default DateRangePicker;
