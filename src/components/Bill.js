import React, { useState } from 'react';
import { IoIosArrowDropupCircle, IoIosArrowDropdownCircle } from "react-icons/io";

const Bill = (props) => {
  const [expand, setExpand] = useState(false);

  return (
    <div className="bg-white relative flex p-4 shadow-md rounded-lg mb-4 cursor-pointer" onClick={() => setExpand(!expand)}>
      <div>
        <h2 className="text-xl font-bold mb-2">Bill No: {props.billNo}</h2>
        <p className="text-lg"><strong>Customer Name:</strong> {props.customerName}</p>
        <p className="text-lg"><strong>Mobile:</strong> {props.mobile}</p>
        <p className="text-lg font-bold mt-4">Total: ₹{props.total}</p>
        {expand && (
          <div className="mt-4 w-full" >
            <p className="text-2xl font-semibold mb-4 text-center">Particulars:</p>
            <table className=" border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 px-4 py-2">S.No</th>
                  <th className="border border-gray-300 px-4 py-2">Item</th>
                  <th className="border border-gray-300 px-4 py-2">Quantity</th>
                  <th className="border border-gray-300 px-4 py-2">Price</th>
                </tr>
              </thead>
              <tbody>
                {props.particulars?.map((item, index) => (
                  <tr key={index} className="even:bg-gray-100">
                    <td className="border border-gray-300 px-4 py-2 text-center">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center">{item.quantity}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="absolute right-8 top-5">
        <button className="p-1" onClick={() => setExpand(!expand)}>
          {expand ? <IoIosArrowDropupCircle className="h-7 w-7" /> : <IoIosArrowDropdownCircle className="h-7 w-7" />}
        </button>
      </div>
    </div>
  );
};

export default Bill;
