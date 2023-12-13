import React, { useState, useEffect, useCallback } from 'react';
import './Transaction.css'; 

const Transaction = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [incomeAmount, setIncomeAmount] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('');
  const [incomeDescription, setIncomeDescription] = useState('');
  const [incomeDate, setIncomeDate] = useState('');
  const [incomeTransactions, setIncomeTransactions] = useState([]);

  const fetchTransactions = useCallback(async () => {
    const endpoint = `http://localhost:4000/api/spendings?${userId}`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTransactions(data.data); 
    } catch (error) {
      console.error("Could not fetch transactions:", error);
    }
  }, [userId]); 

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]); 

  const fetchIncomeTransactions = useCallback(async () => {
    const endpoint = `http://localhost:4000/api/incomes?user=${userId}`;
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setIncomeTransactions(data.data);
    } catch (error) {
      console.error("Could not fetch income transactions:", error);
    }
  }, [userId]);
  
  useEffect(() => {
    fetchIncomeTransactions();
  }, [fetchIncomeTransactions]); 

  const effectiveDate = date || new Date().toISOString().split('T')[0];

  const formatDate = (date) => {
    const d = new Date(date);
    const adjustedDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
    return adjustedDate.toISOString().split('T')[0];
};


  const handleSubmit = async (event) => {
    event.preventDefault();

    if (amount < 0) {
      alert("Amount cannot be negative");
    return;
  }

    // const [year, month, day] = date.split('-').map(part => parseInt(part, 10));
    // const dateObject = new Date(year, month - 1, day + 1);
    // const dateToSend = toLocalDateISOString(dateObject);  

    const spendingData = {
      amount: Number(amount),
      category,
      description,
      date: formatDate(date),
      user: userId,
    };
  
    const endpoint = 'http://localhost:4000/api/spendings';
  
    try {
        const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(spendingData),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (response.ok) {
        setAmount('');
        setCategory('');
        setDescription('');
        setDate('');
    }

    const responseData = await response.json();

      if (responseData.date.endsWith('Z')) {
        responseData.date = formatDate(new Date(responseData.date));
      }
  
      setTransactions(prevTransactions => {
        return [...prevTransactions, { ...spendingData, _id: responseData._id }].sort((a, b) => new Date(a.date) - new Date(b.date));
      });

      await fetchTransactions();
  
      setAmount('');
      setCategory('');
      setDescription('');
      setDate('');
  
    } catch (error) {
      console.error('Error submitting the form:', error);
      fetchTransactions();
    }
  };

  const handleIncomeSubmit = async (event) => {
    event.preventDefault();
    const incomeData = {
      amount: Number(incomeAmount),
      category: incomeCategory,
      description: incomeDescription,
      date: incomeDate || new Date().toISOString().split('T')[0],
      user: userId,
    };
  
    const endpoint = 'http://localhost:4000/api/incomes';
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(incomeData),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      await fetchIncomeTransactions();
  
      setIncomeAmount('');
      setIncomeCategory('');
      setIncomeDescription('');
      setIncomeDate('');
  
    } catch (error) {
      console.error('Error submitting the income form:', error);
    }
  };  
  
  const handleDelete = async (id) => {
    const endpoint = `http://localhost:4000/api/spendings/${id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTransactions(transactions.filter(transaction => transaction._id !== id));
    } catch (error) {
      console.error('Error deleting the transaction:', error);
    }
  };

  const handleIncomeDelete = async (id) => {
    const endpoint = `http://localhost:4000/api/incomes/${id}`;

    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIncomeTransactions(incomeTransactions.filter(income => income._id !== id));
    } catch (error) {
      console.error('Error deleting the income:', error);
    }
  };

  const groupByMonth = (transactions, effectiveDate) => {
    const groupedData = {};
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    transactions.forEach(item => {
      
      const dateToUse = item.date ? formatDate(new Date(item.date)) : formatDate(new Date(effectiveDate));
      const [year, month, day] = dateToUse.split('-').map(num => parseInt(num, 10));
      const monthYearKey = new Date(year, month - 1, day).toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!groupedData[monthYearKey]) {
        groupedData[monthYearKey] = [];
      }
      groupedData[monthYearKey].push(item);
    });
    return groupedData;
  };

  const transactionsByMonth = groupByMonth(transactions, effectiveDate);

  return (
    <div className="transactions-container">
      <div className="form-container">
        <div className="transaction-form-container">
          <form className="transaction-form" onSubmit={handleSubmit}>
            <h2>Add Transaction</h2>
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="$0.00"
              required
            />
            <input
              type="text"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              required
            />
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
            />
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit" className="submit-button">Done</button>
          </form>
        </div>
        <div className="income-form-container">
          <form className="income-form" onSubmit={handleIncomeSubmit}>
            <h2>Add Income</h2>
            <input
              type="number"
              name="incomeAmount"
              value={incomeAmount}
              onChange={(e) => setIncomeAmount(e.target.value)}
              placeholder="$0.00"
              required
            />
            <input
              type="text"
              name="incomeCategory"
              value={incomeCategory}
              onChange={(e) => setIncomeCategory(e.target.value)}
              placeholder="Category"
              required
            />
            <textarea
              name="incomeDescription"
              value={incomeDescription}
              onChange={(e) => setIncomeDescription(e.target.value)}
              placeholder="Description"
            />
            <input
              type="date"
              name="incomeDate"
              value={incomeDate}
              onChange={(e) => setIncomeDate(e.target.value)}
            />
            <button type="submit" className="submit-button">Add Income</button>
          </form>
        </div>
      </div>  
  
      <div className="transaction-lists-container">
      <div className="transactions-list">
        <h2>Transactions</h2>
        {Object.keys(transactionsByMonth).map((monthYear) => (
          <div key={monthYear}>
            <h3>{monthYear}</h3>
              {transactionsByMonth[monthYear].map((transaction) => (
                <div className="transaction-item" key={transaction._id}>
                  <span className="transaction-date">{new Date(transaction.date).toLocaleDateString()}</span>
                  <span className="transaction-amount">
                    ${typeof transaction.amount === 'number' ? transaction.amount.toFixed(2) : '0.00'}
                  </span>
                  <span className="transaction-category">{transaction.category}</span>
                  <span className="transaction-description">{transaction.description}</span>
                  <button className="delete-button" onClick={() => handleDelete(transaction._id)}>Delete</button>
                </div>
              ))}
          </div>
        ))}
      </div>

      <div className="transactions-list">
        <h2>Income</h2>
        {incomeTransactions.map((incomeTransaction) => (
          <div className="transaction-item" key={incomeTransaction._id}>
            <span className="transaction-date">{new Date(incomeTransaction.date).toLocaleDateString()}</span>
            <span className="transaction-amount">${incomeTransaction.amount.toFixed(2)}</span>
            <span className="transaction-category">{incomeTransaction.category}</span>
            <span className="transaction-description">{incomeTransaction.description}</span>
            <button className="delete-button" onClick={() => handleIncomeDelete(incomeTransaction._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  </div>
);
};

export default Transaction;