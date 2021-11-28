const express = require('express')
const Msg=require('./modals/message')
const mongoose=require('mongoose')
const app = express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 8000
const url='mongodb://localhost/message-database';

mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
    console.log("connected to database");
}).catch(err=>{
    console.log(err);
})
var db = mongoose.connection;

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        const message=new Msg({msg})
        message.save(msg).then(()=>{
            console.log(message)
        });
        socket.broadcast.emit('message', msg) 
          
    })

})