
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import Home from "./pages/Home"
import Products from "./pages/Products"
import Product from "./pages/Product"
import About from "./pages/About"
import Login from "./pages/Login"
import Register from "./pages/Register"
import UserDashboard from "./pages/UserDashboard"
import Cart from "./pages/Cart"
import Admin from "./pages/Admin"
import AdminProducts from "./pages/AdminProducts"
import AdminCoupons from "./pages/AdminCoupons"
import AdminOrders from "./pages/AdminOrders"
import AdminCustomers from "./pages/AdminCustomers"
import Modify from "./pages/Modify"

import axios from 'axios';
import '@fortawesome/fontawesome-svg-core/styles.css'


function App() {
  axios.defaults.withCredentials = true;
  const [currentUser, setUser] = useState("")
  const [loginStatus, setLoginStatus] = useState("")

  //This is creating a type error currently if you are not signed in becuase it is trying to read data that isnt there, I will fix this soon
  useEffect(() => {
    //sending a get request to this url
    axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login", {headers: {
      'Access-Control-Allow-Origin': 'https://ec2-3-91-190-197.compute-1.amazonaws.com',
      'Content-Type': 'application/json',
    }}).then((response) => {
          setLoginStatus(response.data.loggedIn)
          if(response.data.loggedIn){
            setUser(response.data.user.email)
          }
        
        
    })
  }, [])
  console.log(loginStatus)
  console.log(currentUser)
  var isAdmin = false
  

  return (
    <div className="App">
      {/*any reference, such as /home, will use the router to redirect the user to other pages*/}
        <Router>
          <Routes>
            <Route path="/" exact element={<Home />}/>
            <Route path="/home" exact element={<Home />}/>
            <Route path="/products" exact element={<Products />}/>
            <Route path="/product/:id" exact element={<Product />}/>
            <Route path="/about" exact element={<About />}/>
            <Route path="/login" exact element={<Login />}/>
            <Route path="/register" exact element={<Register />}/>
            <Route exact path="/userdashboard" element={loginStatus ? <UserDashboard/> : <Home/>}/>
            <Route path="/admin" exact element={<Admin />}></Route>
            <Route path="/adminproducts" exact element={<AdminProducts />}></Route>
            <Route path="/admincoupons" exact element={<AdminCoupons />}></Route>
            <Route path="/adminorders" exact element={<AdminOrders />}></Route>
            <Route path="/admincustomers" exact element={<AdminCustomers />}></Route>
            <Route path="/modify/:id" exact element={<Modify />}/>
            <Route path="/cart" exact element={<Cart />}/>
          </Routes>
        </Router>
    </div>
  );
}


export default App;
