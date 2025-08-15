import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';  
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';  
import parcelIcon from '../../assets/parcel_icon.png';  // fix

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        url + '/api/order/userOrders',
        {},
        { headers: { token } }
      );
      console.log("API Response:", response.data);
      setData(response.data.data);
      console.log(response.data);  // Check response data
    } catch (error) {
      console.error("Error fetching orders: ", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className='container'>
        {/* Check if data exists and is an array */}
        {Array.isArray(data) && data.length > 0 ? (
          data.map((order, index) => (
            <div key={index} className='my-orders-order'>
              <img src={parcelIcon} alt="Order Icon" />
              <p>
                {order.items.map((item, index) => {
                  if (index === order.items.length - 1) {
                    return item.name + ' X ' + item.quantity;
                  } else {
                    return item.name + ' X ' + item.quantity + ', ';
                  }
                })}
              </p>
              <p className='order-amount'>₹{order.amount}</p>
              <p className='order-items'>Items: {order.items.length}</p>
              <p className='order-status'><b>Status: {order.status}</b></p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
