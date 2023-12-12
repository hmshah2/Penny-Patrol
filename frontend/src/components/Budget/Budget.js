import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Budget.module.css'; 

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [spendings, setSpendings] = useState([]);
    const [currentBudget, setCurrentBudget] = useState({ amount: '', startDate: '', endDate: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        fetchBudgets();
        fetchSpendings();
    }, []);

    const formatDate = (date) => {
        const d = new Date(date);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    };    

    const fetchBudgets = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/budgets');
            setBudgets(response.data.data);
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    };

    const fetchSpendings = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/spendings');
            setSpendings(response.data.data);
        } catch (error) {
            console.error('Error fetching spendings:', error);
        }
    };

    const handleInputChange = (e) => {
        setCurrentBudget({ ...currentBudget, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (currentBudget.amount < 0) {
            alert("Amount cannot be negative");
            return;
        }

        if (new Date(currentBudget.startDate) >= new Date(currentBudget.endDate)) {
            alert("Start date must be before the end date.");
            return;
        }

        try {
            const budgetData = { amount: currentBudget.amount, startDate: new Date(currentBudget.startDate), endDate: new Date(currentBudget.endDate) };
            if (editing) {
                await axios.put(`http://localhost:4000/api/budgets/${currentBudget._id}`, budgetData);
            } else {
                await axios.post('http://localhost:4000/api/budgets', budgetData);
            }
            fetchBudgets();
            handleCancelEdit();
        } catch (error) {
            console.error('Error submitting budget:', error);
        }
    };
    const handleEdit = (budget) => {
        setCurrentBudget({ ...budget, startDate: formatDate(budget.startDate), endDate: formatDate(budget.endDate) });
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setCurrentBudget({ _id: null, amount: '', startDate: '', endDate: '' });
        setEditing(false);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:4000/api/budgets/${id}`);
            fetchBudgets();
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const calculateRemainingBudget = (budget) => {
        const spentAmount = spendings
            .filter(spend => new Date(spend.date) >= new Date(budget.startDate) && new Date(spend.date) <= new Date(budget.endDate))
            .reduce((acc, spend) => acc + spend.amount, 0);
        return budget.amount - spentAmount;
    };

    return (
        <div className={styles.container}>
            <h2>Budgets</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="amount">Amount:</label>
                    <input
                        className={styles.inputField}
                        type="number"
                        name="amount"
                        id="amount"
                        value={currentBudget.amount}
                        onChange={handleInputChange}
                        min="0"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="startDate">Start Date:</label>
                    <input
                        className={styles.inputField}
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={currentBudget.startDate}
                        onChange={handleInputChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label} htmlFor="endDate">End Date:</label>
                    <input
                        className={styles.inputField}
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={currentBudget.endDate}
                        onChange={handleInputChange}
                    />
                </div>
                <button type="submit" className={styles.submitButton}>{editing ? 'Update' : 'Add'} Budget</button>
                {editing && (
                    <button onClick={handleCancelEdit} className={styles.cancelButton}>
                        Cancel Edit
                    </button>
                )}
            </form>
    
            <ul className={styles.budgetList}>
                {budgets.map((budget) => (
                    <li key={budget._id} className={styles.budgetItem}>
                        <div className={styles.itemDetails}>
                            <span className={styles.budgetLabel}>
                                {`Amount: $${budget.amount}, Start: ${new Date(budget.startDate).toLocaleDateString()}, End: ${new Date(budget.endDate).toLocaleDateString()}`}
                            </span>
                            <span className={styles.remainingBudget}>
                                Remaining: ${calculateRemainingBudget(budget).toFixed(2)}
                            </span>
                            <button onClick={() => handleEdit(budget)} className={styles.editButton}>Edit</button>
                            <button onClick={() => handleDelete(budget._id)} className={styles.deleteButton}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );    
};

export default Budget;
