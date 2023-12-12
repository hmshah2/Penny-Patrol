import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import styles from './PieChart.module.css';

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = ({ userId }) => {
    const [monthlySpendingData, setMonthlySpendingData] = useState({});
    const [selectedMonth, setSelectedMonth] = useState('');
    const [budgets, setBudgets] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:4000/api/spendings?where={"user":"${userId}"}`)
             .then(response => {
                 const groupedData = groupDataByMonth(response.data.data);
                 setMonthlySpendingData(groupedData);

                 const firstMonthWithData = Object.keys(groupedData).find(month => groupedData[month].length > 0);
                 if (firstMonthWithData) {
                    setSelectedMonth(firstMonthWithData);
                 }
             })
             .catch(error => {
                 console.error("Error fetching spending data: ", error);
             });

        axios.get(`http://localhost:4000/api/budgets?where={"user":"${userId}"}`)
             .then(response => {
                 setBudgets(response.data.data);
             })
             .catch(error => console.error("Error fetching budgets: ", error));
    }, [userId]);

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

    const months = Object.keys(monthlySpendingData);

    return (
        <div className={styles.appContainer}>
            <div className={styles.monthButtons}>
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
            <main className={styles.appMain}>
                {selectedMonth && monthlySpendingData[selectedMonth] && 
                 monthlySpendingData[selectedMonth].length > 0 && 
                 <Pie data={processDataForChart(monthlySpendingData[selectedMonth])} />}
            </main>
        </div>
    );
};

export default PieChart;