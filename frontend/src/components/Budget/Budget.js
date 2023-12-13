import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './Budget.module.css';

const Budget = () => {
    const [budgets, setBudgets] = useState([]);
    const [spendings, setSpendings] = useState([]);
    const [currentBudget, setCurrentBudget] = useState({ _id: '', amount: '', startDate: '', endDate: '' });
    const [editing, setEditing] = useState(false);

    const resetForm = () => {
        setCurrentBudget({ _id: '', amount: '', startDate: '', endDate: '' });
        setEditing(false);
    };

    const formatDate = (date) => {
        const d = new Date(date);
        const adjustedDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
        return adjustedDate.toISOString().split('T')[0];
    };

    const fetchBudgets = useCallback(async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/budgets');
            setBudgets(response.data.data.map(budget => ({
                ...budget,
                startDate: formatDate(budget.startDate),
                endDate: formatDate(budget.endDate)
            })));
        } catch (error) {
            console.error('Error fetching budgets:', error);
        }
    }, []); 

    const fetchSpendings = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/spendings');
            console.log('Spendings data:', response.data.data);
            setSpendings(response.data.data);
        } catch (error) {
            console.error('Error fetching spendings:', error);
        }
    };

    useEffect(() => {
        fetchBudgets();
        fetchSpendings();
    }, [fetchBudgets]); 

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

        const budgetData = {
            amount: currentBudget.amount,
            startDate: formatDate(currentBudget.startDate),
            endDate: formatDate(currentBudget.endDate),
        };

        try {
            if (editing) {
                await axios.put(`http://localhost:4000/api/budgets/${currentBudget._id}`, budgetData);
            } else {
                await axios.post('http://localhost:4000/api/budgets', budgetData);
            }
            fetchBudgets();
            resetForm(); // Reset form after submit
        } catch (error) {
            console.error('Error submitting budget:', error);
        }
    };

    // Modified handleEdit
    const handleEdit = (budget) => {
        setCurrentBudget({ 
            _id: budget._id, 
            amount: budget.amount, 
            startDate: formatDate(budget.startDate), 
            endDate: formatDate(budget.endDate)
        });
        setEditing(true);
    };

    const handleCancelEdit = () => {
        setCurrentBudget({ _id: '', amount: '', startDate: '', endDate: '' });
        setEditing(false);
    };

    const handleDelete = async (id) => {
        const endpoint = `http://localhost:4000/api/budgets/${id}`;
        try {
            const response = await fetch(endpoint, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            resetForm();
            setBudgets(budgets.filter(budget => budget._id !== id));
        } catch (error) {
            console.error('Error deleting budget:', error);
        }
    };

    const calculateRemainingBudget = (budget) => {
        // Ensure budget amount is parsed as a number
        const budgetAmount = parseFloat(budget.amount);
        // console.log(`Budget amount for period ${budget.startDate} - ${budget.endDate}: ${budgetAmount}`);
    
        // Calculate the total spent amount within the budget period
        const spentAmount = spendings
            .filter(spend => {
                const spendDate = new Date(spend.date);
                return spendDate >= new Date(budget.startDate) && spendDate <= new Date(budget.endDate);
            })
            .reduce((acc, spend) => {
                return acc + parseFloat(spend.amount);
            }, 0);
        // console.log(`Total spent amount for period ${budget.startDate} - ${budget.endDate}: ${spentAmount}`);
    
    const remainingBudget = budgetAmount - spentAmount;
    // console.log(`Remaining budget for period ${budget.startDate} - ${budget.endDate}: ${remainingBudget}`);
    return remainingBudget;
    };

    return (
        <div className={styles.container}>
            <h2>Budgets</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="amount" className={styles.label}>Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        id="amount"
                        value={currentBudget.amount}
                        onChange={handleInputChange}
                        className={styles.inputField}
                        min="0"
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="startDate" className={styles.label}>Start Date:</label>
                    <input
                        type="date"
                        name="startDate"
                        id="startDate"
                        value={currentBudget.startDate}
                        onChange={handleInputChange}
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="endDate" className={styles.label}>End Date:</label>
                    <input
                        type="date"
                        name="endDate"
                        id="endDate"
                        value={currentBudget.endDate}
                        onChange={handleInputChange}
                        className={styles.inputField}
                    />
                </div>
                <div className={styles.buttonGroup}>
                    <button type="submit" className={styles.submitButton}>
                        {editing ? 'Update' : 'Add'} Budget
                    </button>
                    {editing && (
                        <button onClick={handleCancelEdit} className={styles.cancelButton}>
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <ul className={styles.budgetList}>
                {budgets.map((budget) => (
                    <li key={budget._id} className={styles.budgetItem}>
                        <div className={styles.itemDetails}>
                            <span className={styles.budgetLabel}>
                                Amount: ${budget.amount}<br />
                                Start: {budget.startDate}<br />
                                End: {budget.endDate}
                            </span>
                            <span className={styles.remainingBudget}>
                                Remaining: ${calculateRemainingBudget(budget).toFixed(2)}
                            </span>
                            <div className={styles.buttonGroup}>
                                <button onClick={() => handleEdit(budget)} className={styles.editButton}>Edit</button>
                                <button onClick={() => handleDelete(budget._id)} className={styles.deleteButton}>Delete</button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Budget;
