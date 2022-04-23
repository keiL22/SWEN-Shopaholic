//This is the Login app to display the Login
//Below are needed extensions
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios, { Axios } from "axios"

function Login() {
    //setting initialValues for the formik
    const initialValues = {
        email: "",
        password: "",
    }
    //used to validate the input of the user
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required (),
        password: Yup.string().min(3).max(255).required(),
    })
    //used to navigate certain pages, i think this can be removed because the router has been implemeted now
    let navigate = useNavigate()
    //On submit a post request is sent to that url and if the data equals logged in the page refreshes
    //and the user is sent to the home page.
    //During this post request a session and cookie are created to carry a users information from page to page
    const onSubmit = (data) => {
        
      
        axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login", data, {withCredentials: true}).then((response) => {
          console.log(response.data);
          
          if (response.data == "Logged in") {
            window.location.reload(false);
          }
          if (response.data == "Admin") {
            navigate("/admin")
          }
        });
        
      };
    //During login, if successful, the page refreshes and this get request is sent.
    //go to server/routes/Users.js to see how it works.
    useEffect(() => {
      axios.get("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth/login").then((response) => {
        if (response.data.loggedIn == true) {
          navigate("/home")
        }
      })

    }, [])
  return (
    <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>login</title>
        <link rel="stylesheet" href="./style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" />
        <section id="header">
          <a href="/#"><img src={require('./img/logo.png')} className="logo" alt="" width="300px" height="auto" /></a>
          <div>
            <ul id="navbar">
              <li><a href="/home">Home</a></li>
              <li><a href="/products">Products</a></li>
              <li><a href="about">About Us</a></li>
              <li><a className="active" href="login">Login</a></li>
              <li><a href="cart"><i className="fa-solid fa-bag-shopping" /></a></li>
            </ul>
          </div>
        </section>
        <div className="login_body" />
        <div className="wrapper">
          <div className="title-text">
            <div className="title login">Login Form</div>
            <div className="title signup">Signup Form</div>
          </div>
          <div className="form-container">
            <div className="slide-controls">
              <input type="radio" name="slide" id="login"  defaultChecked/>
              <input type="radio" name="slide" id="signup" />
              <label htmlFor="login" className="slide login">Login</label>
              <label htmlFor="signup" className="slide signup" onClick={() => {navigate("/register")}}>Signup</label>
              <div className="slider-tab" />
            </div>
            <div className="form-inner">
              {/*I will give these forms better comments soon, hard to explain over text*/}
            <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={validationSchema}
      >
        <Form className="formContainer">
          <div className="field"><div>
          <ErrorMessage name="email" component="span" />
          </div>
          <Field
            autoComplete="off"
            id="inputCreatePost"
            name="email"
            placeholder="(Ex. John@gmail.com)"
          />
        </div>
        <div className="field">
          <ErrorMessage name="password" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="password"
            placeholder="Your Password..."
          />
        </div>
        <div className="field btn">
            <div className="btn-layer"></div>
            <input type="submit" value="Login"/>
        </div>
        </Form>
      </Formik>
            </div>
          </div>
        </div>
        
      </div>
  )
}

export default Login