// Conectar con el servidor de WebSocket
const socket = io();

// Referencia al elemento de la lista en el HTML
const contractList = document.getElementById('contractList');

// Función para actualizar la lista en el HTML
function updateContractList(data) {
    const li = document.createElement('li');
    li.textContent = `Contrato: ${data.mensaje}`;
    contractList.appendChild(li);
}

// Escucha el evento enviado desde el servidor
socket.on('evento_servidor', (data) => {
    console.log('Evento recibido desde el servidor:', data);

    // Actualizar la lista con los datos recibidos
    updateContractList(data);
});

