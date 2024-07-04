const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');
const amqplib = require('amqplib/callback_api');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const orderQueue = 'orderQueue';
const orders = []; // In-memory store for orders

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

amqplib.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }
  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }
    const queue = 'orderQueue';

    channel.assertQueue(queue, {
      durable: true
    });

    app.post('/place-order', (req, res) => {
      const order = req.body;
      order.id = `${Date.now()}-${Math.random()}`;
      order.status = 'PENDING';
      orders.push(order);
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(order)));
      io.emit('order_update', order);
      res.send('Order placed');
    });

    channel.consume(queue, (msg) => {
      const order = JSON.parse(msg.content.toString());
      const orderIndex = orders.findIndex((o) => o.id === order.id);

      if (orderIndex !== -1) {
        orders[orderIndex].status = 'FILLED';
        io.emit('order_update', orders[orderIndex]);
      }
      channel.ack(msg);
    });
  });
});

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const fetchRealTimeData = async (pair) => {
  try {
    const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching real-time data:', error.message);
    return null;
  }
};

setInterval(async () => {
  try {
    const btcUsdt = await fetchRealTimeData('BTCUSDT');
    const ethBtc = await fetchRealTimeData('ETHBTC');
    const ltcUsdt = await fetchRealTimeData('LTCUSDT');
    const xrpUsdt = await fetchRealTimeData('XRPUSDT');

    if (btcUsdt && ethBtc && ltcUsdt && xrpUsdt) {
      io.emit('priceUpdate', { btcUsdt, ethBtc, ltcUsdt, xrpUsdt });
    } else {
      console.error('Failed to fetch one or more prices');
    }
  } catch (error) {
    console.error('Error fetching real-time data:', error.message);
  }
}, 5000);

server.listen(4000, () => console.log('Server is running on port 4000'));
