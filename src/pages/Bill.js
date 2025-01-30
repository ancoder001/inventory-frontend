import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Autocomplete } from '@mui/material';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Bill = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [customer, setCustomer] = useState({ name: '', mobile: '' });
  const [billItems, setBillItems] = useState([]);
  const [billNo,setBillNo] = useState(Math.floor(Math.random() * 100000));
  const [currentTime, setCurrentTime] = useState(new Date());
  const [checkedItems, setCheckedItems] = useState({});
  const [itemname, setItemname] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [cp, setCp] = useState(0);
  const [price, setPrice] = useState('');

  const getdata = () => {
    axios.get("http://localhost:5600/inventory/data")
      .then((res) => {
        setData(res.data);
      });
  };

  useEffect(() => {
    getdata();
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every minute
    return () => clearInterval(timer); // Cleanup interval on component unmount
  }, []);

  const addBillItem = () => {
    if (selectedItem && quantity > selectedItem.quantity) {
      toast.error(`Available quantity for ${selectedItem.name} is only ${selectedItem.quantity}`);
      return;
    }
    setOpen(!open);
    setBillItems([...billItems, { name: itemname, quantity: quantity, cp: cp, price: price }]);
  };

  const totalAmount = billItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const resetForm = () => {
    setCustomer({ name: '', mobile: '' });
    setBillItems([]);
    setBillNo(Math.floor(Math.random() * 100000));
    setCheckedItems({});
    setItemname("");
    setSelectedItem(null);
    setQuantity('');
    setCp(0);
    setPrice('');
    setBillItems([]);
  };

  const Proceed = () => {
    const newdata = {
      customername: customer.name,
      mobile: customer.mobile,
      billno: billNo,
      particulars: billItems,
      total: totalAmount
    };
    axios.post("http://localhost:5600/bill/create", newdata)
      .then((res) => {
        if (res.status === 201) {
          toast.success("Bill created successfully");
          resetForm();
        }
      });
  };

  const handleOpen = () => {
    setOpen(!open);
    setSelectedItem(null);
    setQuantity('');
    setPrice('');
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const handleCheckboxChange = (index) => {
    setCheckedItems({ ...checkedItems, [index]: !checkedItems[index] });
  };

  const deleteCheckedItems = () => {
    setBillItems(billItems.filter((_, index) => !checkedItems[index]));
    setCheckedItems({});
  };

  const handleItemChange = (event, value) => {
    setSelectedItem(value);
    if (value) {
      setItemname(value.name);
      setPrice(value.sellingprice);
      setCp(value.costprice);
    } else {
      setPrice('');
      setCp(0);
    }
  };

  const filterOptions = (options, state) => {
    return options.slice(0, 3);
  };

  const isDeleteButtonDisabled = !Object.values(checkedItems).some((isChecked) => isChecked);

  return (
    <div className="p-6">
      <ToastContainer />
      <Header title="Billing" />
      <div id="bill-content" className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-xl font-bold mb-4">Billing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Customer Name</label>
            <input
              type="text"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              className="border p-2 w-full"
              placeholder="Customer Name"
            />
          </div>
          <div>
            <label className="block mb-2">Mobile Number</label>
            <input
              type="text"
              value={customer.mobile}
              onChange={(e) => setCustomer({ ...customer, mobile: e.target.value })}
              className="border p-2 w-full"
              placeholder="Mobile Number"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div>
            <label className="block mb-2">Bill No</label>
            <input
              type="text"
              value={billNo}
              readOnly
              className="border p-2 w-full"
            />
          </div>
          <div>
            <label className="block mb-2">Date & Time</label>
            <input
              type="text"
              value={`${currentTime.toLocaleDateString()} ${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`}
              readOnly
              className="border p-2 w-full"
            />
          </div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-xl font-bold mb-4">Billing Items</h2>
        <div className="flex space-x-4 mb-4">
          <button onClick={handleOpen} className="bg-blue-500 text-white p-2 rounded">
            Add Item
          </button>
          <button onClick={deleteCheckedItems} className={`bg-red-500 text-white p-2 rounded ${isDeleteButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isDeleteButtonDisabled}>
            Delete Item
          </button>
        </div>
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2"></th>
              <th className="py-2">Serial No</th>
              <th className="py-2">Product Name</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Price per Item</th>
              <th className="py-2">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index}>
                <td className="py-2 text-center">
                  <input
                    type="checkbox"
                    checked={checkedItems[index] || false}
                    onChange={() => handleCheckboxChange(index)}
                  />
                </td>
                <td className="py-2 text-center">{index + 1}</td>
                <td className="py-2 text-center">{item.name}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-center">₹{item.price}</td>
                <td className="py-2 text-center">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-4 text-right">
          <strong>Total Amount: ₹{totalAmount}</strong>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={Proceed} className="bg-green-500 text-white p-2 rounded mr-4">
            Proceed
          </button>
        </div>
      </div>

      <Dialog open={open} onClose={handleOpen}>
        <DialogTitle>Add Item</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={data}
            getOptionLabel={(option) => option.name}
            filterOptions={filterOptions}
            onChange={handleItemChange}
            renderInput={(params) => <TextField {...params} label="Item Name" variant="outlined" />}
          />
          <TextField
            label="Quantity"
            variant="outlined"
            fullWidth
            margin="normal"
            value={quantity}
            onChange={handleQuantityChange}
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            margin="normal"
            value={price}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen} color="primary">
            Cancel
          </Button>
          <Button onClick={addBillItem} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Bill;
