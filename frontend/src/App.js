import React, { useState } from 'react';
import { placeOrder } from './services/apiService';
import PriceChart from './components/PriceChart';
import OrderBook from './components/OrderBook';
import OrderForm from './components/OrderForm';

const App = () => {
  const [balance, setBalance] = useState(10000); // Example initial balance

  const handleBalanceChange = (e) => {
    setBalance(parseFloat(e.target.value));
  };

  return (
    <div>
      <h2>Crypto Trading Simulator</h2>
      <div>
        <label>
          Initial Balance (USDT):
          <input
            type="number"
            value={balance}
            onChange={handleBalanceChange}
            min="0"
            step="0.01"
          />
        </label>
      </div>
      <PriceChart />
      <OrderBook />
      <OrderForm balance={balance} />
    </div>
  );
};

export default App;
