import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Bill from '../components/Bill';

const BillView = () => {
  const [bills, setBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const URL = "https://inventory-backend-igds.onrender.com"
  //http://localhost:5600/bill/get
  useEffect(() => {
    axios.get(`${URL}/bill/get`)
      .then((response) => {
        setBills(response.data);
      })
      .catch((error) => {
        console.error('Error fetching bills:', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredBills = bills.filter(bill =>
    bill.billno.toString().includes(searchQuery) ||
    bill.customername.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Bills</h1>
      <div className="mb-6">
        <input
          type="search"
          placeholder="Search by Bill Number or Customer Name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full md:w-1/2 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {filteredBills.length === 0 ? (
        <p>No bills available.</p>
      ) : (
        filteredBills.map((bill) => (
          <Bill
            key={bill.billno}
            customerName={bill.customername}
            mobile={bill.mobile}
            billNo={bill.billno}
            particulars={bill.particulars}
            total={bill.total}
          />
        ))
      )}
    </div>
  );
};

export default BillView;
