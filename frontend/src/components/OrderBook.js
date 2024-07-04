import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const OrderBook = () => {
  const [orders, setOrders] = useState([]);
  const [timeFrame, setTimeFrame] = useState('1min');
  const [pair, setPair] = useState('BTC/USDT');

  useEffect(() => {
    socket.on('order_update', (newOrder) => {
      setOrders((prevOrders) => {
        const updatedOrders = [...prevOrders];
        const index = updatedOrders.findIndex((order) => order.id === newOrder.id);
        if (index > -1) {
          updatedOrders[index] = newOrder;
        } else {
          updatedOrders.push(newOrder);
        }
        return updatedOrders;
      });
    });

    return () => {
      socket.off('order_update');
    };
  }, []);

  useEffect(() => {
    fetch(`/api/orders?pair=${pair}`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error('Failed to fetch orders:', err));
  }, [pair]);

  const handleTimeFrameChange = (e) => {
    setTimeFrame(e.target.value);
  };

  const handlePairChange = (e) => {
    setPair(e.target.value);
  };

  return (
    <div>
      <h2>Order Book</h2>
      <div>
        <label>
          Pair:
          <select value={pair} onChange={handlePairChange}>
            <option value="BTC/USDT">BTC/USDT</option>
            <option value="ETH/BTC">ETH/BTC</option>
            <option value="LTC/USDT">LTC/USDT</option>
            <option value="XRP/USDT">XRP/USDT</option>
          </select>
        </label>
        <label>
          Time Frame:
          <select value={timeFrame} onChange={handleTimeFrameChange}>
            <option value="1min">1min</option>
            <option value="5min">5min</option>
            <option value="15min">15min</option>
            <option value="1h">1h</option>
            <option value="12h">12h</option>
          </select>
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Order Type</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.type}</td>
              <td>{order.price}</td>
              <td>{order.quantity}</td>
              <td>{order.total}</td>
              <td>{order.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderBook;
