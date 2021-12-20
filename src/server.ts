const socketIo = require("socket.io");
const express = require("express");
const {addRTCConnectionHandlers} = require("rtc-socket-connector-server");

function startServer(port: number | string) {
	const app = express();

	const server = app.listen(port, () => {
		console.log(`listening on ${port}`);
	});

	const socketServer = new socketIo.Server(server, {
		cors: { origin: "http://localhost:1234" },
	});

	addRTCConnectionHandlers(socketServer, {
		debug: true
	});
}

startServer(process.env.PORT || 5000);
