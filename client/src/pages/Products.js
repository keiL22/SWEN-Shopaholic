//This is the Products app to display all products
//Below are needed extensions
//import '../App.css';
import React from 'react'
import axios from "axios";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return sortableItems;
    
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};
const ProductTable = (props) => {
  const [loginStatus, setLoginStatus] = useState("")
  const [currentUser, setUser] = useState("")
  axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login").then((response) => {
        //using the response to set both the login status, and user object
        //currently, currentUser is used for nothing
        //loginStatus is used to modify the navbar if user is logged in
        setLoginStatus(response.data.loggedIn)
        if(response.data.loggedIn){
          setUser(response.data.user.id)
        }
  })
  
  let navigate = useNavigate()
  const { items, requestSort, sortConfig } = useSortableData(props.products);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      
      return;
    }
    
    return sortConfig.key === name ? sortConfig.direction : undefined;
    
  };
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
    <section id="product1" className="section-p1">
            <section id="product1" className="section-p1">
            <div className="buttons" style={{flexDirection: 'row'}}>
            <table style={{marginLeft: 'auto'}} >
      <caption>Sort By</caption>
      <thead>
        <tr>
          <th>
            <button
              type="button"
              onClick={() => requestSort('title')}
              className={getClassNamesFor('title')}
            >
              Name
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('productPrice')}
              className={getClassNamesFor('productPrice')}
            >
              Price
            </button>
          </th>
        </tr>
      </thead>
      
        </table>
    </div>
    
    <div className="pro-container" >
              {items.map((value) => { 
                return(
                  <div className="pro" >
                    <img src={require(process.env.PUBLIC_URL + `${value.productImg}`)} alt="" 
                    onClick={() => {navigate(`/product/${value.id}`)}}/>
                    <div className="des" onClick={() => {navigate(`/product/${value.id}`)}}>
                    <span>In Stock</span>
                    <h5>{value.title}</h5>
                    <div className="star">
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                      <i className="fas fa-star" />
                    </div>
                    <h4>${value.productPrice}</h4>
                    </div>
                    {!loginStatus ?
                    (<a href="/login">
                      <i className="cart fa-solid fa-cart-shopping" />
                    </a>) :
                    (<a>
                      <i className="cart fa-solid fa-cart-shopping" onClick={() => {addToCart({userId: currentUser, productId: value.id})}}/>
                    </a>)}
                  </div>
                );
              })}
              </div>
              
        </section>
          </section>
      
  );
};

function Products() {
    const [listOfProducts, setListOfProducts] = useState([]);
    const [listOutofStock, setlistOutOfStock] = useState([]);
    const [loginStatus, setLoginStatus] = useState("")
    const [currentUser, setUser] = useState("")
    let navigate = useNavigate()
    //setting initialValues for the formik
    const initialValues = {
      search: "",
  }
  //used to validate the input of the user
  const validationSchema = Yup.object().shape({
      search: Yup.string().max(255),
  })
  //used to navigate certain pages, i think this can be removed because the router has been implemeted now
  //On submit a post request is sent to that url and if the data equals logged in the page refreshes
  //and the user is sent to the home page.
  //During this post request a session and cookie are created to carry a users information from page to page
  const onSubmit = (data) => {
      console.log("hello")
      axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/products/bySearch", data).then((response) => {
        
        if(response.data.error){
          alert("item not found")
        } else {
          setListOfProducts(response.data)
        }
        
      })
      
    };
    //Getting data of in stock and out of stock items
    useEffect(() => {
      axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/products").then((response) => {
        setListOfProducts(response.data.productsInStock)
        setlistOutOfStock(response.data.productsOutOfStock)
      })
    }, []);
    //Upon loading the page, a get request is sent to set to see if there is currently a user session, i.e. checking for log in status.
    //go to server/routes/Users.js and locate router.get('/login', ...etc) to follow flow of data
    useEffect(() => {
      //sending a get request to this url
      axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login").then((response) => {
        //using the response to set both the login status, and user object
        //currently, currentUser is used for nothing
        //loginStatus is used to modify the navbar if user is logged in
        setLoginStatus(response.data.loggedIn)
        if(response.data.loggedIn){
          setUser(response.data.user)
        }
        
      })
    }, [])
    
    return (
      <div className="Products">
          <meta charSet="UTF-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Products</title>
          <link rel="stylesheet" href="style.css" />
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
          <section id="header">
            <a href="/#"><img src={require('./img/logo.png')} className="logo" alt="" width="300px" height="auto" /></a>
            <div>
              <ul id="navbar">
                <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    onSubmit();
                  }
                }}
                validationSchema={validationSchema}
                >
                    <Form className="formContainer">
                    <li>
                    <div class="search-box">
                    <ErrorMessage name="search" component="span" />
                    
                    <Field
                      className="search-txt"
                      autoComplete="off"
                      id="searchProducts"
                      name="title"
                      placeholder="Search..."
                    />
                    <a className="search-btn"><button type="submit" style={{ backgroundColor: 'rgba(52, 52, 52, 0.0)', border: 'none' }}><i className="fa-solid fa-magnifying-glass" /></button></a>
                    </div>
                    </li>
                  </Form>
                  </Formik>
                <li><a href="home">Home</a></li>
                <li><a className="active" href="products">Products</a></li>
                <li><a href="about">About Us</a></li>
                {/*This checks login status and alters the nav bar based on result*/}
                {!loginStatus ? 
                  (<li><a href="/login">Login</a></li>)
                  : 
                  (<li><a href="/userdashboard">Dashboard</a></li>)
                }
                <li><a href="cart"><i className="fa-solid fa-bag-shopping" /></a></li>
              </ul>
            </div>
          </section>
          <section id="page-header">
            <h2>Great Deals</h2>
            <p>Save more with coupons &amp; up to 70% off!</p>
          </section>
          
          <ProductTable products={listOfProducts}/>
          <p>-Currently out of stock-</p>
          
          <section id="pagination" className="section-p1">
            <a href="/#">1</a>
            <a href="/#">2</a>
            <a href="/#"><i className="fa-solid fa-arrow-right-long" /></a>
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

export default Products