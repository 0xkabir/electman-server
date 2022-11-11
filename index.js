const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, CURSOR_FLAGS } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ipnjwkc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        const serviceCollection = client.db('electMan').collection('services')
        app.get('/services', async(request, response)=>{
            const query = {}
            let limit = 0
            if(request.query.count){
                limit = parseInt(request.query.count)
            }
            const cursor = serviceCollection.find(query)
            const result = await cursor.limit(limit).toArray()
            response.send(result) 
        })
    }
    finally {

    }
}

run().catch((error) => console.error(error));


app.get('/', (req, res)=>{
    res.send('ElectMan server running')
})

app.listen(port, ()=>{
    console.log(`ElectMan Server Running on port ${port}`)
})