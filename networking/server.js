function start_server() {
    net = require('net');

    // Keep track of the producers
    var producers = [];

    // Start a TCP Server
    net.createServer(function (socket) {
      socket.name = socket.remoteAddress + ":" + socket.remotePort 
      producers.push(socket);

      // Acknowledge the new member
      socket.write("Welcome " + socket.name + "\n");
      broadcast(socket.name + " joined the chat\n", socket);

      // Handle incoming messages from producers.
      socket.on('data', function (data) {
        broadcast(socket.name + "> " + data, socket);
      });

      // Remove the producer from the list when it leaves
      socket.on('end', function () {
        producers.splice(producers.indexOf(socket), 1);
        broadcast(socket.name + " left the chat.\n");
      });
      
      // Send a message to all producers
      function broadcast(message, sender) {
        producers.forEach(function (producer) {
          // Don't want to send it to sender
          if (producer === sender) return;
          producer.write(message);
        });
        // Log it to the server output too
        process.stdout.write(message)
      }

    }).listen(5000);

    // Put a friendly message on the terminal of the server.
    console.log("Chat server running at port 5000\n");
}
