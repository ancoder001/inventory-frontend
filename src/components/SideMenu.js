import React from "react";
import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { AiOutlineClose } from "react-icons/ai";
import { Home as HomeIcon, Inventory as InventoryIcon, Receipt as ReceiptIcon, ListAlt as ListAltIcon } from "@mui/icons-material";
import { useState } from "react";
// Ensure you import the CSS

const SideMenu = ({ isOpen, toggleMenu }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className={`fixed sm:relative top-0 left-0 h-screen transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 bg-[#022B3A]`}>
      <div className="w-full text-center flex justify-around items-center text-2xl bg-[#022B3A] py-2 text-white">
        AN Solutions
        <div className="sm:hidden text-center mt-2">
        <AiOutlineClose size={24} onClick={toggleMenu} className="text-white" />
      </div>
      </div>
      
      <Sidebar collapsed={collapsed} backgroundColor="#022B3A">
        <Menu iconShape="circle" menuItemStyles={{
          button:{
            ['&:hover']:{
              backgroundColor:'#8DA9C4',
            },
          },
          subMenuContent:{
            backgroundColor:'#022B3A',
          }
        }}>
        <Link to="/dashboard">
          <MenuItem icon={<HomeIcon />} onClick={toggleMenu} className="text-white">
            Dashboard
          </MenuItem>
          </Link>
          <Link to="/inventory">
          <MenuItem icon={<InventoryIcon />} onClick={toggleMenu} className="text-white">
            Inventory
          </MenuItem>
          </Link>
          <SubMenu title="Billing" label="Billing" icon={<ReceiptIcon />} className="text-white">
          <Link to="/bill">
          <MenuItem icon={<ListAltIcon />} onClick={toggleMenu} className="text-white">
              New bill
            </MenuItem>
            </Link>
            <Link to="/bills">
            <MenuItem icon={<ListAltIcon />} onClick={toggleMenu} className="text-white">
              View Bills
            </MenuItem>
            </Link>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default SideMenu;
