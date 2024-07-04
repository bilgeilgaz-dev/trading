import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { subscribeToPriceUpdates, disconnectSocket } from '../services/socketService';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const pairs = {
  btcUsdt: 'BTC/USDT',
  ethBtc: 'ETH/BTC',
  ltcUsdt: 'LTC/USDT',
  xrpUsdt: 'XRP/USDT',
};

const PriceChart = () => {
  const [selectedPairs, setSelectedPairs] = useState(Object.keys(pairs)); // Initially show all pairs
  const [data, setData] = useState({
    btcUsdt: [],
    ethBtc: [],
    ltcUsdt: [],
    xrpUsdt: []
  });

  useEffect(() => {
    const handlePriceUpdate = (update) => {
      console.log('tradingChart update', update);
      Object.keys(update).forEach(pair => {
        setData(prevData => ({
          ...prevData,
          [pair]: [...prevData[pair], { time: new Date().toLocaleTimeString(), price: update[pair].price }]
        }));
      });
    };

    subscribeToPriceUpdates(handlePriceUpdate);

    return () => {
      disconnectSocket();
    };
  }, []);

  useEffect(() => {
    // Reset data for all pairs whenever selectedPairs changes
    const initialData = {
      btcUsdt: [],
      ethBtc: [],
      ltcUsdt: [],
      xrpUsdt: []
    };
    setSelectedPairs(Object.keys(pairs)); // Initially show all pairs
    setData(initialData);
  }, []);

  const getBorderColor = (pair) => {
    switch (pair) {
      case 'btcUsdt':
        return 'rgba(75, 192, 192, 1)';
      case 'ethBtc':
        return 'rgba(153, 102, 255, 1)';
      case 'ltcUsdt':
        return 'rgba(255, 159, 64, 1)';
      case 'xrpUsdt':
        return 'rgba(255, 99, 132, 1)';
      default:
        return 'rgba(75, 192, 192, 1)';
    }
  };

  const chartData = {
    labels: data[selectedPairs[0]] ? data[selectedPairs[0]].map(item => item.time) : [],
    datasets: selectedPairs.map(pair => ({
      label: pairs[pair],
      data: data[pair].map(item => item.price),
      fill: false,
      borderColor: getBorderColor(pair),
      tension: 0.1
    })),
  };

  const handlePairChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedPairs(selected);
  };

  return (
    <div>
      <h1>Real-Time Price Chart</h1>
      <Line data={chartData} />
    </div>
  );
};

export default PriceChart;
