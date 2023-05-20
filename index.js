const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000;

//middleWare
app.use(cors())
app.use(express.json());


//api

app.get('/', (req, res) => {
res.send('Kids Are Busy Now To Buy Toys')
})

//listen
app.listen(port,()=>{
    console.log(`kids life running on port:${port}`)
})