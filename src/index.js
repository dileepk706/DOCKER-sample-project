const express = require('express');
const app = express();
const db = require('./persistence');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
require('dotenv').config();
const updateItem = require('./routes/updateItem');
const mongoose=require('mongoose')
const deleteItem = require('./routes/deleteItem');

console.log('process.env.MONGODB_URI',process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || '')
.then(response=>{
 console.log('mongodb connected');
}).catch(err=>{
 console.log(`error happened when connecting mongodb : ${err}`);
})


const  Schema = mongoose.Schema;
const  userShema = new Schema({
  name: {
    type: String,
    trim:true
  },
  email: {
    type: String,
    trim:true,
  },
  password: {
    type: String,
    trim:true,
  },
  image:{
    type:String,
    default:null
  },
  isAdmin:{
    type:Boolean,
    default:false
  }
},{timestamps : true});
 
const user = mongoose.model('user', userShema);




app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem); 
app.delete('/items/:id', deleteItem);

app.get('/user',async (req,res)=>{
    const data=process.env.DATA || 'No env file'
    const User=await user.find()
    const html=User.map(e=>(
      `<h1>${e.name}</h1><br/>`
    ))
    res.send(html)
})
const PORT=process.env.PORT || 3000
db.init().then(() => {
    app.listen(PORT, () => console.log('Listening on port '+PORT));
}).catch((err) => {
    console.error(err);
    process.exit(1);
});

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
