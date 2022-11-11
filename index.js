const express = require('express');
const cors = require('cors');
require('dotenv').config()

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, CURSOR_FLAGS, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ipnjwkc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try {
        const serviceCollection = client.db('electMan').collection('services')
        const reviewsCollection = client.db('electMan').collection('reviews')
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

        app.get('/services/:id', async(request, response)=>{
            const id = request.params.id
            const query = {_id:ObjectId(id)}
            const result = await serviceCollection.findOne(query)
            response.send(result)
        })

        app.get('/reviews/:id', async(request, response)=>{
            const id = request.params.id
            const query = {serviceId: id}
            const cursor = reviewsCollection.find(query)
            const result = await cursor.toArray()
            response.send(result)
        })

        app.post('/add-review', async(request, response)=>{
            const review = request.body;
            const result = await reviewsCollection.insertOne(review)
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