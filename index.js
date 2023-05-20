const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000;

//middleWare
app.use(cors())
app.use(express.json());



// mongodb



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.do03a5n.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
     client.connect();
    // Send a ping to confirm a successful connection


    const kidsLifeCollection = client.db('kidsLife').collection('products')

    app.get('/products/:categories',async(req,res)=>{
        const categories = req.params.categories;
        
        const result = await kidsLifeCollection.find({subCategory: categories}).toArray();
        res.send(result)

    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



//api

app.get('/', (req, res) => {
res.send('Kids Are Busy Now To Buy Toys')
})

//listen
app.listen(port,()=>{
    console.log(`kids life running on port:${port}`)
})