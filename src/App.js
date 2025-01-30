import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AiOutlineMenu } from "react-icons/ai";
import Home from "./pages/Home";
import Inventory from "./pages/Inventory";
import Bill from "./pages/Bill";
import SideMenu from "./components/SideMenu";
import BillView from "./pages/BillView";

function App() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex h-screen bg-[#EEF4ED]">
        <div className={`sm:hidden fixed top-0 left-0 p-4 z-50 ${sideMenuOpen ? "hidden" : "block"}`}>
          <AiOutlineMenu className="text-white" size={24} onClick={() => setSideMenuOpen(true)} />
        </div>
        <SideMenu isOpen={sideMenuOpen} toggleMenu={() => setSideMenuOpen(!sideMenuOpen)} />
        <div className="flex-grow overflow-y-scroll">
          <div className="sm:hidden flex justify-center p-4 bg-[#134074]">
            <div className="text-2xl text-white">AN Solutions</div>
          </div>
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/bill" element={<Bill />} />
            <Route path="/bills" element={<BillView />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
