import React, { useState } from 'react';
import { placeOrder } from './services/apiService';
import PriceChart from './components/PriceChart';
import OrderBook from './components/OrderBook';
import OrderForm from './components/OrderForm';
import Balance from './components/Balance';

const App = () => {
  const [balances, setBalances] = useState({});

  const handleOrderPlaced = async (order) => {
    try {
      await placeOrder(order);
      // Update balances and order book
      // Fetch updated balances from the backend
      console.log('Order placed successfully');
    } catch (error) {
      console.error('Failed to place order', error);
    }
  };

  return (
    <div className="App">
      <PriceChart />
      <OrderBook />
      {/* <OrderForm onOrderPlaced={handleOrderPlaced} /> */}
      <Balance balances={balances} />
    </div>
  );
};

export default App;
