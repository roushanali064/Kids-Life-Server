const express = require('express');
const cors = require('cors');
require('dotenv').config()
const {
  MongoClient,
  ServerApiVersion,
  ObjectId
} = require('mongodb');
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
    //  client.connect();
    // Send a ping to confirm a successful connection


    const kidsLifeCollection = client.db('kidsLife').collection('products')

    app.post('/product', async (req, res) => {
      const product = req.body;
      const result = await kidsLifeCollection.insertOne(product)
      res.send(result)
    })

    app.get('/products', async (req, res) => {
      const result = await kidsLifeCollection.find().limit(20).toArray()
      res.send(result)
    })

    app.get('/products/:categories', async (req, res) => {
      const categories = req.params.categories;

      const result = await kidsLifeCollection.find({
        subCategory: categories
      }).toArray();
      res.send(result)

    })

    

    app.get('/toys', async (req, res) => {

      let query = {}
      if (req.query?.email) {
        query = {
          sellerEmail: req.query.email
        }
      }
      const sortOperation = {
        price: 1
      }
      const result = await kidsLifeCollection.find(query).sort(sortOperation).toArray();
      res.send(result)
    })

    app.get('/toy/:id', async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id)
      }
      const result = await kidsLifeCollection.findOne(query)
      res.send(result)
    })

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;

      const query = {
        _id: new ObjectId(id)
      }
      const result = await kidsLifeCollection.deleteOne(query)
      res.send(result)
    })

    app.get('/search', async (req, res) => {
      try {
        const name = req.query.name;
        
    
        const filter = { name: { $regex: name, $options: 'i' } };
    
        const result = await kidsLifeCollection.find(filter).toArray();
    
        res.send(result);
      } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
      }
    });

    app.patch('/update/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const update = { $set: req.body };
      
        const result = await kidsLifeCollection.updateOne(filter, update);
        res.send(result)
      
        // if (result.modifiedCount === 1) {
        //   res.send({ message: 'Document updated successfully' });
        // } else {
        //   res.status(404).send({ error: 'Document not found' });
        // }
      } catch (error) {
        res.status(500).send({ error: 'Internal server error' });
      }
    });
    
    

    await client.db("admin").command({
      ping: 1
    });
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
app.listen(port, () => {
  console.log(`kids life running on port:${port}`)
})