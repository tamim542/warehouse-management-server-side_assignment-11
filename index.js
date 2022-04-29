const express=require('express')
const app= express()
require('dotenv').config()
var cors=require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');


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


    }finally{

    }
}
run();



app.listen(port,()=>{

    console.log('run port ${port}')
    
    console.log(`run port ${port}`)
})