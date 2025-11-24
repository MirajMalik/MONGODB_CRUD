const { urlencoded } = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { type } = require("os");
const { title } = require("process");
const port = process.env.PORT || 8000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// product schema

const productsSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    price : {
        type : Number,
        required : true,
    },
    description : {
        type : String,
        required : true,
    },
    createdAt : {
        type : Date,
        default : Date.now,
    },
});

//DATABASE => COLLECTIONS(TABLE) => DOCUMENT(ID,TITLE..)
// product model
const product = mongoose.model("products",productsSchema); // Products = Collection , productsSchema = Which schema Products collection is going to follow
 

// mongodb connection

const connectDB = async () =>{
    try{
        await mongoose.connect("mongodb://localhost:27017/productDB");
        console.log("DB is connected");
    
    }catch(error){
        console.log("Error : ",error.message);
        process.exit(1);
    }

}





app.get('/',(req,res)=>{
    res.send("We are in the home page");
});

// POST: /products -> create a product
// GET: /products/:id -> Return a specific product
app.post("/products", async (req,res) => {
    try{
        // get data from req body
        // const title = req.body.title;
        // const price = req.body.price;
        // const description = req.body.description;

        //const{title,price,description} = req.body;

        const newProduct =  new product({   // here product is the model name
            title : req.body.title,
            price : req.body.price,
            description : req.body.description,
        });

        const productData = await newProduct.save();

        res.status(201).send(productData);



    }catch(error){
        res.status(500).send({message : error.message});
    }

});


// GET: /products -> Return all the products
app.get('/products', async (req,res) => {
    try{
         const products = await product.find();  // modelname.find() to find the products from db
         if(products){
            res.status(200).send(products);
         }
         else{
             res.status(404).send({
                message : "products not found",
             });
         }
    }catch(error){
        res.status(500).send({message : error.message});
    }

    
});














app.listen(port, async (req,res) => {
    console.log(`Server is running at http://localhost:${port}`);
    await connectDB();
})