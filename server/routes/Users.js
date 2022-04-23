const express = require('express');
const router = express.Router();
const { Users, Products, Cart, Orders, Sequelize, Coupons } = require('../models');
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");


//registration

router.post("/", async (req, res) => {
    const { email, password } = req.body;
    //Checking if email already exists
    const userCheck = await Users.findOne({where: { email: email}});
    
    if (userCheck) {
		res.send("Email already exists")
	} else {
    //Hashing password
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            email: email,
            password: hash,
        })
    })
    const user = await Users.findOne({where: { email: email}});
    console.log(user)
    req.session.user = user;
    req.session.save();
    console.log(req.session.user);
    res.send("Success")
    }
});
//This post request is handling user login
router.post('/login', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://ec2-3-91-190-197.compute-1.amazonaws.com")
    const { email, password} = req.body;
    //find a user with related email
    const user = await Users.findOne({where: { email: email}});
    //if user doesnt exist, return error. if they do, compare the inputted password to the accounts hashed password
    if (!user) {
		res.json({ error: "User Doesn't Exist" })
	} else {
		bcrypt.compare(password, user.password).then(async (match) => {
			try {
				if (!match){
					res.json({ error: 'Wrong Username And Password Combination' })
                } else {
                    //If user enters correct information, the user is logged in and a session is created. It uses cookies yummy
                    req.session.user = user;
                    req.session.save();
                    console.log(req.session.user);
                    if(email == "admin@gmail.com"){
                        res.json("Admin")
                    } else {
                        res.send(req.session)
                    }
                }
			} catch (error) {
				console.log(error)
			}
		})
	}
})
//This get request is checking for a user session and returning if they are logged in and their user details
router.get('/login', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://ec2-3-91-190-197.compute-1.amazonaws.com");
    if (req.session.user) {
        res.send ({loggedIn: true, user: req.session})
    } else {
        res.send ({loggedIn: false })
    }
})

//This get request destroys the session and clears cookies
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.clearCookie("userId")
    res.send("logout")
})

/*--------------------------User Cart and Order Requests---------------------------------*/

router.post('/addToCart', async (req, res) => {
    const { userId, productId } = req.body;
    //find a user with related email
    const user = await Users.findOne({where: { id: userId}});
    const product = await Products.findOne({where: { id: productId}});
    //if user doesnt exist, return error. if they do, compare the inputted password to the accounts hashed password
    if (!user) {
		res.json({ error: "User Doesn't Exist" })
	} else if (!product) {
        res.json({ error: "Product Doesn't Exist" })
    } else {
        try {
        const findCart = await Cart.findOne({where: {productId: productId}})
        if(!findCart){
		Cart.create({
            userId: userId,
            productId: productId,
            productQuantity: 1,
        })
        } else {
            Cart.update({productQuantity: Sequelize.literal('productQuantity + 1') },{where: {productId: productId, userId: userId }})
        }
        res.json("Success")
        } catch (err) {
            console.log(err)
        }
	}
})
router.post('/getCart', async (req, res) => {
    const { id } = req.body;
    //find a user with related email
    if (id == null){
        res.json({ error: "undefined" })
    }else{
    const user = await Users.findOne({where: { id: id}});
    if (!user) {
		res.json({ error: "User Doesn't Exist" })
	} else {
        const cart = await Cart.findAll({where: {userId: id}})
        if(Object.keys(cart).length !== 0){
            res.json(cart)
        } else {
            res.json({ error: "Cart is empty" })
        }
        
    }

    }
    
})

router.post('/removeItem', async (req, res) => {
    const { userId, productId } = req.body;
    //find a user with related email
    const user = await Users.findOne({where: { id: userId}});
    const product = await Products.findOne({where: { id: productId}});
    //if user doesnt exist, return error. if they do, compare the inputted password to the accounts hashed password
    if (!user) {
		res.json({ error: "User Doesn't Exist" })
	} else if (!product) {
        res.json({ error: "Product Doesn't Exist" })
    } else {
        try {
        const findCart = await Cart.findOne({where: {productId: productId}})
        if(!findCart){
            res.json({ error: "Product is not in user cart" })
        } else {
            Cart.destroy({where: {productId: productId, userId: userId }})
        }
        res.json("Success")
        } catch (err) {
            console.log(err)
        }
	}
})

//----------For Placing Orders----------------

router.post('/placeOrder', async (req, res) => {
    const { userId, shippingInfo, cartInfo, cartTotal, orderStatus } = req.body;
    //find a user with related email
    const user = await Users.findOne({where: { id: userId}});
    //if user doesnt exist, return error. if they do, compare the inputted password to the accounts hashed password
    if (!user) {
		res.json({ error: "User Doesn't Exist" })
    } else {
        try {
		Orders.create({
            userId: userId,
            shippingInfo: shippingInfo,
            cartInfo: cartInfo,
            cartTotal: cartTotal,
            orderStatus: orderStatus,
        })
        Cart.destroy({where: { userId: userId}})
        res.json("Success")

        } catch (err) {
            console.log(err)
        }
	}
})

/*------------------------Admin DashBoard-----------------------*/
//Orders
router.get("/getOrders", async (req, res) => {
    const listOfOrders = await Orders.findAll()
    res.json(listOfOrders)
});
router.post("/orderStatus", async (req, res) => {
    const { id, status } = req.body
    await Orders.update({orderStatus: status},{where: {id: id}})
    res.json("Success")
});
//Users
router.get("/getUsers", async (req, res) => {
    const listOfUsers = await Users.findAll()
    res.json(listOfUsers)
});
//Coupons
router.get("/getCoupons", async (req, res) => {
    const listOfCoupons = await Coupons.findAll()
    res.json(listOfCoupons)
});
router.post("/createCoupon", async (req, res) => {
    const {couponName, couponAmount} = req.body
    await Coupons.create({couponName: couponName, couponAmount: couponAmount,})
    res.json("Success")
});
router.post("/removeCoupon", async (req, res) => {
    const { id } = req.body
    await Coupons.destroy({where: {id: id}})
    res.json("Success")
});
//Not implemented
router.post("/modifyCoupon", async (req, res) => {
    const { id ,couponName, couponAmount} = req.body
    const coupon = await Coupons.findOne({where: {id: id}})
    await coupon.update({couponName: couponName, couponAmount: couponAmount})
    res.json("Success")
});

router.post("/deleteUser", async (req, res) => {
    //find user with id and delete all data associated with ID
});


module.exports = router;