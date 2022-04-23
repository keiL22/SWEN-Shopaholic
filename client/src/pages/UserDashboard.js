//Current userdashboard just includes logout button. Will contain account settings, current and maybe previous orders.
import { React, useEffect, useState } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"

function UserDashboard() {
    let navigate = useNavigate()
    const [currentUser, setUser] = useState("")
    const [loginStatus, setLoginStatus] = useState("")
    function loggout() {
        //Sends a get request to the url and uses the response to redirect to the homepage.
        //go to server/routes/Users.js and locate router.get('/logout', ...etc) to see how it works
        axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/logout").then((response) => {
            console.log(response)
            if(response.data == "logout") {
                navigate("/home")
                window.location.reload(false);
            }
        })
    }
    
    useEffect(async () => {
        //sending a get request to this url
        
        axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login").then((response) => {
          
            if(response.data.loggedIn == false) {
                navigate('/home')
                window.location.reload(false);
                
            }
        })
      }, [])
      
  return (
    <div>
        <div>User Dashboard</div>
        <div>the ultimate user experience</div>
        <div></div>
        <div>
            <div className="field btn">
            <div className="btn-layer"></div>
            {/*When clicked calls the loggout function*/}
            <input type="submit" value="Sign Out" onClick={() => {loggout();}} />
            </div>
        </div>
        <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="css/style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
        <title>User Dashboard</title>
        <section id="header">
          <a href="#"><img src="img/logo.png" className="logo" alt="" width="300px" height="auto" /></a>
          <div>
            <ul id="navbar">
              <li><a href="#"><i className="fa-solid fa-magnifying-glass" /></a></li>
              <li><a href="/home">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/login">Login</a></li>
              <li><a href="/cart"><i className="fa-solid fa-bag-shopping" /></a></li>
            </ul>
          </div>
        </section>
        <section id="dash-header">
          <h2>Profile Picture</h2>
          <p>User Dashboard</p>
        </section>
        <h2 className="dash-h2">Order History</h2>
        <section id="or-his">
          <table width="100%">
            <thead>
              <tr>
                <td>Order Number</td>
                <td>Order</td>
                <td>Total</td>
                <td>Quantity</td>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>6738</td>
                <td>Order 1</td>
                <td>$78.45</td>
                <td>1</td>
              </tr>
            </tbody>
          </table>
        </section>
        <footer className="section-p1">
          <div className="col">
            <img className="logo" src="img/logo.png" alt="" width="300px" height="auto" />
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
            <a href="#">About Us</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Terms &amp; Conditions</a>
            <a href="#">Contact Us</a>
          </div>
          <div className="col">
            <h4>My Account</h4>
            <a href="/login">Sign In</a>
            <a href="/cart">View Cart</a>
            <a href="/about">Help</a>
          </div>
          <div className="col install">
            <h4>Install App</h4>
            <p>From App Store or Google Play</p>
            <div className="row">
              <img src="img/pay/app.jpg" alt="" />
              <img src="img/pay/play.jpg" alt="" />
            </div>
            <p>Secured Payment Gateways</p>
            <img src="img/pay/pay.png" alt="" />
          </div>
          <div className="copyright">
            <p>© 2022 Shopaholic, Inc.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default UserDashboard