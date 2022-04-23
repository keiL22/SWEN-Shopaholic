import './admin.css'
import { React, useEffect, useState, useMemo } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-svg-core/styles.css'
import { Formik, Form, Field, ErrorMessage } from "formik";
//Used to sort the data in the table
const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState(config);

  const sortedItems = useMemo(() => {
    let sortableItems = [...items];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          console.log("accend")
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
//Displays the table with ability to sort columns
const ProductTable = (props) => {
  let navigate = useNavigate()
  const { items, requestSort, sortConfig } = useSortableData(props.products);
  const getClassNamesFor = (name) => {
    if (!sortConfig) {
      
      return;
    }
    
    return sortConfig.key === name ? sortConfig.direction : undefined;
    
  };
  function cartInfo(data) {
    var dataJSON = JSON.parse(data)
    console.log(dataJSON)
    return(
    <p>
    {dataJSON.map((item) => (
      <p>Product Id: {item.productId} <br/>
      Quantity: {item.productQuantity}</p>
    ))}
    </p>
    )

  }
  function orderStatus(data) {
    
    if(data) {
      return <p className="success">Fulfilled</p>
    } else {
      return <p className="danger">Not Fulfilled</p>
    }
  }
  function updateStatus(data) {
    var answer = window.confirm("Mark this order as fulfilled?");
    if(answer) {
      axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/orderStatus", data).then((response) => {
            console.log(response.data)
            if(response.data == "Success") {
              document.location.reload(true)
            }
      })
    } else {

    }
    
  }
  return (
    <table>
      <thead>
        <tr>
          <th>
            <button
              type="button"
              onClick={() => requestSort('userId')}
              className={getClassNamesFor('userId')}
            >
              User ID:
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('shippingInfo')}
              className={getClassNamesFor('shippingInfo')}
            >
              Shipping Info:
            </button>
          </th>
          <th>
              Cart Info:
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('cartTotal')}
              className={getClassNamesFor('cartTotal')}
            >
              Cart Total:
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('createdAt')}
              className={getClassNamesFor('createdAt')}
            >
              Order Date:
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('orderStatus')}
              className={getClassNamesFor('orderStatus')}
            >
              Order Status:
            </button>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.userId}</td>
            <td>{item.shippingInfo}</td>
            <td>{cartInfo(item.cartInfo)}</td>
            <td>${item.cartTotal}</td>
            <td>{item.createdAt.slice(0,-14)}</td>
            <td>{orderStatus(item.orderStatus)}</td>
            <td>
            {item.orderStatus ? 
            (<a style={{cursor: 'default'}}>
            <span className="material-icons-sharp">price_check</span>
            <h3>Order FulFilled</h3>
            </a>) : 
            (<a style={{cursor: 'pointer'}} onClick={() => updateStatus({id: item.id, status: true})}>
            <span className="material-icons-sharp">pending_actions</span>
            <h3>Mark as Fulfilled?</h3>
            </a>)

            }
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


function AdminOrders() {
  let navigate = useNavigate()
    const [listOfProducts, setListOfProducts] = useState([]);
    const [listOutofStock, setlistOutOfStock] = useState([]);
    const [currentUser, setUser] = useState("")
    const [currentOrders, setOrders] = useState("")
    const [loginStatus, setLoginStatus] = useState("")
    function loggout() {
        //Sends a get request to the url and uses the response to redirect to the homepage.
        //go to server/routes/Users.js and locate router.get('/logout', ...etc) to see how it works
        axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/logout").then((response) => {
            console.log(response)
            if(response.data == "logout") {
                navigate("/home")
            }
        })
    }
    useEffect(() => {
        
        //Checking to see if user is signed in and if admin, if not, send to /home
        axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login").then((response) => {
          
            if(response.data.loggedIn == false) {
                navigate('/home')
                window.location.reload(false);
                
                
            }
            if(response.data.user.email !== 'admin@gmail.com'){
                navigate('/home')
                window.location.reload(false);
            }
        })
        //gets lists of both in and out of stock items.
        //will create a different call for this so that 
        //it gets all the items together no matter the stock
        axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/products").then((response) => {
            setListOfProducts(response.data.productsInStock)
            setlistOutOfStock(response.data.productsOutOfStock)
        })
        axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/getOrders").then((response) => {
            setOrders(response.data)
            
        })
    }, [])
  return (
    <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="admin.css" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />
        <title>Orders</title>
        
        <div className="container">
          <aside>
            <div className="top">
              <div className="logo">
              <img className ="im" src={require('../img/logo.png')} />
              </div>
              <div className="close" id="close-btn">
                <span className="material-icons-sharp">close</span>
              </div>
            </div>
            <div className="sidebar">
              <a href="/admin">
                <span className="material-icons-sharp">dashboard</span>
                <h3>Dashboard</h3>
              </a>
              <a href="/adminproducts">
                <span className="material-icons-sharp">inventory</span>
                <h3>Products</h3>
              </a>
              <a href="/admincoupons">
                <span className="material-icons-sharp">discount</span>
                <h3>Coupons</h3>
              </a>
              <a href="/adminorders" className="active">
                <span className="material-icons-sharp">receipt_long</span>
                <h3>Orders</h3>
              </a>
              <a href="/admincustomers">
                <span className="material-icons-sharp">person_outline</span>
                <h3>Customers</h3>
              </a>
              <a href="#">
                <span className="material-icons-sharp">settings</span>
                <h3>Settings</h3>
              </a>
              <a href="#">
                <span className="material-icons-sharp">logout</span>
                <h3 onClick={() => {loggout();}}>Logout</h3>
              </a>
            </div>
          </aside>
          {/*-----------END OF ASIDE----------*/}
          <main>
            <h1>Orders</h1>
            <div className="date">
              <input type="date" />
            </div>
            <div className="recent-orders">
              <h2>Current Orders</h2>
              <ProductTable
                products={currentOrders}
              />
            </div>
          </main>
          {/*-----------End of Main-----------*/}
        </div>
      </div>
  )
}

export default AdminOrders