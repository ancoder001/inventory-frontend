import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from 'axios';
import ProfitChart from '../components/ProfitChart';

const Home = () => {
  const [totProd, setTotprod] = useState(0);
  const [totinvested, setTotinvested] = useState(0);
  const [totearning, setEarning] = useState(0);
  const [totprofit, setTotprofit] = useState(0);

  const getdata = () => {
    axios.get('http://localhost:5600/inventory/data')
      .then((response) => {
        const products = response.data;
        const totalProducts = products.reduce((acc, item) => acc + item.quantity, 0);
        const totalInvested = products.reduce((acc, item) => acc + item.costprice * item.quantity, 0);
        const totalEarnings = products.reduce((acc, item) => acc + item.sellingprice * item.quantity, 0);
        const totalProfit = totalEarnings - totalInvested;

        setTotprod(totalProducts);
        setTotinvested(totalInvested);
        setEarning(totalEarnings);
        setTotprofit(totalProfit);
      })
      .catch((e) => { console.log(e) });
  }

  useEffect(() => {
    getdata();
  }, []);

  return (
    <div className="p-6">
      <Header title="Dashboard" />
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-[#1F7A8C] text-white flex flex-col gap-6 p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-bold">Total Products</h2>
          <p className="text-2xl md:text-4xl">{totProd}</p>
        </div>
        <div className="bg-[#BFDBF7] text-black flex flex-col gap-6 p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-bold">Total Invested</h2>
          <p className="text-2xl md:text-4xl">₹{totinvested}</p>
        </div>
        <div className="bg-[#E1E5F2] text-black flex flex-col gap-6 p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-bold">Total Earnings</h2>
          <p className="text-2xl md:text-4xl">₹{totearning}</p>
        </div>
        <div className="bg-[#EEF4ED] text-black flex flex-col gap-6 p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-bold">Total Profit</h2>
          <p className="text-2xl md:text-4xl">₹{totprofit}</p>
        </div>
        <div className="bg-[#FFFFFF] p-4 shadow-md rounded-lg">
          <h2 className="text-xl font-bold">Profit Percentage</h2>
          <p className="text-2xl md:text-3xl">{totinvested !== 0 ? ((totprofit / totinvested) * 100).toFixed(2) : 0}%</p>
        </div>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Analysis Charts</h2>
        {/* Add your charts here */}
        <ProfitChart />
      </div>
    </div>
  );
};

export default Home;
