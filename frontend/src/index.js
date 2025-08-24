import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Homepage from './landing_page/home/HomePage';
import Signup from './landing_page/signup/Signup.js';
import Support from './landing_page/support/Supportpage';
import Navbar from './landing_page/Navbar';
import Footer from './landing_page/Footer';
import NotFound from './landing_page/NotFound';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
   <Navbar/>
    <Routes>
      <Route path="/" element={<Homepage/>}       />
      <Route path="/signup" element={<Signup/>}   />
      <Route path="/support" element={<Support/>} />
      <Route path="/*" element={<NotFound/>}      />
    </Routes>
    <Footer/>
  </BrowserRouter>
);


