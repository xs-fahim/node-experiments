# WebSocket Demo

This project demonstrates a simple WebSocket server using Express and Socket.io.

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/)

## Getting Started

Follow these steps to run the WebSocket demo:

1. **Clone the repository:**

   ```sh
   git clone <repository-url>
   cd websocket-demo
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Run the server:**

   You can run the server in development mode using `nodemon`:

   ```sh
   npm run dev
   ```

   Or you can run the server in production mode:

   ```sh
   npm start
   ```

4. **Access the demo:**

   Open your web browser and navigate to [http://localhost:8080](http://localhost:8080). You should see a page with the title "Socket.io Demo".

5. **See the server message:**

   The server sends a message to the client every 3 seconds. You can see these messages displayed on the page under the "Socket.io Demo" heading.

## Project Structure

- [`server.js`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fserver.js%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/Users/xpeedstudio/Workspace/GitHub/node-experiments-fahim/websocket-demo/server.js"): The main server file that sets up the Express server and Socket.io.
- [`static/`](command:_github.copilot.openSymbolFromReferences?%5B%22static%2F%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fserver.js%22%2C%22external%22%3A%22file%3A%2F%2F%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fserver.js%22%2C%22path%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fserver.js%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A8%2C%22character%22%3A16%7D%7D%5D%5D "Go to definition"): Contains the static files served by the server.
  - [`index.html`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo-client%2Fpublic%2Findex.html%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/Users/xpeedstudio/Workspace/GitHub/node-experiments-fahim/websocket-demo-client/public/index.html"): The HTML file for the demo.
  - [`main.js`](command:_github.copilot.openSymbolFromReferences?%5B%22main.js%22%2C%5B%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fpackage.json%22%2C%22external%22%3A%22file%3A%2F%2F%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fpackage.json%22%2C%22path%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fpackage.json%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A3%2C%22character%22%3A3%7D%7D%2C%7B%22uri%22%3A%7B%22%24mid%22%3A1%2C%22fsPath%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fstatic%2Findex.html%22%2C%22external%22%3A%22file%3A%2F%2F%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fstatic%2Findex.html%22%2C%22path%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2Fstatic%2Findex.html%22%2C%22scheme%22%3A%22file%22%7D%2C%22pos%22%3A%7B%22line%22%3A11%2C%22character%22%3A17%7D%7D%5D%5D "Go to definition"): The JavaScript file that handles the client-side Socket.io connection.

## Environment Variables

You can configure the server port by creating a [`.env`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%2F.env%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/Users/xpeedstudio/Workspace/GitHub/node-experiments-fahim/websocket-demo/.env") file in the [`websocket-demo`](command:_github.copilot.openRelativePath?%5B%7B%22scheme%22%3A%22file%22%2C%22authority%22%3A%22%22%2C%22path%22%3A%22%2FUsers%2Fxpeedstudio%2FWorkspace%2FGitHub%2Fnode-experiments-fahim%2Fwebsocket-demo%22%2C%22query%22%3A%22%22%2C%22fragment%22%3A%22%22%7D%5D "/Users/xpeedstudio/Workspace/GitHub/node-experiments-fahim/websocket-demo") directory with the following content:

```env
PORT=8080
```
