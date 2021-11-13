const express = require('express');
const cors = require('cors')
const { MongoClient } = require('mongodb');
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

      app.get('/products', async(req,res)=>{
       const cursor = productsCollection.find({});
       const products = await cursor.toArray();
       res.json(products);
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


