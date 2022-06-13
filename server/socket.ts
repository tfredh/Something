// import { WebSocketServer } from "ws";
// import { getParsedJSONObject } from "./utils/helpers";

// const wss = new WebSocketServer({ port: 9999 });

// interface ServerWebSocket extends WebSocket {
//     id?: string;
//     deliver?: (action: string, data: Record<string, any>) => void;
// }

// type SocketRequest = {
//     action: string;
//     payload: any;
// };

// wss.on("connection", function connection(ws: ServerWebSocket) {
//     ws.deliver = function deliver(action, payload) {
//         ws.send(JSON.stringify({ action, payload }));
//     };
//     console.log("connected");

//     ws.addEventListener("message", function incoming(request) {
//         const data = getParsedJSONObject(request.data) as SocketRequest | null;
//         if (data == null) return;

//         socketRequestReceiver(ws, data);
//     });
// });

// function socketRequestReceiver(
//     socket: ServerWebSocket,
//     { action, payload }: SocketRequest
// ): void {
//     switch (action) {
//         case "test":
//             console.log(payload);
//             break;
//         default:
//             console.log("default");
//     }
// }

// console.log("Server started");

// // docs gave
// // wss.on("connection", function connection(ws) {
// //     ws.on("message", function message(data, isBinary) {
// //         wss.clients.forEach(function each(client) {
// //             if (client !== ws && client.readyState === WebSocket.OPEN) {
// //                 client.send(data, { binary: isBinary });
// //             }
// //         });
// //     });
// // });
