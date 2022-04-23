//This is the homepage app to display the homepage
//Below are needed extensions
import React from 'react'
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

function Home() {
    let navigate = useNavigate()
    const [loginStatus, setLoginStatus] = useState("")
    const [currentUser, setUser] = useState("")
    /*
      implement code to retrieve some products to populate the home page and display featured products
    */

    //Upon loading the page, a get request is sent to set to see if there is currently a user session, i.e. checking for log in status.
    //go to server/routes/Users.js and locate router.get('/login', ...etc) to follow flow of data
    useEffect(() => {
      //sending a get request to this url
      axios.get("https://full-stack-api-shop.herokuapp.com/auth/login", {headers: {'Access-Control-Allow-Origin': 'https://ec2-3-91-190-197.compute-1.amazonaws.com'}}).then((response) => {
        //using the response to set both the login status, and user object
        //currently, currentUser is used for nothing
        //loginStatus is used to modify the navbar if user is logged in
        setLoginStatus(response.data.loggedIn)
        setUser(response.data.user)
        
      })
    }, [])
    return (
        <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Home</title>
        <link rel="stylesheet" href="style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
        <section id="header">
          <a href="/#"><img src={require('../img/logo.png')} className="logo" alt="" width="300px" height="auto" /></a>
          <div>
            <ul id="navbar">
              <li><a className="active" href="/home">Home</a></li>
              <li><a href="/products" onClick={() => {navigate("/products")}}>Products</a></li>
              <li><a href="/about">About Us</a></li>
              {/*This checks login status and alters the nav bar based on result*/}
              {!loginStatus ? 
                (<li><a href="/login">Login</a></li>)
                : 
                (<li><a href="/userdashboard">Dashboard</a></li>)
              }
              <li><a href="/cart"><i className="fa-solid fa-bag-shopping" /></a></li>
            </ul>
          </div>
        </section>
        <section id="banner">
          <h4>Trade-in-offer</h4>
          <h2>Super value deals</h2>
          <h1>On all products</h1>
          <p>Save more with coupons &amp; up to 70% off!</p>
          <button>Shop now</button>
        </section>
        <section id="feature" className="section-p1">
          <div className="fe-box">
            <img src={require('./img/features/f1.png')} alt="" />
            <h6>Free Shipping</h6>
          </div>
          <div className="fe-box">
            <img src={require('./img/features/f2.png')} alt="" />
            <h6>Online Order</h6>
          </div>
          <div className="fe-box">
            <img src={require('./img/features/f3.png')} alt="" />
            <h6>Save Money</h6>
          </div>
          <div className="fe-box">
            <img src={require('./img/features/f4.png')} alt="" />
            <h6>Promotions</h6>
          </div>
          <div className="fe-box">
            <img src={require('./img/features/f5.png')} alt="" />
            <h6>Happy Sell</h6>
          </div>
          <div className="fe-box">
            <img src={require('./img/features/f6.png')} alt="" />
            <h6>24/7 Support</h6>
          </div>
        </section>
        
        <section id="banner2" className="section-m1">
          <h4>Deals</h4>
          <h2>Up to <span>70% off </span> - All t-shirts &amp; Accessoories</h2>
          <button className="normal">Explore More</button>
        </section>
        
        <section id="sm-banner" className="section-p1">
          <div className="banner-box">
            <h4>crazy deals</h4>
            <h2>buy 1 get 1 free</h2>
            <span>The best classic dree is on sale at shopaholic</span>
            <button className="white">Learn More</button>
          </div>
          <div className="banner-box banner-box2">
            <h4>spring/summer</h4>
            <h2>upcomming season</h2>
            <span>The best classic dree is on sale at shopaholic</span>
            <button className="white">Collection</button>
          </div>
        </section>
        <section id="banner3">
          <div className="banner-box">
            <h2>SEASONAL SALE</h2>
            <h3>Winter Collection 50% Off</h3>
          </div>
          <div className="banner-box banner-box2">
            <h2>NEW FOOTWEAR COLLECTION</h2>
            <h3>Spring/Summer 2022</h3>
          </div>
          <div className="banner-box banner-box3">
            <h2>T-SHIRTS</h2>
            <h3>New Trendy Prints</h3>
          </div>
        </section>
        <footer className="section-p1">
          <div className="col">
            <img className="logo" src={require('./img/logo.png')} alt="" width="300px" height="auto" />
            <h4>Contact</h4>
            <p><strong>Address: </strong> 1 UTSA circle blvd, San Antonio TX</p>
            <p><strong>Phone: </strong> +1 210 123 4567</p>
            <div className="follow">
              <h4>Follow Us</h4>
              <div className="icon">
                <i className="fab fa-facebook-f" />
                <i className="fab fa-twitter" />
                <i className="fab fa-instagram" />
              </div>
            </div>
          </div>
          <div className="col">
            <h4>About</h4>
            <a href="/about">About Us</a>
            <a href="/#">Privacy Policy</a>
            <a href="/#">Terms &amp; Conditions</a>
            <a href="/#">Contact Us</a>
          </div>
          <div className="col">
            <h4>My Account</h4>
            {!loginStatus ? 
                (<a href="/login">Sign in</a>)
                : 
                (<a href="/userdashboard">Dashboard</a>)
            }
            <a href="/cart">View Cart</a>
            <a href="/#">Track My Order</a>
            <a href="/#">Help</a>
          </div>
          <div className="col install">
            <h4>Install App</h4>
            <p>From App Store or Google Play</p>
            <div className="row">
              <img src={require('./img/pay/app.jpg')} alt="" />
              <img src={require('./img/pay/play.jpg')} alt="" />
            </div>
            <p>Secured Payment Gateways</p>
            <img src={require('./img/pay/pay.png')} alt="" />
          </div>
          <div className="copyright">
            <p>© 2022 Shopaholic, Inc.</p>
          </div>
        </footer>
      </div>
    )

}

export default Home