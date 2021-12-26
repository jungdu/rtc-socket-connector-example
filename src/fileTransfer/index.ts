import { io } from "socket.io-client";
import {
	createRTCConnectionManager,
	RTCConnectionHandler,
} from "rtc-socket-connector-client";
import { DataChannelMessages } from "./types";

const CHUNK_SIZE = 16384;

function main() {
	// Get HTML ELements
	const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
	const connectedSocketIdSpan = document.getElementById(
		"connectedSocketId"
	) as HTMLSpanElement;
	const fileInput = document.getElementById("fileInput") as HTMLInputElement;
	const fileList = document.getElementById("fileList") as HTMLUListElement;
	const socketIdSpan = document.getElementById("socketId") as HTMLSpanElement;
	const targetInput = document.getElementById(
		"targetInput"
	) as HTMLInputElement;
	const uploadFileBtn = document.getElementById(
		"uploadFileBtn"
	) as HTMLButtonElement;

  // 1. Connect to socket.io server
	const socket = io("http://localhost:5000");
	socket.on("connect", handleSocketConnect);

	let dataChannel: RTCDataChannel | null = null;
	let rtcPeerConnection: RTCPeerConnection | null = null;

	const files: {
		[fileName: string]: File;
	} = {};
	const downloadBuffer: {
		[fileName: string]: ArrayBuffer[];
	} = {};

  // 2. Define RTCConnectionHandler
	const rtcConnectionHandler: RTCConnectionHandler = {
		onDataChannel: handleOnDataChannel,
		onRTCPeerConnection: handleOnRTCPeerConnection,
	};

  // 3. Create RTCConnectionManager
	const rtcConnectionManager = createRTCConnectionManager(
		socket,
		rtcConnectionHandler
	);

	connectBtn.addEventListener("click", handleClickConnect);
	uploadFileBtn.addEventListener("click", handleClickUpload);

	function handleClickConnect() {
    // 4. Connect to another client
		rtcConnectionManager.connect(targetInput.value, {
			enableDataChannel: true,
		});
	}

	function handleClickUpload() {
		if (fileInput.files && fileInput.files.length > 0) {
			const file = fileInput.files[0];

			files[file.name] = file;
			addFileInList(file.name, false);
			sendMessage({
				type: "UploadFile",
				fileName: file.name,
			});
		} else {
			alert("Choose file to upload");
		}
	}

	function handleOnDataChannel(
		socketId: string,
		newDataChannel: RTCDataChannel
	) {
		connectedSocketIdSpan.textContent = socketId;
		connectBtn.disabled = true;

		if (newDataChannel.label === "main") {
			dataChannel = newDataChannel;

			dataChannel.addEventListener("message", function (event) {
				const message: DataChannelMessages = JSON.parse(event.data);
				switch (message.type) {
					case "StartDownloadFile":
						uploadFile(message.fileName);
						break;
					case "UploadFile":
						addFileInList(message.fileName, true);
						break;
					default:
						throw new Error("Invalid Message Type");
				}
			});
		} else {
			const fileName = newDataChannel.label;
			downloadBuffer[fileName] = [];

			newDataChannel.addEventListener("message", function (event) {
				downloadBuffer[fileName].push(event.data);
			});

			newDataChannel.addEventListener("close", function () {
				downloadFile(fileName);
				downloadBuffer[fileName] = [];
			});
		}
	}

	function handleOnRTCPeerConnection(
		socketId: string,
		newRTCPeerConnection: RTCPeerConnection
	) {
		rtcPeerConnection = newRTCPeerConnection;
	}

	function handleSocketConnect() {
		socketIdSpan.textContent = socket.id;
	}

	function addFileInList(fileName: string, downloadable: boolean) {
		const item = document.createElement("li") as HTMLLIElement;
		const button = document.createElement("button") as HTMLButtonElement;

		button.addEventListener("click", () => {
			startDownloadFile(fileName);
		});

		item.textContent = fileName;
		button.textContent = "DOWNLOAD";

		if (!downloadable) {
			button.disabled = true;
		}

		item.append(button);
		fileList.append(item);
	}

	function downloadFile(fileName: string) {
		if (downloadBuffer[fileName]) {
			const url = window.URL.createObjectURL(
				new Blob(downloadBuffer[fileName])
			);
			const a = document.createElement("a");

			a.style.display = "none";
			a.href = url;
			a.download = fileName;
			document.body.appendChild(a);
			a.click();
			setTimeout(() => {
				document.body.removeChild(a);
				window.URL.revokeObjectURL(url);
			}, 100);
		} else {
			throw new Error("Require buffer to download");
		}
	}

	function sendMessage(message: DataChannelMessages) {
		if (dataChannel) {
			dataChannel.send(JSON.stringify(message));
		} else {
			throw new Error("Require dataChannel to send message");
		}
	}

	function startDownloadFile(fileName: string) {
		sendMessage({
			type: "StartDownloadFile",
			fileName,
		});
	}

	function uploadFile(fileName: string) {
		const file = files[fileName];
		if (rtcPeerConnection) {
			const fileDataChannel = rtcPeerConnection.createDataChannel(fileName);
			fileDataChannel.binaryType = "arraybuffer";
			fileDataChannel.addEventListener("open", () => {
				const fileReader = new FileReader();
				let offset = 0;

				fileReader.addEventListener("load", (event) => {
					if (
						event &&
						event.target &&
						event.target.result &&
						event.target.result instanceof ArrayBuffer
					) {
						fileDataChannel.send(event.target.result);

						offset += event.target.result.byteLength;

						if (offset < file.size) {
							readSliceBlob(offset);
						} else {
							fileDataChannel.close();
						}
					}
				});
				readSliceBlob(0);

				function readSliceBlob(offset: number) {
					const slicedBlob = file.slice(offset, offset + CHUNK_SIZE);
					fileReader.readAsArrayBuffer(slicedBlob);
				}
			});
		} else {
			throw new Error("Require rtcPeerConnection to create DataChannel");
		}
	}
}

main();
