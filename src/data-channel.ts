import { io } from "socket.io-client";
import {
	createRTCConnectionManager,
	RTCConnectionHandler,
	RTCConnectionManager,
} from "rtc-socket-connector-client";

function main() {
	// HTML ELements
	const connectedSocketId = document.getElementById(
		"connectedSocketId"
	) as HTMLSpanElement;
	const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
	const messageInput = document.getElementById(
		"messageInput"
	) as HTMLInputElement;
	const sendBtn = document.getElementById("sendBtn") as HTMLButtonElement;
	const messageList = document.getElementById("messageList") as HTMLDivElement;

	// 1. Connect to socket.io server
	const socket = io("http://localhost:5000");
	socket.on("connect", handleSocketConnect);

	let rtcConnectionManager: RTCConnectionManager;
	let dataChannel: RTCDataChannel | null = null;

	// 2. Define RTCConnectionHandler
	const handler: RTCConnectionHandler = {
		onDataChannel: handleOnDataChannel,
	};

	// 3. Create RTCConnectionManager
	rtcConnectionManager = createRTCConnectionManager(socket, handler);

	// Add button handlers
	connectBtn.addEventListener("click", handleClickConnectBtn);
	sendBtn.addEventListener("click", handleClickSendMessageBtn);

	// Functions
	function addMessage(message: string) {
		const elem = document.createElement("p");
		elem.innerHTML = message;
		messageList.appendChild(elem);
	}

	function connectWebRTC(
		rtcConnectionManager: RTCConnectionManager,
		targetId: string
	) {
		rtcConnectionManager.connect(targetId, {
			enableDataChannel: true,
		});
	}

	// Handlers
	function handleClickConnectBtn() {
		const targetInput = document.getElementById(
			"targetInput"
		) as HTMLInputElement;

		// 4. Connect to another client
		connectWebRTC(rtcConnectionManager, targetInput.value);
	}

	function handleOnDataChannel(
		socketId: string,
		newDataChannel: RTCDataChannel
	) {
		connectedSocketId.textContent = socketId;
		sendBtn.disabled = false;
		connectBtn.disabled = true;
		dataChannel = newDataChannel;

		dataChannel.addEventListener("message", handleDataChannelMessage);
		dataChannel.addEventListener("close", handleDataChannelClose);

		function handleDataChannelMessage(event: MessageEvent<string>) {
			addMessage(`<b>${socketId}:</b> ${event.data}`);
		}

		function handleDataChannelClose() {
			console.log("close");
			connectedSocketId.textContent = "null";
			sendBtn.disabled = true;
			connectBtn.disabled = false;
			dataChannel = null;
		}
	}

	function handleSocketConnect() {
		const socketIdSpan = document.getElementById("socketId") as HTMLSpanElement;
		socketIdSpan.textContent = socket.id;
	}

	function handleClickSendMessageBtn() {
		if (!dataChannel) {
			throw new Error("Requires DataChannel to send");
		}

		const message = messageInput.value;
		dataChannel.send(message);
		addMessage(`<b>me:</b> ${message}`);
	}
}

main();
