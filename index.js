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
const Product = mongoose.model("products",productsSchema); // Products = Collection , productsSchema = Which schema Products collection is going to follow
 

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


// CRUD Operation

// POST: /products -> create a product
app.post("/products", async (req,res) => {
    try{
        // get data from req body
        // const title = req.body.title;
        // const price = req.body.price;
        // const description = req.body.description;

        //const{title,price,description} = req.body;

        const newProduct =  new Product({   // here product is the model name
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


// // GET: /products -> Return all the products
app.get('/products', async (req,res) => {
    try{
         const products = await Product.find();  // modelname.find() to find the products from db
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


// GET: /products/:id -> Return a specific product
app.get('/products/:id', async (req,res) => {
    try{
         const id = req.params.id;
         //const product = await product.find({_id: id});   // modelname.find() to find the products from db.Find returns a array.
         const product = await Product.findOne({_id: id});  // findOne returns object.Returns everything
        //  const product = await product.findOne({_id: id}).select({
        //     title: 1,
        //     _id : 0
        //  });                   // for specific things we use select.1 means true .Here only the title will be displayed.0 means dont display.

        //  res.send(product);


         if(product){
            res.status(200).send(product);
         }
         else{
             res.status(404).send({
                message : "product not found",
             });
         }
    }catch(error){
        res.status(500).send({message : error.message});
    }

    
});



// GET: /products -> Return all the products using query operator
app.get('/products', async (req,res) => {
    try{
         const price = req.query.price;
         let products;
         //const products = await product.find({price : {$eq : 14000}});  // lt = less than ,gt = greater than , eq = equal ,ne = not equal ,gte,lte,in[array of values]
         //for user input price
         if(price){
              products = await product.find({price : {$gt : price}});
         }else{
              products = await product.find();
         }
         

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


//DELETE: /products/:id => delete a product based on id

app.delete('/products/:id',async (req,res) => {
    try{
        const id = req.params.id;
        const deletedProduct = await Product.findByIdAndDelete({_id : id});
        if(deletedProduct){
            res.status(200).send({
                success : true,
                message : "product deleted",
                data : product,

            });
        }else{
            res.status(404).send({
                success : false,
                message : "product can not be deleted",

            });
        }


    }catch(error){
        console.log("Error Occured");
         res.status(500).send({message : error.message});
     }
});


// update a product by id
app.put("/products/:id", async (req,res) => {
    try{
        const id = req.params.id;
        const updatedProduct = await Product.findByIdAndUpdate( 
            {_id : id} , 
            {
            $set : {
                title : req.body.title,
                price : req.body.price,
                description : req.body.description,
                },
             
             },
            {new : true}  
    );

        if(updatedProduct){
            res.status(200).send({
                success : true,
                message : "product updated",
                data : updatedProduct,

            });
        }else{
            res.status(404).send({
                success : false,
                message : "product can not be updated",

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