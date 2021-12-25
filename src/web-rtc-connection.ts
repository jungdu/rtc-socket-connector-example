import { createRTCConnectionManager, RTCConnectionHandler } from "rtc-socket-connector-client"
import {io} from "socket.io-client"

function main(){
  // Get HTML elements
  const connectedSocketId = document.getElementById("connectedSocketId") as HTMLSpanElement;
  const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
  const targetInput = document.getElementById("targetInput") as HTMLInputElement;
  const socketId = document.getElementById("socketId") as HTMLSpanElement;

  // 1. Connect to socket.io server
  const socket = io("http://localhost:5000");
  socket.on("connect", handleSocketConnect);

  // 2. Define RTCConnectionHandler
  const rtcConnectionHandler: RTCConnectionHandler = {
    onRTCPeerConnection: (socketId, rtcPeerConnection) => {
      rtcPeerConnection.addEventListener("connectionstatechange", () => {
        console.log(`connectionstatechange::: socket id:${socketId} state:${rtcPeerConnection.connectionState}`)
        if(rtcPeerConnection.connectionState === "connected"){
          connectedSocketId.textContent = socketId;
        }
      })
    }
  }

  // 3. Create RTCConnectionManager
  const rtcConnectionManager = createRTCConnectionManager(socket, rtcConnectionHandler);

  connectBtn.addEventListener('click', () => {
    // 4. Connect to another client
    rtcConnectionManager.connect(targetInput.value, {
      enableDataChannel: true
    });
  });


  function handleSocketConnect (){
    socketId.textContent = socket.id;
  };
}

main();