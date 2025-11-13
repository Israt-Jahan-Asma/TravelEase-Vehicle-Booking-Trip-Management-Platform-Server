const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster.v8ksg0w.mongodb.net/?appName=Cluster`;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
async function run() {
    try {

        // await client.connect();
        
        const db = client.db('TravelEase')
        const vehicleCol = db.collection('Vehicles')
        const bookingCol = db.collection('Bookings')

        // all vehicle page api
        app.get('/all-vehicles', async (req, res) => {
            const result = await vehicleCol.find().toArray()
            res.send(result)
        })

        app.post('/all-vehicles', async (req, res)=>{
            
            const data = req.body
            const result = await vehicleCol.insertOne(data)
            res.send(result)
        })

        app.get('/latest-vehicles', async (req, res)=>{
            const cursor = vehicleCol.find().sort({ createdAt: -1}).limit(6)
            const result= await cursor.toArray()
            res.send(result)
        })
        //vehicle details single api
        app.get('/all-vehicles/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)}
            const result = await vehicleCol.findOne(query)
            res.send(result);
        })

        //booking api for vehicle details
        app.post('/my-bookings', async(req, res)=> {
            const bookingData = req.body;
            const result = await bookingCol.insertOne(bookingData);
            res.send(result);
        })

        app.get('/my-bookings', async (req, res) => {
            const email = req.query.email;
            const result = await bookingCol.find({
                userEmail: email}).toArray();
            res.send(result);
        })
        //my booking details api
        app.get('/my-bookings/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await bookingCol.findOne(query)
            res.send(result);
        })

        // my vehicles api
        app.get('/my-vehicles', async (req, res)=>{
            const email = req.query.email
            const result = await vehicleCol.find({
                userEmail: email}).toArray()
                res.send(result)
        })

        //update vehicle data
        app.put('/all-vehicles/:id', async (req, res)=>{
            const id = req.params.id
            const data = req.body

            const query = { _id: new ObjectId(id) }
            const update = {
                $set : data
            }
            const result = await vehicleCol.updateOne(query, update)

            res.send({
                result
            })
        })

        //delete api
        app.delete('/all-vehicles/:id', async(req, res)=>{
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await vehicleCol.deleteOne(query)

            res.send( result )
        })
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
