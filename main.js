//   Modules require 
const express=require('express')
const app=express()
const fileupload=require('express-fileupload')
const terminal=require('child_process')
const fs=require('fs')
const https=require('https')
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Project Global variables 
var version='1.0.0'
var port=3000
var storage=__dirname+'/received'
var animelist=[]
// server modules to use



app.use(express.urlencoded({extended:true}))

app.use(express.static(__dirname+'/'))



var userCount=0
var users=[]

io.on('connection', (socket) => {
  console.log('a user connected');
  
  users.push({id:socket.id})
  io.emit("user updates",users)
  
  socket.on("file loaded",(msg)=>{
    users.forEach(user=>{
      if(socket.id==user.id){
        user.fileName=msg
      }
    })
    io.emit("user updates",users)
  })
  
  socket.on("play",(msg)=>{
    io.emit("play",msg)
    console.log(msg+"play")
  })
  
  socket.on("pause",(msg)=>{
    io.emit("pause",msg)
    console.log(msg+"pause")
  })
  
  
  
  socket.on('disconnect', () => {
    let newUsers=[]
     users.forEach(user=>{
      if(socket.id==user.id){
        
      }else{
        newUsers.push(user)
      }
    })
    users=newUsers
    
    io.emit("user updates",users)
    console.log('user disconnected');
  });
});








// fs.readFile('anime.txt','utf-8',(e,o)=>{
//      if (e) {
//       console.log(e)
//      }else{
//         console.log('Loaded list ******* * ** * * *')
//         animelist=JSON.parse(o)
//       }
// })




app.get('/',(req,res)=>{
	
	res.sendFile(__dirname+'/index.html')
})

// app.post('/create',(req,res)=>{	

// 	var roomId= Math.floor(100000 + Math.random() * 900000)
// 	var roomFile=roomId+'.txt'

// 	fs.writeFile(__dirname+"/rooms/"+roomFile,Date.now(),(e)=>{
//         if (e) {console.log(e)}
//           else {
            
//             console.log('registered profile')
//           }
//        })
// 	res.send({url:'/ok'})
// })


app.get('/ok',(req,res)=>{
	res.send('ok')
})


server.listen(port, () => {
  console.log('listening on *:'+port);
});
