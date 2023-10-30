require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./database/config');
const cors = require('cors');
const path = require('path');
const socketIO = require('socket.io');
const http = require('http');

//notifications
const webpush = require('web-push');
const bodyParser = require('body-parser');

//crear server de express
const app = express();

const server = require('http').Server(app);

//cors
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

const options = {
    cors: {
        origin: 'http://localhost:4200, http://localhost:5001',
    },
};


//sockets
const io = require('socket.io')(server, options);

io.on('connection', function(socket) {

    const idHandShake = socket.id; //genera un id unico por conexion

    let { nameRoom } = socket.handshake.query;

    // console.log(`${chalk.green(`Nuevo dispositivo: ${handshake}`)} conentado a la ${nameRoom}`);

    console.log(`Hola dispositivo: ${idHandShake} se union a ${nameRoom}`);
    socket.join(nameRoom);


    socket.on('evento', (res) => {
        // const data = res;
        // console.log(res);

        // Emite el mensaje a todos lo miembros de las sala menos a la persona que envia el mensaje   
        socket.to(nameRoom).emit('evento', res); // envia los datos solo a los integrantes de la sala

        // socket.emit(nameRoom).emit('evento', res);//usando emit transmite a todos incluyendo a la persona que envia

    });

    socket.on('message', (msg) => {
        console.log('a user connected');
        console.log('message : ' + msg);
        socket.broadcast.emit('message', msg);
    });

    socket.on('save-carrito', function(data) {
        io.emit('new-carrito', data);
        console.log(data);
    });
    socket.on('save-carrito_dos', function(data) {
        io.emit('new-carrito_dos', data);
        console.log(data);
    });
    socket.on('save-mensaje', function(data) {
        io.emit('new-mensaje', data);
    });
    socket.on('save-formmsm', function(data) {
        io.emit('new-formmsm', data);
    });
    socket.on('save-stock', function(data) {
        io.emit('new-stock', data);
    });


    socket.on('disconnect', function() {
        console.log('user disconnected');
    });
});


//lectura y parseo del body
app.use(express.json());

//db
dbConnection();

//directiorio publico de pruebas de google
app.use(express.static('public'));


//rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/login', require('./routes/auth'));
app.use('/api/todo', require('./routes/busquedas'));
app.use('/api/uploads', require('./routes/uploads'));
app.use('/api/blogs', require('./routes/blog'));
app.use('/api/pages', require('./routes/page'));
app.use('/api/sliders', require('./routes/slider'));

//tienda
app.use('/api/marcas', require('./routes/marcas'));
app.use('/api/categorias', require('./routes/categoria'));
app.use('/api/cursos', require('./routes/curso'));
app.use('/api/productos', require('./routes/producto'));
app.use('/api/colors', require('./routes/color'));
app.use('/api/selectors', require('./routes/selector'));
app.use('/api/carritos', require('./routes/carrito'));
app.use('/api/comentarios', require('./routes/comentario'));
app.use('/api/congenerals', require('./routes/congeneral'));
app.use('/api/contactos', require('./routes/contacto'));
app.use('/api/cupons', require('./routes/cupon'));
app.use('/api/direccions', require('./routes/direccion'));
app.use('/api/galerias', require('./routes/galeria'));
app.use('/api/galeriavideos', require('./routes/galeriavideo'));
app.use('/api/ingresos', require('./routes/ingreso'));
app.use('/api/postals', require('./routes/postal'));
app.use('/api/tickets', require('./routes/ticket'));
app.use('/api/ventas', require('./routes/venta'));
app.use('/api/promocions', require('./routes/promocion'));
app.use('/api/shippings', require('./routes/shipping'));
app.use('/api/pickups', require('./routes/pickup'));
app.use('/api/payments', require('./routes/tipopago'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/videocursos', require('./routes/videocurso'));

app.use(bodyParser.json());

//notification
const vapidKeys = {
    "publicKey": "BOD_CraUESbh9BhUEccgqin8vbZSKHAziTtpqvUFl8B8LO9zrMnfbectiViqWIsTLglTqEx3c0XsmqQQ5A-KALg",
    "privateKey": "34CA-EpxLdIf8fmJBj2zoDg5OIQIvveBcu7zWkTkPnw"
};

webpush.setVapidDetails(
    'mailto:example@youremail.com',
    vapidKeys.publicKey,
    vapidKeys.privateKey,

);
//notification


//lo ultimo
// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public/index.html')); //ruta para produccion, evita perder la ruta
// });


server.listen(process.env.PORT, () => {
    console.log('Servidor en puerto: ' + process.env.PORT);
});