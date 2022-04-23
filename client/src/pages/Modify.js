//This is the Product app to display a Product
//Below are needed extensions
//import '../App.css';
import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Modify() {
    //setting initialValues for the formik
    const initialValues = {
        title: "",
        productDesc: "",
        productPrice: "",
        productStock: "",
        productType: "",
    }
    //used to validate the input of the user
    const validationSchema = Yup.object().shape({
        title: Yup.string().min(3).max(255).required(),
        productDesc: Yup.string().min(3).max(255).required(),
        productPrice: Yup.string().min(0).max(255).required(),
        productStock: Yup.string().min(0).max(255).required(),
        productType: Yup.string().min(3).max(255).required(),
    })
    //Using the param passed in the navigate('/product/${value.id}') command used when clicking a product on the Products.js page
    let { id } = useParams();
    const [prodObject, setProductObject] = useState([]);
    const [loginStatus, setLoginStatus] = useState("")
    const [currentUser, setUser] = useState("")
    let navigate = useNavigate()
    
    //when submited a post request is made to update the product with the same id
    const onSubmit = (data) => {
            data.productPrice = parseFloat(data.productPrice, 10)
            data.productStock = parseInt(data.productStock, 10)
            axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/products/update", {
                id: id,
                title: data.title,
                productDesc: data.productDesc,
                productPrice: data.productPrice,
                productStock: data.productStock,
                productType: data.productType,
            }).then((response) => {
                console.log(response);
            });
            

      };
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
            if(response.data.loggedIn == false) {
                navigate('/home')
                window.location.reload(false);
                
                
            }
            if(response.data.user.email !== 'admin@gmail.com'){
                navigate('/home')
                window.location.reload(false);
            }
            setLoginStatus(response.data.loggedIn)
            setUser(response.data.user)

        })

    }, []);
    console.log(prodObject)
    
    
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
              
              
              
              {/*This checks login status and alters the nav bar based on result*/}
              {!loginStatus ? 
                (<li><a href="/login">Login</a></li>)
                : 
                (<li><a href="/admin">Dashboard</a></li>)
              }
              
            </ul>
          </div>
        </section>
        {prodObject.map(data =>
        <section id="details" className="section-p1">
        <div className="single-img">
            <img src={require(process.env.PUBLIC_URL + `${data.productImg}`)} alt="" width="100%" id="main-img" />
        </div>
        <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
        >
            <Form>
                <div>
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="title"
                    placeholder={data.title}
                />
                </div>
                <div>
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="productDesc"
                    placeholder={data.productDesc}
                />
                </div>
                <div>
                <Field
                    autoComplete="off"
                    type="number"
                    id="updateProduct"
                    name="productPrice"
                    placeholder={data.productPrice}
                />
                </div>
                <div>
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="productStock"
                    placeholder={data.productStock}
                />
                </div>
                <div>
                <Field
                    autoComplete="off"
                    type="text"
                    id="updateProduct"
                    name="productType"
                    placeholder={data.productType}
                />
                </div>
                <div className="field btn">
                    <div className="btn-layer"></div>
                    <input type="submit" value="Update"/>
                </div>
            </Form>
        </Formik>
        </section>
        )}
        
        <footer className="section-p1">
          
        </footer>
      </div>
    );


}

export default Modify;