import * as socketIo from "socket.io";
import * as express from "express";

const {addRTCConnectionHandlers} = require("rtc-socket-connector-server");

function startServer(port: number | string) {
	const app = express();

	const server = app.listen(port, () => {
		console.log(`listening on ${port}`);
	});

	const socketServer = new socketIo.Server(server, {
		cors: { origin: "http://localhost:1234" },
	});

	app.get("/", (req: any, res: any) => {
		res.send("Hello World!");
	});

	addRTCConnectionHandlers(socketServer, {
		debug: true
	});
}

startServer(process.env.PORT || 80);
