//This is the About app to display the About page
//Below are needed extensions
//import '../App.css';
import axios from "axios";
import { useEffect, useState } from "react";

function About() {
  const [loginStatus, setLoginStatus] = useState("")
  //const [currentUser, setUser] = useState("")

  //Upon loading the page, a get request is sent to set to see if there is currently a user session, i.e. checking for log in status.
  //go to server/routes/Users.js and locate router.get('/login', ...etc) to follow flow of data
  useEffect(() => {
    //sending a get request to this url
    axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login").then((response) => {
      //using the response to set both the login status, and user object
      //currently, currentUser is used for nothing
      //loginStatus is used to modify the navbar if user is logged in
      setLoginStatus(response.data.loggedIn)
      //setUser(response.data.user)
    })
  }, [])

  return (
    <div>
  <meta charSet="UTF-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>About Us</title>
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
  <section id="header">
    <a href="/#"><img src={require('./img/logo.png')} className="logo" alt="" width="300px" height="auto" /></a>
    <div>
      <ul id="navbar">
        <li><a href="/#"><i className="fa-solid fa-magnifying-glass" /></a></li>
        <li><a href="/home">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a className="active" href="about.html">About Us</a></li>
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
  <section id="about-header">
    <h2>Get To Know Us</h2>
    <p>Everything about SHOPAHOLIC</p>
  </section>
  <section id="about-head" className="section-p1">
    <img src={require('./img/about/a6.jpg')} alt="" />
    <div>
      <h2>Who We Are?</h2>
      <p>If you would like to experience the best of online shopping, you are at the right place. Shopaholic is the ultimate destination for fashion and lifestyle, being host to a wide array of merchandise including clothing, footwear, accessories,
        jewellery, personal care products and more. It is time to redefine your style statement with our treasure-trove of trendy items. Our online store brings you the latest in designer products straight out of fashion houses. You can shop online
        at Shopaholic from the comfort of your home and get your favourites delivered right to your doorstep.
      </p>
      <abbr title>Another reason why Shopaholic is the best of all online stores is the complete convenience that it offers. 
        A user-friendly interface will guide you through your selection process.</abbr>
    </div>
  </section>
  <section id="about-app" className="section-p1">
    <h1>Download Our App</h1>
    <h4>(Coming Soon)</h4>
    <div className="video">
      <video autoPlay muted loop src={require('./img/about/1.mp4')} />
    </div>
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
  );
}

export default About;
