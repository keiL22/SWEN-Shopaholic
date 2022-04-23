//This is the Product app to display a Product
//Below are needed extensions
//import '../App.css';
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Product() {
    //Using the param passed in the navigate('/product/${value.id}') command used when clicking a product on the Products.js page
    let { id } = useParams();
    const [prodObject, setProductObject] = useState([]);
    const [loginStatus, setLoginStatus] = useState("")
    const [currentUser, setUser] = useState("")
    let navigate = useNavigate()
    //Upon loading the page, two get requests are made. The first is made to load the product by id number
    //The second is made to check the login status of the user.
    useEffect( () => {
        //get request with id variable, go to server/routes/Products.js to follow flow of information
        axios.get(`https://ec2-3-91-190-197.compute-1.amazonaws.com/products/byId/${id}`).then((response) => {
            //setting response.data(Product loaded by id) to prodObject
            setProductObject(response.data)
            //this is just to see the response of the server for testing purposes. Use inspect on the webpage in your browser to read console log
            console.log(response)
        })
        //checking and setting login status. go to server/routes/Users.js to follow flow of information
        axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login").then((response) => {
          setLoginStatus(response.data.loggedIn)
          setUser(response.data.user.id)
        })

    }, []);
    function addToCart(data){
      if(!loginStatus){
        navigate("/login")
      } else {
        axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/addToCart", data).then((response) => {
          if(response.data == "Success"){
            alert("added to cart")
          }
        })
      }
    }
    return (
        <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>single_product</title>
        <link rel="stylesheet" href="style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
        <section id="header">
          <a href="/#"><img src={require('./img/logo.png')} className="logo" alt="" width="300px" height="auto" /></a>
          <div>
            <ul id="navbar">
              <li><a href="/home">Home</a></li>
              <li><a href="/products" className="active" onClick={() => {navigate("/products")}}>Products</a></li>
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
        {prodObject.map(data =>
        <section id="details" className="section-p1">
          <div className="single-img">
            <img src={require(process.env.PUBLIC_URL + `${data.productImg}`)} alt="" width="100%" id="main-img" />
          </div>
          <div className="s-details">
            <h6>Home / T-shirt</h6>
            <h4>{data.title}</h4>
            <h2>${data.productPrice}</h2>
            <button className="normal" onClick={() => {addToCart({userId: currentUser, productId: id})}}>Add To Cart</button>
            <h4>Product Details</h4>
            <span>{data.productDesc}</span>
          </div>
        </section>
        )}
        <section id="product1" className="section-p1">
          <h2>Featured Products</h2>
          <p>Summer Collection New Modern Design</p>
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

export default Product;