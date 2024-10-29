module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado');
        
        // Escucha el evento 'evento_cliente' de una página
        socket.on('evento_cliente', (data) => {
          console.log('Evento recibido desde el cliente: ', data);
          
          // Envía el evento a todos los demás clientes conectados
          socket.broadcast.emit('evento_servidor', data);
        });
      
        socket.on('disconnect', () => {
          console.log('Usuario desconectado');
        });
      });
};
