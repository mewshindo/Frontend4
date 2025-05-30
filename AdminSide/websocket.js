// filepath: c:\Users\mew\Documents\University\Frontend4\AdminSide\websocket.js
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8081 });

let customers = new Map();
let admins = new Set(); 
wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1]);
    const type = urlParams.get('type');
    const id = urlParams.get('id');

    if (type === 'customer' && id) {
        customers.set(id, ws);
    } else if (type === 'admin') {
        admins.add(ws);
    }

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if (type === 'customer' && data.to === 'admin') {
            admins.forEach(admin => admin.send(JSON.stringify({ from: id, message: data.message })));
        } else if (type === 'admin' && data.to) {
            const customerSocket = customers.get(data.to);
            if (customerSocket) {
                customerSocket.send(JSON.stringify({ from: 'admin', message: data.message }));
            }
        }
    });

    ws.on('close', () => {
        customers.delete(id);
        admins.delete(ws);
    });
});

console.log('WebSocket сервер запущен на: ws://localhost:8081');