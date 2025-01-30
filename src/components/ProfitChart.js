import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import 'chart.js/auto';

const ProfitChart = () => {
  const [bills,setBills]=useState([]);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [weeklyProfit, setWeeklyProfit] = useState(0);
  const [monthlyProfit, setMonthlyProfit] = useState(0);
  const [categoryProfits, setCategoryProfits] = useState({});

  const URL = "https://inventory-backend-igds.onrender.com"
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbill=await axios.get(`${URL}/bill/get`);
        setBills(dbill.data.slice(-5));

        const dailyResponse = await axios.get(`${URL}/profit/daily`);
        setDailyProfit(dailyResponse.data.profit);

        const weeklyResponse = await axios.get(`${URL}/profit/weekly`);
        setWeeklyProfit(weeklyResponse.data.profit);

        const monthlyResponse = await axios.get(`${URL}/profit/monthly`);
        setMonthlyProfit(monthlyResponse.data.profit);

        const categoryResponse = await axios.get(`${URL}/profit/category`);
        setCategoryProfits(categoryResponse.data.categoryProfits);
      } catch (error) {
        console.error('Error fetching profit data:', error);
      }
    };

    fetchData();
  }, []);


  const categoryLabels = Object.keys(categoryProfits);
  const categoryData = Object.values(categoryProfits);
  console.log(dailyProfit)

  return (
    <div className="p-6 flex flex-wrap gap-3">
      

      <div className="mb-6 bg-white p-2 rounded-lg text-center flex flex-col items-center justify-center gap-3 shadow-md w-screen md:w-1/4 md:h-[13%]">
        <h3 className="text-xl font-bold mb-4">Daily Profit</h3>
        <div className=''>
        {dailyProfit!==0 ? <div className='flex flex-col gap-3'>
          <div className='h-40'><Pie
          data={{
            labels: ['Today'],
            datasets: [
              {
                label: 'Profit',
                data: [dailyProfit],
                backgroundColor: ['#BFDBF7','#022B3A'],
                borderColor: ['#BFDBF7','#022B3A'],
              },
            ],
          }}
        /></div>
        <span>Today's Profit : {dailyProfit}</span>
        </div> : <div className=" font-serif">No bills for today</div>}
        </div>
      </div>

      <div className="mb-6 bg-white p-2 text-center rounded-lg shadow-md w-screen md:w-2/6 h-[13%]">
        <h3 className="text-xl font-bold mb-4">Weekly Profit</h3>
        <Bar
          data={{
            labels: ['Last 7 Days'],
            datasets: [
              {
                label: 'Profit',
                data: [weeklyProfit],
                backgroundColor: ['#BFDBF7','#022B3A'],
                borderColor: ['#BFDBF7','#022B3A'],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
        <span className='text-center'>Total Weekly Profit : {weeklyProfit}</span>
      </div>

      <div className="mb-6 bg-white p-2 rounded-lg shadow-md w-screen md:w-2/6 h-[10%]">
        <h3 className="text-xl font-bold mb-4">Monthly Profit</h3>
        <Bar
          data={{
            labels: ['Last 30 Days'],
            datasets: [
              {
                label: 'Profit',
                data: [monthlyProfit],
                backgroundColor: ['#BFDBF7','#022B3A'],
                borderColor: ['#BFDBF7','#022B3A'],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>

      <div className=' bg-white p-2 rounded-lg shadow-md w-screen md:w-2/5 h-[15%]'>
        <h3 className="text-xl font-bold mb-4">Category-based Profit</h3>
        <Bar
          data={{
            labels: categoryLabels,
            datasets: [
              {
                label: 'Profit',
                data: categoryData,
                backgroundColor: ['#BFDBF7','#022B3A'],
                borderColor: ['#BFDBF7','#022B3A'],
                borderWidth: 1,
              },
            ],
          }}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
        />
      </div>

      <div className="bg-white p-3 rounded-lg shadow-md w-screen md:w-1/4">
      <h3 className='text-xl'><strong>Latest Bills</strong></h3>
          <table className=' mt-3 w-full'>
          <thead>
              <tr>
                <th className='w-1/2'>Bill No</th>
                <th className='w-1/2'>Total</th>
              </tr>
              </thead>
              <tbody>
            {
              bills?.map((item)=>{
                  return(
                    <tr>
                      <td className='text-center'>{item.billno}</td>
                      <td className='text-center'>₹{item.total}</td>
                    </tr>
                  )
              })
            }
            </tbody>
          </table>
      </div>
    </div>
  );
};

export default ProfitChart;
