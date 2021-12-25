import { createRTCConnectionManager, RTCConnectionHandler } from "rtc-socket-connector-client"
import {io} from "socket.io-client"

function main(){
  const connectedSocketId = document.getElementById("connectedSocketId") as HTMLSpanElement;
  const connectBtn = document.getElementById("connectBtn") as HTMLButtonElement;
  const targetInput = document.getElementById("targetInput") as HTMLInputElement;
  const socketId = document.getElementById("socketId") as HTMLSpanElement;

  const socket = io("http://localhost:5000");
  socket.on("connect", handleSocketConnect);

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

  const rtcConnectionManager = createRTCConnectionManager(socket, rtcConnectionHandler);

  connectBtn.addEventListener('click', () => {
    rtcConnectionManager.connect(targetInput.value, {
      enableDataChannel: true
    });
  });


  function handleSocketConnect (){
    socketId.textContent = socket.id;
  };
}

main();