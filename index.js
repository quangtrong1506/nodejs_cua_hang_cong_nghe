const PORT = process.env.PORT || 5050;
const app = express();
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import 'express-async-errors';
import fileupload from 'express-fileupload';
import { createServer } from 'http';
import { Server } from 'socket.io';
import IndexController from './app/Http/Controllers/IndexController.mjs';
import SocketServerHandler from './app/Socket/SocketServerHandler.js';
import db from './config/database.mjs';
import './loadEnvironment.mjs';
import router from './routes/index.js';

// connect db
db.connect();

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileupload());
// Load routes
app.all('/', IndexController.index);
router(app);
app.all('*', IndexController.error);

// Global error handling
app.use((err, _req, res, _next) => {
    res.json({
        status_code: 500,
        message: err.message,
    });
});
// socket io
const httpServer = createServer(app);
// handle socket
const socketIOServer = new Server(httpServer, {
    cors: {
        origin: [
            process.env.SOCKET_IO_CLIENT,
            process.env.SOCKET_IO_ADMIN_CLIENT,
        ],
    },
});
const socketServerHandler = new SocketServerHandler();
socketServerHandler.handle();
export { socketIOServer, socketServerHandler };

//Start server
httpServer.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
