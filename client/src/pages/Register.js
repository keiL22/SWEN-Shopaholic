//This is the register app to display the register page
//Below are needed extensions
import { React, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios"

function Register() {
    //used for routing
    let navigate = useNavigate()
    //creating initial values
    const initialValues = {
        email: "",
        password: "",
        passwordConfirm: "",
    }
    //used to validate the input of the user
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required (),
        password: Yup.string().min(3).max(255).required(),
        passwordConfirm: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
    })
    //when the form is submited a post request is made to Users route using /auth as defined in index.js in the server folder
    const onSubmit = (data) => {
        axios.post("https://ec2-3-91-190-197.compute-1.amazonaws.com/auth", data).then((response) => {
          if(response.data == "Success") {
            navigate("/login")
          }
          if(response.data == "Email already exists") {
            console.log(response.data)
          }
        });
      };
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
            
            <div className="title signup">Signup Form</div>
          </div>
          <div className="form-container">
            <div className="slide-controls">
              <input type="radio" name="slide" id="login" />
              <input type="radio" name="slide" id="signup" defaultChecked />
              <label htmlFor="login" className="slide login" onClick={() => {navigate("/login")}}>Login</label>
              <label htmlFor="signup" className="slide signup" onClick={() => {navigate("/register")}}>Signup</label>
              <div className="slider-tab" />
            </div>
            <div>
            <div className="form-inner">
              {/*I will give these forms better comments soon, hard to explain over text.*/}
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
        <div className="field">
          <p></p>
          <ErrorMessage name="passwordConfirm" component="span" />
          <Field
            autoComplete="off"
            type="password"
            id="inputCreatePost"
            name="passwordConfirm"
            placeholder="Confirm Password"
          />
        </div>
        <div className="field btn">
            <div className="btn-layer"></div>
            <input type="submit" value="Signup"/>
        </div>
        </Form>
      </Formik>
      </div>
            </div>
          </div>
        </div>
        
      </div>
  )
}

export default Register