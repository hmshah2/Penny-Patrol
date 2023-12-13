import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './PieChart.module.css';

Chart.register(ArcElement, Tooltip, Legend);

const MyPieChart = () => {
    const [monthlySpendingData, setMonthlySpendingData] = useState({});
    const [monthlyIncomeData, setMonthlyIncomeData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');
    const [totalIncome, setTotalIncome] = useState(0);
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [netSavings, setNetSavings] = useState(0);
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        // After fetching and processing data
        setSelectedMonth(Object.keys(monthlySpendingData)[0] || '');
    }, [monthlySpendingData, monthlyIncomeData]);
    
    useEffect(() => {
        axios.get('http://localhost:4000/api/spendings')
            .then(response => {
                const spendings = response.data.data;
                const groupedSpendings = groupDataByMonth(spendings);
                setMonthlySpendingData(groupedSpendings);
                setSelectedMonth(Object.keys(groupedSpendings)[0] || '');
            })
            .catch(error => console.error("Error fetching spending data: ", error));

        axios.get('http://localhost:4000/api/incomes')
            .then(response => {
                const incomes = response.data.data;
                const groupedIncomes = groupDataByMonth(incomes);
                setMonthlyIncomeData(groupedIncomes);
            })
            .catch(error => console.error("Error fetching income data: ", error));

        axios.get('http://localhost:4000/api/budgets')
            .then(response => setBudgets(response.data.data))
            .catch(error => console.error("Error fetching budgets: ", error));
    }, []);

    useEffect(() => {
        const calculateTotals = () => {
            const selectedMonthIncomes = monthlyIncomeData[selectedMonth] || [];
            const selectedMonthExpenses = monthlySpendingData[selectedMonth] || [];

            const totalIncome = selectedMonthIncomes.reduce((acc, income) => acc + income.amount, 0);
            const totalExpenses = selectedMonthExpenses.reduce((acc, expense) => acc + expense.amount, 0);

            setTotalIncome(totalIncome);
            setTotalExpenses(totalExpenses);
            setNetSavings(totalIncome - totalExpenses);
        };

        if (selectedMonth) {
            calculateTotals();
        }
    }, [selectedMonth, monthlySpendingData, monthlyIncomeData]);

    const groupDataByMonth = (data) => {
        const groupedData = {};
        data.forEach(item => {
            const date = new Date(item.date);
            const sortableMonthYearKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
            const monthYearKey = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    
            if (!groupedData[sortableMonthYearKey]) {
                groupedData[sortableMonthYearKey] = { monthYearKey, data: [] };
            }
            groupedData[sortableMonthYearKey].data.push(item);
        });
    
        const sortedKeys = Object.keys(groupedData).sort();
        const sortedGroupedData = {};
        sortedKeys.forEach(key => {
            const { monthYearKey, data } = groupedData[key];
            sortedGroupedData[monthYearKey] = data;
        });
    
        return sortedGroupedData;
    };
    
    
    const processDataForChart = (data) => {
        if (!data || data.length === 0) {
            return {
                labels: ['No Data'],
                datasets: [{
                    data: [100],  
                    backgroundColor: ['#e0e0e0'],  
                    hoverOffset: 4
                }]
            };
        }
    
        const categoryTotals = {};
        data.forEach(item => {
            const category = item.category;
            const amount = item.amount;
            categoryTotals[category] = (categoryTotals[category] || 0) + amount;
        });
    
        return {
            labels: Object.keys(categoryTotals),
            datasets: [{
                data: Object.values(categoryTotals),
                backgroundColor: ['#47859c', '#67a2b4', '#87c1cc', '#a9e0e5', '#cdffff'],
                hoverOffset: 4
            }]
        };
    };
    const checkBudgetBreaches = (selectedMonthSpendingData, budgets, selectedMonth) => {
        const breaches = [];

        budgets.forEach(budget => {
            const { amount, category, startDate, endDate } = budget;
            const budgetStart = new Date(startDate);
            const budgetEnd = new Date(endDate);

            // Pro-rate the budget amount based on the number of days in the selected month
            const daysInBudgetPeriod = (budgetEnd - budgetStart) / (1000 * 60 * 60 * 24) + 1;
            const daysInSelectedMonth = new Date(budgetEnd.getFullYear(), budgetEnd.getMonth() + 1, 0).getDate();
            const proRatedAmount = amount / daysInBudgetPeriod * daysInSelectedMonth;

            const totalSpentInCategory = selectedMonthSpendingData
                .filter(spend => spend.category === category && new Date(spend.date) >= budgetStart && new Date(spend.date) <= budgetEnd)
                .reduce((total, spend) => total + spend.amount, 0);

            if (totalSpentInCategory > proRatedAmount) {
                breaches.push(`You went over budget in ${category} by $${(totalSpentInCategory - proRatedAmount).toFixed(2)} in ${selectedMonth}`);
            }
        });

        return breaches.length > 0 ? breaches : [`You maintained all budgets in ${selectedMonth}.`];
    };
    
    const calculateExpenses = (data) => {
        const expenses = data.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = { total: 0, transactions: 0 };
          }
          acc[item.category].total += item.amount;
          acc[item.category].transactions += 1;
          return acc;
        }, {});
      
        return expenses;
      };
      
    const expensesForSelectedMonth = calculateExpenses(monthlySpendingData[selectedMonth] || []);
    const budgetBreaches = checkBudgetBreaches(monthlySpendingData[selectedMonth] || [], budgets, selectedMonth);
    const months = Object.keys(monthlySpendingData);
    const options = {
        plugins: {
          legend: {
            labels: {
              font: {
                size: 20 
              }
            }
          },
          tooltip: {
            bodyFont: {
              size: 20
            }
          }
        }
      };
      
      
      return (
        <div className={styles.appContainer}>
          <div className={styles.summarySection}>
            <div className={styles.summaryCard}>
              <h3>Total Income</h3>
              <p>${totalIncome.toFixed(2)}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Total Expenses</h3>
              <p>-${totalExpenses.toFixed(2)}</p>
            </div>
            <div className={styles.summaryCard}>
              <h3>Net Savings</h3>
              <p>${netSavings.toFixed(2)}</p>
            </div>
            </div>
            <div className={styles.monthButtons}>
                <div className={styles.monthSelector}>
                    {months.map(month => (
                        <button
                            key={month}
                            onClick={() => setSelectedMonth(month)}
                            className={`${styles.buttonMonth} ${selectedMonth === month ? styles.buttonMonthSelected : ''}`}
                        >
                            {month}
                        </button>
                    ))}
                </div>
            </div>
            <main className={styles.appMain}>
            <section className={styles.chartSection}>
                <div className={styles.pieChartContainer}>
                    <Pie data={processDataForChart(monthlySpendingData[selectedMonth])} options={options} />
                </div>
            </section>
                <aside className={styles.detailsSection}>
                    <div className={styles.expensesContainer}>
                        <h2>Expenses</h2>
                        <ul className={styles.expensesList}>
                            {Object.entries(expensesForSelectedMonth).map(([category, { total, transactions }]) => (
                            <li key={category} className={styles.expenseItem}>
                                <span className={styles.expenseCategory}>{category}</span>
                                <span className={styles.expenseTransactions}>{transactions} Transactions</span>
                                <span className={styles.expenseAmount}>-${total.toFixed(2)}</span>
                            </li>
                            ))}
                        </ul>
                        {budgetBreaches.map((breach, index) => (
                            <p key={index}>{breach}</p>
                        ))}
                    </div>
                </aside>
            </main>
            <footer className={styles.appFooter}>
                &copy; 2023 Penny Patrol
            </footer>
        </div>
    );    
};

export default MyPieChart;
