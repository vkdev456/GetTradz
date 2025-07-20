import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.js';
import Homepage from './landing_page/home/HomePage';
import Signup from './landing_page/signup/Signup.js';
import About from './landing_page/about/AboutPage';
import Pricing from './landing_page/pricing/Pricingpage';
import Product from './landing_page/products/ProductPage';
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
      <Route path="/about" element={<About/>}     />
      <Route path="/pricing" element={<Pricing/>} />
      <Route path="/product" element={<Product/>} />
      <Route path="/support" element={<Support/>} />
      <Route path="/*" element={<NotFound/>}      />
    </Routes>
    <Footer/>
  </BrowserRouter>
);
