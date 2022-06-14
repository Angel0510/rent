import React ,{Fragment}from "react";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  } from "react-router-dom";


import Loader from "./global/Loader";
import Login from "./Login";
import Home from "./home/Home";
import Dashboard from "./home/Dashboard";
import Users from "./home/users/Users";
import Products from "./home/products/Products";
import Customers from "./home/customers/Customers";
import Poll from "./home/forms/Poll";


function App() {


  Loader.on();


  return (
    <div className="wrapper">

    <Fragment>

      <Router>
    
        <Routes>

          <Route path="/" element={<Login/>}/>

          <Route path="/home" element={<Home main={<Dashboard/>}/>}/>
          
          <Route path="/users" element={<Home main={<Users/>}/>}/>

          <Route path="/products" element={<Home main={<Products/>}/>}/>

          <Route path="/customers" element={<Home main={<Customers/>}/>}/>

          <Route path="/poll" element={<Home main={<Poll/>}/>}/>
        
        </Routes>

      </Router>

      
      
    </Fragment>
  </div>
  );
}

export default App;

