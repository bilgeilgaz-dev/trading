import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const placeOrder = async (order) => {
  try {
    const response = await axios.post(`${API_URL}/place-order`, order);
    return response.data;
  } catch (error) {
    console.error('Error placing order:', error);
    throw error;
  }
};
