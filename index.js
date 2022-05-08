const express=require('express')
const app= express()
require('dotenv').config()
var cors=require('cors')
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');



app.use(cors())
app.use(express.json())
require('dotenv').config()

const port =process.env.PORT || 5000


///-------jwt task---------
function verifyJWT(req,res,next){
    const authHeader=req.headers.authorization;
   
   if(!authHeader){
       return res.status(401).send({message:'unauthorized access'})
   }
   const token=authHeader.split(' ')[1];
   jwt.verify(token,process.env.DB_TOKEN_SECRET,(err,decoded)=>{
       if(err){
        return res.status(403).send({ message: 'Forbidden access' });
       }
   
    console.log('decoded', decoded);
   req.decoded = decoded;
    next();
})

}
app.get('/',(req,res)=>{
    res.send('successfully run');
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4veww.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run(){
    try{
        await client.connect()
        const productCollection=client.db('assignment11').collection('laptopbrand')
        const addressCollection=client.db('assignment11').collection('contactinfo')
        
        //Authenticate jwt
        app.post('/login',async(req,res)=>{
            const user=req.body;
            const accessToken = jwt.sign(user, process.env.DB_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.send({ accessToken });
        })

    
    //api all products    
        app.get('/products', async(req,res)=>{
            const query={}
            const abc=productCollection.find(query)
            const result= await abc.toArray();
            res.send(result);
        })
        

         //---------inventory/:id-----------

         app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);

        });

        //----------------insert item--------------------

        
      app.post('/products', async(req,res)=>{
        const newItem=req.body;
        const result = await productCollection.insertOne(newItem);
        res.send(result);
      })

      //----------------insert item--------------------

      app.post('/contactform', async(req,res)=>{
        const addressInfo=req.body;
        const result = await  addressCollection.insertOne(addressInfo);
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

     app.get('/item', verifyJWT, async (req, res) => {
        const decodedEmail = req.decoded.email;
        const email = req.query.email;
        if (email === decodedEmail){
            const query = {email:email};
            const cursor = productCollection.find(query);
            const items = await cursor.toArray();
            res.send(items);

        } else{
            res.status(403).send({message: 'forbidden access'})
        }
      
            
        
        
    })


    // update delivered--------------------
    app.put('/products/:id', async(req, res) =>{
        const id = req.params.id;
        const delivered = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                quantity: delivered.quantity,
                
            }
        };
        const result = await productCollection.updateOne(filter, updatedDoc, options);
        res.send(result);

    })
    // Quantity add with old quantity--------------------
    app.put('/quantity/:id', async(req, res) =>{
        const id = req.params.id;
        const addQuantity = req.body;
        const filter = {_id: ObjectId(id)};
        const options = { upsert: true };
        const updatedDoc = {
            $set: {
                quantity: addQuantity.quantity,
                
            }
        };
        const result = await productCollection.updateOne(filter, updatedDoc, options);
        res.send(result);

    })

    ///------------count toatal product--------------

    app.get('/productCount', async(req,res)=>{
        

        const count = await productCollection.estimatedDocumentCount();
        res.send({count});
     })


    

    //last finally complete

    }finally{

    }
}
run();



app.listen(port,()=>{

    console.log('run port ${port}')
    
    console.log(`run port ${port}`)
})