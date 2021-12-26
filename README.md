# rtc-socket-connector-example
Examples to use WebRTC with [**rtc-socket-connector-client**](https://github.com/jungdu/rtc-socket-connector-client) and [**rtc-socket-connector-server**](https://github.com/jungdu/rtc-socket-connector-server).

Examples
- [WebRTC Connection](https://github.com/jungdu/rtc-socket-connector-example#webrtc-connection)
- [Data Channel](https://github.com/jungdu/rtc-socket-connector-example#data-channel) (Chat)
- [Media Stream](https://github.com/jungdu/rtc-socket-connector-example#media-stream) (Video chat)
- [File Transfer](https://github.com/jungdu/rtc-socket-connector-example#file-transfer) 

# Quick Start 

1. Install dependencies
```
yarn
```

2. Start server
```
yarn start:server
```

3. Start Example Page
```
yarn start:<PAGE NAME>
```

# Example Pages


## WebRTC Connection
Establish connection using RTCPeerConnection.  
See change of connection status in console.  


**Run project**
```
yarn start:web-rtc-connections
```


1. Open two browsers.  

2. Access http://localhost:1234
   
3. Check socket id on the web page.  
   
4. Put socket id of the other browser to input box beside "Target ID"


Open console to see the change of state.  
You can see the messages below if the socket id is valid to connect.
```
connectionstatechange::: socket id:<SOCKET ID> state:connecting
connectionstatechange::: socket id:<SOCKET ID> state:connected
```
Close or refresh one of opened browsers to close connection.
You can see the state change when the connection is lost in console.

```
connectionstatechange::: socket id:<SOCKET ID> state:disconnected
connectionstatechange::: socket id:<SOCKET ID> state:failed
```



## Data Channel
Chat with DataChannel.  

**Run project**
```
yarn start:data-channel
```

1. Open two browsers.  

2. Access http://localhost:1234
   
3. Check socket id on the web page.  
   
4. Put socket id of the other browser to input box beside "Target ID"
   
5. Click CONNECT button. And then SEND button will be enabled to click.
   
6. Put message and click SEND button to send messages.


**Demonstration video**  
[![data-](https://img.youtube.com/vi/sI6HP46tl3c/0.jpg)](https://www.youtube.com/watch?v=sI6HP46tl3c)

## Media Stream
Video chat with WebRTC.

**Run project**
```
yarn start:media-stream
```

1. Open two browsers.  

2. Access http://localhost:1234

3. Check socket id on the web page.  

4. Put socket id of the other browser to input box beside "Target ID"

5. Click CONNECT button. And then you will see the screen from the other browser on the video element on the right side.  

**Demonstration video**  
[![media-stream-video](https://img.youtube.com/vi/KUZl51SP22I/0.jpg)](https://www.youtube.com/watch?v=KUZl51SP22I)

## File Transfer
Connect two browser with WebRTC.  
Upload files and download uploaded files.  


**Run project**
```
yarn start:file-transfer
```


1. Open two browsers.  

2. Access http://localhost:1234

3. Check socket id on the web page.  

4. Put socket id of the other browser to input box beside "Target ID"

5. Click CONNECT button. And then you will see the screen from the other browser on the video element on the right side.  

6. Choose file to upload and click UPLOAD button to upload file.

7. Click DOWNLOAD button to download a file in File List.

**Demonstration video**  
[![file-transfer-video](https://img.youtube.com/vi/znaaHCDrUeE/0.jpg)](https://www.youtube.com/watch?v=znaaHCDrUeE)
