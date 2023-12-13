
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './PieChart.module.css'

Chart.register(ArcElement, Tooltip, Legend);

const MyPieChart = ({ }) => {
    const [monthlySpendingData, setMonthlySpendingData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4000/api/spendings`)
             .then(response => {
                 console.log("Spending Data:", response.data.data); 
                 const groupedData = groupDataByMonth(response.data.data);
                 setMonthlySpendingData(groupedData);

                 const firstMonthWithData = Object.keys(groupedData).find(month => groupedData[month].length > 0);
                 if (firstMonthWithData) {
                    setSelectedMonth(firstMonthWithData);
                 } else {
                    console.log("No data found for any month");
                 }
             })
             .catch(error => {
                 console.error("Error fetching spending data: ", error);
             });

        axios.get(`http://localhost:4000/api/budgets`)
             .then(response => {
                 setBudgets(response.data.data);
             })
             .catch(error => console.error("Error fetching budgets: ", error));
    }, []);

    const groupDataByMonth = (data) => {
        const groupedData = {};
        data.forEach(item => {
            const [year, month, day] = item.date.split('-').map(num => parseInt(num, 10));
            const monthYearKey = new Date(year, month - 1, day).toLocaleString('default', { month: 'long', year: 'numeric' });
    
            if (!groupedData[monthYearKey]) {
                groupedData[monthYearKey] = [];
            }
            groupedData[monthYearKey].push(item);
        });
        return groupedData;
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
    
    const checkBudgetBreaches = (selectedMonthSpendingData, budgets) => {
        const breaches = [];
        
        budgets.forEach(budget => {
            const { amount, category, startDate, endDate } = budget;
            const budgetStart = new Date(startDate);
            const budgetEnd = new Date(endDate);
    
            const isWithinBudgetPeriod = selectedMonthSpendingData.some(spend => {
                const spendDate = new Date(spend.date);
                return spendDate >= budgetStart && spendDate <= budgetEnd;
            });
    
            if (isWithinBudgetPeriod) {
                const totalSpent = selectedMonthSpendingData
                    .filter(spend => spend.category === category)
                    .reduce((total, spend) => total + spend.amount, 0);
    
                const monthlyBudgetAmount = amount / ((budgetEnd.getFullYear() - budgetStart.getFullYear()) * 12 + budgetEnd.getMonth() - budgetStart.getMonth() + 1);
                
                if (totalSpent > monthlyBudgetAmount) {
                    const overAmount = totalSpent - monthlyBudgetAmount;
                    breaches.push(`You went $${overAmount.toFixed(2)} over your ${category} budget in ${selectedMonth}`);
                }
            }
        });
    
        return breaches.length > 0 ? breaches : [`You followed your budget in ${selectedMonth}!`];
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
    const budgetBreaches = checkBudgetBreaches(monthlySpendingData[selectedMonth] || [], budgets);
    const months = Object.keys(monthlySpendingData);

    const [activeNav, setActiveNav] = useState('Financial Analysis'); 

    const renderNavButton = (label, activeLabel) => {
        return (
            <button
                className={`${styles.navButton} ${activeLabel === label ? styles.navButtonActive : ''}`}
                onClick={() => setActiveNav(label)}
            >
                {label}
            </button>
        );
    };

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
