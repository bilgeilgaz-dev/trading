import React, { useState } from 'react';

const OrderForm = ({ onOrderPlaced }) => {
  const [order, setOrder] = useState({
    pair: 'BTC/USDT',
    type: 'buy',
    amount: 0,
  });

  const handleChange = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onOrderPlaced(order);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Pair:
        <select name="pair" value={order.pair} onChange={handleChange}>
          <option value="BTC/USDT">BTC/USDT</option>
          <option value="ETH/BTC">ETH/BTC</option>
          <option value="LTC/USDT">LTC/USDT</option>
          <option value="XRP/USDT">XRP/USDT</option>
        </select>
      </label>
      <label>
        Type:
        <select name="type" value={order.type} onChange={handleChange}>
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </label>
      <label>
        Amount:
        <input type="number" name="amount" value={order.amount} onChange={handleChange} />
      </label>
      <button type="submit">Place Order</button>
    </form>
  );
};

export default OrderForm;
