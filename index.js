const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.port || 5000;


// middileware
app.use(cors())
app.use(express.json())

// mongoDBconnection 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.vi0yhuk.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


app.get('/', (req, res) => {
    res.send(`Ema john running`)
})

async function run() {
    try {
        const productCollection = client.db('ema-john-final').collection('products')

        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            console.log(page, size)
            const query = {};
            const cursor = productCollection.find(query)
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount()
            res.send({ count, products })
        })

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => new ObjectId(id))
            const query = { _id: { $in: objectIds } };
            const cursor = productCollection.find(query)
            const products = await cursor.toArray()
            res.send(products)
        })
    }
    finally {

    }
}
run().catch(err => console.error(err))

app.listen(port, () => {
    console.log(`server is running on the port ${port}`);
});