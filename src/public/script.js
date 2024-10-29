const socket = io ()


// Escucha el evento enviado desde el servidor
socket.on('evento_servidor', (data) => {
  if (!angVel) angVel = rand(0.25, 0.45);  // Establece una velocidad aleatoria para el giro
  spinButtonClicked = true;  // Marca que se ha activado el giro
});


