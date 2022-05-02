const express=require('express')
const app= express()
require('dotenv').config()
var cors=require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(cors())
app.use(express.json())
require('dotenv').config()

const port =process.env.PORT || 5000

app.get('/',(req,res)=>{
    res.send('successfully');
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4veww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect()
        const productCollection=client.db('assignment11').collection('laptopbrand')
        app.get('/products', async(req,res)=>{
            const query={}
            const abc=productCollection.find(query)
            const result= await abc.toArray();
            res.send(result);
        })
        app.get('/productCount', async(req,res)=>{
            const query={}
             const abc=productCollection.find(query)
             const count= await abc.count();
             res.send({count});
         })

         //---------inventory/:id-----------

         app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);

        });

        //----------------inser item--------------------

        // create a document to insert user
      app.post('/products', async(req,res)=>{
        const newUser=req.body;
        const result = await productCollection.insertOne(newUser);
        res.send(result);
      })

       //------------- Delete Item from manageInventory---------------
       app.delete('/products/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        res.send(result);
    });
       //------------- Delete Item from myItem---------------
       app.delete('/items/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await productCollection.deleteOne(query);
        res.send(result);
    });

     // item Collection API----------

     app.get('/item',  async (req, res) => {
        
        const email = req.query.email;
       
      
            const query = {email:email};
            const cursor = productCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);
        
        
    })

    }finally{

    }
}
run();



app.listen(port,()=>{

    console.log('run port ${port}')
    
    console.log(`run port ${port}`)
})