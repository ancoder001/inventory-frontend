import React from 'react'
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

const cat=["stationary","art","note"]

const AddItem = ({isopen}) => {
  return (
    <div>
      <Dialog open={isopen}>
        <DialogTitle>Add Item</DialogTitle>
        <button onClick={!isopen}>close</button>
        <DialogContent>
            <form>
                <input type="text" placeholder='Item Name' />
                <select>
                    <option value="">Select Category</option>
                    {cat.map((item, index) => (
                        <option value={item} key={index}>{item}</option>
                        ))}
                </select>
                <input type='number' placeholder='Quantity' />
                <input type='number' placeholder='Cost Price' />
                <input type='number' placeholder='Selling Price' />
            </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddItem
