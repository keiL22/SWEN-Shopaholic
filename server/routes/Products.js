const express = require('express');
const router = express.Router();
const { Products, Coupons } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


//This get request finds all in stock and out of stock products and puts them into their respected variables.
router.get("/", async (req, res) => {
    const listOfProducts = await Products.findAll({where : {productStock : {[Op.gt]: 0}}})
    const listOutOfStock = await Products.findAll({where : {productStock : 0}})
    //returning both these variables
    res.json({productsInStock: listOfProducts, productsOutOfStock: listOutOfStock})
});


//This get request finds all in stock and out of stock products and puts them into their respected variables.
router.get("/allProducts", async (req, res) => {
    const listOfProducts = await Products.findAll()
    
    //returning both these variables
    res.json(listOfProducts)
});

//takes the id passed at the end of the route , :id, and searches products for that id
router.get('/byId/:id', async (req, res) => {
    const id = req.params.id //dont think i need this 
    const product = await Products.findAll({where : {id : req.params.id}})
    res.json(product)
});

//takes the id passed at the end of the route , :id, and searches products for that id
router.post('/bySearch', async (req, res) => {
    const id = req.body.title //dont think i need this 
    const products = await Products.findAll({where : {title : { [Op.like]: `%${req.body.title}%`}}})
    if (!products) {
        res.json({ error: "No results found" })
    } else {
        res.json(products)
    }
});

router.get('/modify/:id', async (req, res) => {
    const id = req.params.id //dont think i need this 
    const product = await Products.findAll({where : {id : req.params.id}})
    res.json(product)
});


//never used in code but can be tested with api testing application to send a post request
//to create a product. Can be modified later and used for admin dashboard
router.post("/", async (req, res) => {
    const post = req.body;
    await Products.create(post);
    res.json(post);

});
router.post("/update", async (req, res) => {
    const { id, title, productDesc, productPrice, productStock, productType} = req.body
    await Products.update({
        title: title,
        productDesc: productDesc,
        productPrice: productPrice,
        productStock: productStock,
        productType: productType,
    },{where: { id: id}, returning: true, plain: true});
    res.send("updated")


});
router.post("/checkCoupon", async (req, res) => {
    const { couponName } = req.body //dont think i need this 
    const coupon = await Coupons.findAll({where : {couponName : couponName}})
    if(!coupon){
        res.json("Coupon not found")
    } else {
        res.json(coupon)
    }
    
});
router.post("/updateStock", async (req, res) => {
    const body = req.body
    
    var readyToUpdate = false;
    var error = ``
    for(var i = 0; i < body.length; i++){
        const product =  await Products.findOne({where: {id: body[i].productId}})
        var updatedStock = 0
        if(!product){
            readyToUpdate = false;
            error = `Error product not found`
            break;
        } else {
            if(product.productStock <= 0){
                readyToUpdate = false;
                error = `Error: product: ${product.title} is out of stock`
                break;
            }else if(product.productStock < body[i].productQuantity){ 
                readyToUpdate = false;
                error = `Error: Stock of ${product.title} is too low`
                break;
            }else {
                readyToUpdate = true
            }
        }
    }
    
    if(readyToUpdate){
        for(var i = 0; i < body.length; i++){
            const product =  await Products.findOne({where: {id: body[i].productId}})
            updatedStock = product.productStock - body[i].productQuantity
            await Products.update({
                productStock: updatedStock,
                },{where: { id: body[i].productId}, returning: true, plain: true});
        }
        res.send("updated")
    } else {
        res.send(error)
    }
    
});
router.post("/removeProduct", async (req, res) => {
    //find product with matching id and delete all data associated with it
});

module.exports = router;