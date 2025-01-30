import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlinePlus } from 'react-icons/ai';
import { MdCategory } from 'react-icons/md';

const Inventory = () => {
  const [open, setOpen] = useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [updatedata, setUpdatedata] = useState();
  const [up, setUp] = useState(false);
  const [lastupdate, setLastupdate] = useState('');

  // Additional useState hooks for form fields
  const [itemname, setItemname] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [cp, setCp] = useState(0);
  const [sp, setSp] = useState(0);
  const [id, setId] = useState();
  const [newCategory, setNewCategory] = useState('');
  const URL = "https://inventory-backend-igds.onrender.com"
  //http://localhost:5600/inventory/data
  const getdata = () => {
    axios.get(`${URL}/inventory/data`)
      .then(response => {
        setInventory(response.data);
      })
      .catch((e) => { console.log(e) });
    axios.get(`${URL}/inventory/category`)
      .then(response => {
        setCategories(response.data);
      })
      .catch((e) => { console.log(e) });
    axios.get(`${URL}/api/last-updated`)
      .then((res) => {
        const updates = convertGMTtoIST(res.data.lastUpdated);
        setLastupdate(updates);
      })
      .catch((e) => { console.log(e) });
  };

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleOpen = (e) => {
    setOpen(!open);
    setUp(false);
    setItemname("");
    setCategory("");
    setQuantity(0);
    setCp(0);
    setSp(0);
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setUp(false);
    setOpen(!open);
    const prevdata = inventory.filter((it) => (it.name === itemname));
    if (prevdata.length > 0) {
      toast.error("Item already exists");
      return;
    }
    const data = { name: itemname, category: category, quantity: quantity, costprice: cp, sellingprice: sp };
    axios.post(`${URL}/inventory/add`, data)
      .then((res) => {
        if (res.status === 201) {
          getdata();
          toast.success("Item added successfully");
        }
      });
  };

  const handleDelete = (id) => {
    axios.delete(`${URL}/inventory/delete/${id}`)
      .then((res) => {
        if (res.status === 200) {
          getdata();
          toast.success("Item deleted successfully");
        }
      });
  };

  const getupdatedata = (id) => {
    axios.get(`${URL}/inventory/find/${id}`)
      .then((res) => {
        setUpdatedata(res.data);
      });
  };

  const handleUpdate = (id) => {
    getupdatedata(id);
    setUp(true);
    setItemname(updatedata?.name);
    setCategory(updatedata?.category);
    setQuantity(updatedata?.quantity);
    setCp(updatedata?.costprice);
    setSp(updatedata?.sellingprice);
    setId(id);
    setOpen(!open);
  };

  const handleUp = (e) => {
    e.preventDefault();
    const data = { name: itemname, category: category, quantity: quantity, costprice: cp, sellingprice: sp };
    axios.put(`${URL}/inventory/update/${id}`, data)
      .then((res) => {
        if (res.status === 200) {
          getdata();
          toast.success("Updated successfully");
          setOpen(!open);
          setItemname("");
          setCategory("");
          setQuantity(0);
          setCp(0);
          setSp(0);
          setUp(false);
        }
      });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    axios.post(`${URL}/inventory/addcategory`, { category: newCategory })
      .then((res) => {
        if (res.status === 201) {
          getdata();
          toast.success("Category added successfully");
          setOpenCategoryDialog(false);
          setNewCategory('');
        }
      });
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const convertGMTtoIST = (gmtDate) => {
    const date = new Date(gmtDate);
    const options = { timeZone: "Asia/Kolkata", year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    return date.toLocaleString('en-IN', options);
  };

  useEffect(() => {
    getdata();
  }, []);

  return (
    <div className="p-6">
      <Header title="Inventory" />
      <ToastContainer />
      <div className="md:relative h-20 mb-6">
        <div className='p-2 md:absolute relative text-center md:right-0 font-sans italic rounded w-fit' style={{ backgroundColor: '#f4c542' }}>Last updated: {lastupdate}</div>
      </div>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={handleSearch}
          className="border p-2 flex-grow"
          style={{ borderColor: '#f07c41' }}
        />
        <button onClick={handleOpen} className="ml-4 p-2 rounded-md flex justify-center items-center gap-1 bg-[#349d75] "><AiOutlinePlus />Add Item</button>

        <button onClick={() => setOpenCategoryDialog(true)} className="ml-4 p-2 rounded flex justify-center items-center gap-1" style={{ backgroundColor: '#1e3a8a', color: '#fff' }}><MdCategory />Add Category</button>
      </div>
      <div className="shadow-md rounded-lg p-4 bg-white">
        <table className="min-w-full rounded-md">
          <thead>
            <tr className="bg-[#1f2937] rounded-md text-[#e5e7eb]" >
              <th className="py-2">Serial No</th>
              <th className="py-2">Product Name</th>
              <th className="py-2">Category</th>
              <th className="py-2">Quantity</th>
              <th className="py-2">Cost Price</th>
              <th className="py-2">Selling Price</th>
              <th className="py-2">Total Invested</th>
              <th className="py-2">Total Profit</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item, index) => (
              <tr key={item._id} className='bg-[#e5e7eb] text-[#1f2937] hover:bg-[#cbd5e1]'>
                <td className="py-2 text-center">{index + 1}</td>
                <td className="py-2 text-center">{item.name}</td>
                <td className="py-2 text-center">{item.category}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-center">₹{item.costprice}</td>
                <td className="py-2 text-center">₹{item.sellingprice}</td>
                <td className="py-2 text-center">₹{item.costprice * item.quantity}</td>
                <td className="py-2 text-center">₹{(item.sellingprice * item.quantity) - (item.costprice * item.quantity)}</td>
                <td className="py-2 text-center">
                  <button className="p-2 rounded bg-yellow-500 text-white" onClick={() => { handleUpdate(item._id) }}>Update</button>
                  <button className="p-2 rounded ml-2 bg-red-500 text-white" onClick={() => { handleDelete(item._id) }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={open} onClose={handleOpen}>
        <div className='flex'>
          <DialogTitle>{up ? "Update Item" : "Add Item"}</DialogTitle>
          <Button onClick={handleOpen}>Close</Button>
        </div>
        <DialogContent>
          <form className='flex flex-col gap-3'>
            <Autocomplete
              freeSolo
              options={inventory.map(item => item.name)}
              value={itemname}
              onChange={(event, value) => {
                setItemname(value || '');
                const selectedItem = inventory.find(item => item.name === value);
                if (selectedItem) {
                  setCp(selectedItem.costprice);
                  setSp(selectedItem.sellingprice);
                } else {
                  setCp(0);
                  setSp(0);
                }
              }}
              onInputChange={(event, value) => {
                setItemname(value);
                if (!inventory.some(item => item.name === value)) {
                  setCp(0);
                  setSp(0);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Item Name" variant="outlined" />
              )}
            />
            <select value={category} onChange={(e) => { setCategory(e.target.value) }} className='border-2 rounded-sm' style={{ borderColor: '#f07c41' }}>
              <option value="">Select Category</option>
              {categories.map((item, index) => (
                <option value={item.category} key={index}>{item.category}</option>
              ))}
            </select>
            <TextField type='number' label="Quantity" variant="outlined" value={quantity} onChange={(e) => { setQuantity(e.target.value) }} />
            <TextField type='number' label="Cost Price" variant="outlined" value={cp} onChange={(e) => { setCp(e.target.value) }} />
            <TextField type='number' label="Selling Price" variant="outlined" value={sp} onChange={(e) => { setSp(e.target.value) }} />
            {!up ? <Button variant="contained" style={{ backgroundColor: '#f07c41', color: '#fff' }} onClick={(e) => { handleAdd(e) }}>Add</Button> :
              <Button variant="contained" style={{ backgroundColor: '#f07c41', color: '#fff' }} onClick={(e) => { handleUp(e) }}>Update</Button>}
          </form>
        </DialogContent>
      </Dialog>
      <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <form className='flex flex-col gap-3'>
            <TextField
              type="text"
              label="Category Name"
              variant="outlined"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCategoryDialog(false)}>Cancel</Button>
          <Button variant="contained" style={{ backgroundColor: '#f07c41', color: '#fff' }} onClick={(e) => handleAddCategory(e)}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inventory;
