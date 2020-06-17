const express = require('express');
const http = require('http');
const socket = require('socket.io');
const app = express()
const  server = http.createServer(app);

let usuarios =[]


const port = process.env.PORT || 4000
server.listen(port,'0.0.0.0',()=>{
     console.log('Conectado en el puerto:',port)
})


const io = socket.listen(server);

app.get('/',(llamado,respuesta)=>{

respuesta.sendFile(__dirname + "/cliente.html")
})

io.on('connection',(socket)=>{
socket.on('nuevo usuario',(usuario,callback)=>{
if(usuarios.indexOf(usuario)!=-1){callback(false)
}else{callback(true)
socket.usuario = usuario;
usuarios.push(usuario);
actualizarUsuarios();
io.emit('mensaje',{mensaje:'se ha conectado',usuario: socket.usuario})
}
});
socket.on('nuevo mensaje',function(mensaje){

     io.emit('mensaje',{mensaje: mensaje,usuario:socket.usuario})
}
)
function actualizarUsuarios(){

     io.emit('actualizarUsuarios',usuarios);
}

socket.on('disconnect',(data)=>{
     usuarios.splice(usuarios.indexOf(socket.usuario),1)
     io.emit('mensaje',{mensaje:'se ha desconectado',usuario: socket.usuario})
})
})

