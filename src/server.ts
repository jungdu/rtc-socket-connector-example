import socketIo from "socket.io";
import express from "express";

const {addRTCConnectionHandlers} = require("rtc-socket-connector-server");

function startServer(port: number | string) {
	const app = express();

	const server = app.listen(port, () => {
		console.log(`listening on ${port}`);
	});

	const socketServer = new socketIo.Server(server, {
		cors: { origin: "http://localhost" },
	});

	app.get("/", (req, res) => {
		res.send("Hello World!");
	});

	addRTCConnectionHandlers(socketServer, {
		debug: true
	});
}

startServer(process.env.PORT || 5000);
