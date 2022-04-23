//This is the Cart app to display the Cart page
//Below are needed extensions
//import '../App.css';
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Cart() {
    let { id } = 3
    let navigate = useNavigate()
    //const [listOfProducts, setListOfProducts] = useState([]);
    const [loginStatus, setLoginStatus] = useState("")
    const [currentUser, setUser] = useState("")
    const [currentCart, setCart] = useState("");
    const [listOfProducts, setListOfProducts] = useState([]);
    const [listOfCart, setCartProducts] = useState([]);
    const [listOftest, settest1] = useState([]);
    const [subtotalPrice, setSubtotalPrice] = useState()
    var cartIsEmpty = false
    const initialValues = {
      fullName: "",
      address: "",
      zipcode: "",
    }
    const validationSchema = Yup.object().shape({
      fullName: Yup.string().min(3).max(255).required(),
      address: Yup.string().min(3).max(255).required(),
      zipcode: Yup.string().min(3).max(255).required(),
    })
    const onSubmit = (data) => {
        
      //console.log(data)
      //console.log(listOfCart)
      var dataArray = []
      console.log(data)
  
        axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/products/updateStock",listOftest.data).then((response) => {
          if(response.data == "updated"){

            for (var i = 0; i < (listOftest.data).length; i++) {
              var obj ={
                productId: listOftest.data[i].productId,
                productQuantity: listOftest.data[i].productQuantity
              }
              dataArray.push(obj)
            }
            var cartData = JSON.stringify(dataArray)
            var shippingData = "Full Name: " + data.fullName + "\nShipping Address: " + data.address + " " + data.zipcode
            //cart info
            console.log(cartData.slice(1,-1))
            console.log(shippingData)
            console.log(subtotalPrice)
            console.log(currentUser.email)
            axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/placeOrder", {
              userId: currentUser.id,
              shippingInfo: shippingData,
              cartInfo: cartData,
              cartTotal: subtotalPrice,
              orderStatus: false,
      
            }).then((response) => {
              if(response.data == "Success"){
                navigate('/userdashboard')
              }
            })


          } else {
            alert(response.data)
          }
        })
    };
    //Upon loading the page, a get request is sent to set to see if there is currently a user session, i.e. checking for log in status.
    //go to server/routes/Users.js and locate router.get('/login', ...etc) to follow flow of data
    useEffect(() => {
      setSubtotalPrice(0)
      

      
      //sending a get request to this url
      const data = {
        userId: 3
      }
      axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/products").then((response) => {
        setListOfProducts(response.data.productsInStock)
        var stocks = response.data.productsInStock
        axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login").then((response) => {
        //If user is not signed in, send /home
        if(response.data.loggedIn == false) {
          navigate('/home')
          window.location.reload(false);
          
        }
        //setting login status and user id
        setLoginStatus(response.data.loggedIn)
        setUser(response.data.user)
        //using id variable to pass user id
        var id = response.data.user.id
        var productQuan
        axios({
          method: 'post',
          url: 'https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/getCart',
          data: {
            id: `${id}`,
          }
          }).then((response) => {
            //Will change the name for this
            //It sets the cart info such as what product and quantity
            settest1(response)
            productQuan = response
          })
          //this gets messy here because it was all trial and error
          //for some reason variables value would change so I had
          //to create to calls to getCart

        axios({
          method: 'post',
          url: 'https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/getCart',
          data: {
            id: `${id}`,
          }
          }).then((response) => {
          //setting the cart
          console.log(response.data)
          setCart(response.data)
          //for testing
          //console.log(response)
          //using response data to make filter
          var filterCart = response.data
          var priceCalc = response.data
          //for testing
          //console.log(filterCart)
          if(currentCart.error){
            cartIsEmpty = true;
          }
          
          //This is the worst thing right here, I barely know how it works
          //The idea is that I am using the current cart information to filter a
          //list of all products and storing the ones that match so I can use
          //their product info such as name and price
          var inCartProducts = []
          for(let i = 0; i < filterCart.length; i++) {
            filterCart[i] = stocks.filter((x) => x.id == filterCart[i].productId)
          
            inCartProducts[i] = filterCart[i][0]
          } 
          setCartProducts(inCartProducts)
          //ignore all console logs, It was for testing
          //console.log(inCartProducts)
          var cartTotal = 0
          
          for(let i = 0; i < (inCartProducts).length; i++){
            cartTotal = cartTotal + (inCartProducts[i].productPrice * productQuan.data[i].productQuantity)
          }
          setSubtotalPrice(cartTotal)
          
        })
        
      })
      
        
      })
      
      
    }, [])
    console.log(listOftest.data)
    
    //removes item from cart
    function removeItem(data) {
      axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/removeItem", data).then((response) => {
            //console.log(response)
            if(response.data == "Success") {
              document.location.reload(true)
            }
        })
    }
    
    //uses the product id to find the quantity stored in current cart
    function addQuantity(data) {
      //console.log(listOftest.data[0].productId)
      //console.log(data)
      for(let i = 0; i < listOftest.data.length; i++){
        if(data == listOftest.data[i].productId){
          var dataBack = listOftest.data[i].productQuantity
          //console.log("hello")
          return dataBack
        }
      }
    }
    var appliedCoupon = false
    //adds up the price
    
    
    var runningTotal = 0
    console.log(subtotalPrice)
    function addPrice(data, quantity) {
      var productTotal = data * quantity
      runningTotal = runningTotal + productTotal
      return runningTotal.toFixed(2)
    }
    function setSubtotal() {
      setSubtotalPrice(runningTotal)
      return subtotalPrice
    }
    function applyCoupon() {
      //request to search coupons
      var data = {
        couponName: document.getElementById("couponInput").value
      }
      console.log(data)
      
      if(appliedCoupon){
        console.log("coupon already applied")
      } else {
        axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/products/checkCoupon", data).then((response) => {
            console.log(response)
            if(response.data[0]) {
              setSubtotalPrice(runningTotal - response.data[0].couponAmount) 
              appliedCoupon = true
            }
        })
      }
      
      
    }
    useEffect( () => {
      setSubtotalPrice(runningTotal)
    },[runningTotal]);
    
  return (
    <div>
  <meta charSet="UTF-8" />
  <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>cart</title>
  <link rel="stylesheet" href="style.css" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
  <section id="header">
    <a href="/home"><img src={require('./img/logo.png')} className="logo" alt="" width="300px" height="auto" /></a>
    <div>
      <ul id="navbar">
        <li><a href="/home">Home</a></li>
        <li><a href="/products">Products</a></li>
        <li><a href="/about">About Us</a></li>
        {/*This checks login status and alters the nav bar based on result*/}
        {!loginStatus ? 
                (<li><a href="/login">Login</a></li>)
                : 
                (<li><a href="/userdashboard">Dashboard</a></li>)
        }
        <li><a className="active" href="cart.html"><i className="fa-solid fa-bag-shopping" /></a></li>
      </ul>
    </div>
  </section>
  <section id="cart-header">
    <h2>Cart</h2>
    <p>Stress Free Checkout with SHOPAHOLIC</p>
  </section>
  <section id="cart" className="section-p1">
  <table width="100%">
      <thead>
        <tr>
          <td>Remove</td>
          <td>Images</td>
          <td>Products</td>
          <td>Prices</td>
          <td>Quantity</td>
          <td>Subtotal</td>
        </tr>
      </thead>
      <tbody>
        {listOfCart.map((item) => {
          
          
          return(
          <tr key={item.id}>
            <td><a ><i className="far fa-times-circle" onClick={() => {removeItem({userId: currentUser, productId: item.id})}}/></a></td>
            <td><img src={require(process.env.PUBLIC_URL + `${item.productImg}`)} alt="" /></td>
            <td>{item.title}</td>
            <td>${item.productPrice}</td>
            <td>{addQuantity(item.id)}</td>
            <td>${addPrice(item.productPrice, addQuantity(item.id) )}</td>
          </tr>
        )})}
      </tbody>
    </table>
  </section>
  <section id="cart-add" className="section-p1">
    <div id="coupon">
      <h3>Apply Coupon</h3>
      <div>
        <input type="text" placeholder="Enter Your Coupon" id="couponInput"/>
        <button className="normal" onClick={() => {applyCoupon()}}>Apply</button>
      </div>
    </div>
    <div id="subtotal">
      <h3>Cart Total</h3>
      <table>
        <tbody><tr>
            <td>Cart Subtotal</td>
            <td id="cartSubtotal">${runningTotal}</td>
          </tr>
          <tr>
            <td>Shipping</td>
            <td>Free</td>
          </tr>
          <tr>
            <td><strong>Total</strong></td>
            <td><strong>${subtotalPrice}</strong></td>
          </tr>
        </tbody>
        </table>
        <div className="form-inner" style={{width: "100%",margin: "auto"}}>

        <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <div className="field"><div>
          <ErrorMessage name="fullName" component="span" />
          </div>
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="fullName"
            placeholder="Full Name"
          />
          </div>
          <div className="field"><div>
          <ErrorMessage name="address" component="span" />
          </div>
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="address"
            placeholder="Shipping Address"
          />
          </div>
          <div className="field">
          <ErrorMessage name="zipcode" component="span" />
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="zipcode"
            placeholder="Zip Code"
          />
          </div>
          <div className="field btn">
            <div className="btn-layer"></div>
            <input type="submit" value="Submit Order"/>
          </div>
        </Form>
      </Formik>
      </div>
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

export default Cart;
