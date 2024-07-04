import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const OrderForm = ({ balance }) => {
  const [orderType, setOrderType] = useState('BUY LIMIT');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      type: orderType,
      price: parseFloat(price),
      quantity: parseFloat(quantity),
      total: parseFloat(price) * parseFloat(quantity),
      status: 'PENDING',
      pair: 'BTC/USDT' // Change based on selected pair
    };
    socket.emit('new_order', newOrder);
  };

  const handleOrderTypeChange = (e) => {
    setOrderType(e.target.value);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handleSliderChange = (e) => {
    const percentage = parseInt(e.target.value, 10);
    const maxQuantity = balance / parseFloat(price);
    setQuantity((maxQuantity * percentage / 100).toFixed(2));
  };

  return (
    <div>
      <h2>Create Order</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Order Type:
          <select value={orderType} onChange={handleOrderTypeChange}>
            <option value="BUY LIMIT">BUY LIMIT</option>
            <option value="SELL LIMIT">SELL LIMIT</option>
            <option value="MARKET BUY">MARKET BUY</option>
            <option value="MARKET SELL">MARKET SELL</option>
          </select>
        </label>
        <label>
          Price:
          <input type="number" value={price} onChange={handlePriceChange} required />
        </label>
        <label>
          Quantity:
          <input type="number" value={quantity} onChange={handleQuantityChange} required />
        </label>
        <label>
          Total Balance:
          <input
            type="range"
            min="0"
            max="100"
            step="20"
            onChange={handleSliderChange}
          />
        </label>
        <button type="submit">
          {orderType.replace('_', ' ')}
        </button>
      </form>
    </div>
  );
};

export default OrderForm;
