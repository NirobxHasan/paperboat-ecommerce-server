const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectID = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();

//middleware
app.use(cors());
app.use(express.json())

const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jiiff.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
      await client.connect();
      const database = client.db("Paperboat");
      const productsCollection = database.collection("products");
      const ordersCollection = database.collection("orders");
      const reviewsCollection = database.collection("reviews");
      const usersCollection = database.collection("users");


      //saveUser
     app.post('/users', async(req,res)=>{
       const user = req.body;
       const result = await usersCollection.insertOne(user);
       res.json(result);
     }) 
     
     app.put('/users', async(req,res)=>{
       const user = req.body;
       const filter = {email: user.email}
       const options = { upsert: true };
       const updateDoc = {$set: user};
       const result = await usersCollection.updateOne(filter,updateDoc, options);
       res.json(result)
     })

     //Make Admin
     app.put('/users/admin', async(req,res)=>{
       const data= req.body;
       const filter = {email: data.email};
       const updateDoc = {$set:{ role:'admin' }}
       const result = await usersCollection.updateOne(filter,updateDoc)
       res.json(result);
     })

     //Check admin
     app.get('/users/:email',async(req,res)=>{
       const email = req.params.email;
      
       const  filter = {email:email};
       const user = await usersCollection.findOne(filter);
       let isAdmin = false;
       if(user?.role === 'admin'){
         isAdmin = true;
       }
       res.json({admin: isAdmin})


     })


     //Add Product 
     app.post('/products', async(req,res)=>{
       const data = req.body;
       const result = await productsCollection.insertOne(data)
       res.json(result);
     })
     
     

      //Get All products
      app.get('/products', async(req,res)=>{
       const cursor = productsCollection.find({});
       const products = await cursor.toArray();
       res.json(products);
      })


      //Get single product
      app.get('/products/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id:ObjectID(id)};
        const product = await productsCollection.findOne(query)
        res.json(product);
       })

       //delete products
       app.delete('/products/:id', async(req,res)=>{
        const id = req.params.id;
        const query = {_id: ObjectID(id)}
        const result = await productsCollection.deleteOne(query)
        res.json(result)
      })

       //Place order
       app.post('/orders', async(req,res)=>{
         const data = req.body;
         const result = await ordersCollection.insertOne(data);
         res.json(result)
       })
       //Get user order
       app.get('/orders', async(req,res)=>{
         const email_query = req.query.email;
         console.log(email_query);
        const query = {email: email_query};
        const cursor = ordersCollection.find(query);
        const products = await cursor.toArray();
        res.json(products)

      })

      //get all orders
      app.get('/allOrders', async(req,res)=>{
       const cursor = ordersCollection.find({});
       const orders = await cursor.toArray();
       res.json(orders)

     })
        //Delete order
        app.delete('/orders/:id', async(req,res)=>{
          const id = req.params.id;
          const query = {_id: ObjectID(id)}
          const result = await ordersCollection.deleteOne(query)
          res.json(result)
        })

        //Change Status
        app.put('/orders/:id', async(req,res)=>{
          const id = req.params.id;
          const data = req.body;
          const filter = {_id: ObjectID(id)}
          const options = { upsert: true };
          const updateDoc = {
            $set:{status: data.status}
          }

          const result = await ordersCollection.updateOne(filter,updateDoc,options)
        })

        //review Post 
       app.post('/reviews', async(req,res)=>{
        const data = req.body;
        const result = await reviewsCollection.insertOne(data);
        res.json(result)
      })
        //Get review 
       app.get('/reviews', async(req,res)=>{
        const cursor = reviewsCollection.find({});
        const reviews =  await cursor.toArray()
        res.json(reviews)
      })


      


    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('welcome to paperbaot')
})



app.listen(port,()=>{
    console.log('Listening from port:',port);
})


