import React, { useState, useEffect, useCallback } from 'react';
import './Transaction.css'; 

const Transaction = ({ userId }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [transactions, setTransactions] = useState([]);

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

  const effectiveDate = date || new Date().toISOString().split('T')[0];

  function toLocalDateISOString(date) {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  }


  const handleSubmit = async (event) => {
    event.preventDefault();

    const [year, month, day] = date.split('-').map(part => parseInt(part, 10));
    const dateObject = new Date(year, month - 1, day + 1);
    const dateToSend = toLocalDateISOString(dateObject);  

    const spendingData = {
      amount: Number(amount),
      category,
      description,
      date: dateToSend,
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
        responseData.date = toLocalDateISOString(new Date(responseData.date));
      }
  
      setTransactions(prevTransactions => {
        return [...prevTransactions, { ...spendingData, _id: responseData._id }].sort((a, b) => new Date(a.date) - new Date(b.date));
      });

      await fetchTransactions();
  
      // Clear the form fields
      setAmount('');
      setCategory('');
      setDescription('');
      setDate('');
  
    } catch (error) {
      console.error('Error submitting the form:', error);
      // Optionally, fetch transactions again in case of error
      fetchTransactions();
    }
  };
  

  // Function to delete a transaction
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

  const groupByMonth = (transactions, effectiveDate) => {
    const groupedData = {};
    transactions.sort((a, b) => new Date(a.date) - new Date(b.date));
    transactions.forEach(item => {
      
      const dateToUse = item.date ? toLocalDateISOString(new Date(item.date)) : toLocalDateISOString(new Date(effectiveDate));
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
      <div className="transaction-form-container">
        <form className="transaction-form" onSubmit={handleSubmit}>
          <h2>Add Spending Transaction</h2>
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
    </div>
  );
};

export default Transaction;