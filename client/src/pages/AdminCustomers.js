import './admin.css'
import { React, useEffect, useState, useMemo } from 'react'
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-svg-core/styles.css'
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
              onClick={() => requestSort('email')}
              className={getClassNamesFor('email')}
            >
              Email:
            </button>
          </th>
          <th>
          <button
              type="button"
              onClick={() => requestSort('createdAt')}
              className={getClassNamesFor('createdAt')}
            >
              Created At:
            </button>
          </th>
          <th>
            <button
              type="button"
              onClick={() => requestSort('updatedAt')}
              className={getClassNamesFor('updatedAt')}
            >
              Updated At:
            </button>
          </th>
          <th>
              Modify:
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.email}</td>
            <td>{item.createdAt.slice(0, -5).replace("T", "  " )}</td>
            <td>{item.updatedAt.slice(0, -5).replace("T", "  " )}</td>
            <td>modify</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


function AdminCustomers() {
  let navigate = useNavigate()
    const [listOfProducts, setListOfProducts] = useState([]);
    const [listOutofStock, setlistOutOfStock] = useState([]);
    const [currentUser, setUser] = useState("")
    const [listOfUsers, setListUsers] = useState("")
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
        axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/getUsers").then((response) => {
            setListUsers(response.data)
            
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
              <a href="/adminorders">
                <span className="material-icons-sharp">receipt_long</span>
                <h3>Orders</h3>
              </a>
              <a href="/admincustomers" className="active">
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
            <h1>Customers/Users</h1>
            <div className="recent-orders">
              <h2>Current Accounts</h2>
              <ProductTable
                products={listOfUsers}
              />
            </div>
          </main>
          {/*-----------End of Main-----------*/}
        </div>
      </div>
  )
}

export default AdminCustomers