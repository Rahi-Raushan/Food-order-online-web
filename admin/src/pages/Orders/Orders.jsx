import React from 'react'
import './Orders.css'
import { useState } from 'react'
import { toast } from "react-toastify"
import { useEffect } from 'react'
import axios from "axios"
import { assets } from "../../assets/assets"

const Orders = ({ url }) => {

  const [Orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
      console.log(response.data.data);
    }
    else {
      toast.error("Error");
    }
  }

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value
    });
    if (response.data.success) {
      await fetchAllOrders();
      toast.success("Status Updated");
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, [])

  const getStatusColor = (status) => {
    switch(status) {
      case 'Food Processing': return '#ff9800';
      case 'Out for delivery': return '#2196f3';
      case 'Delivered': return '#4caf50';
      default: return '#757575';
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Food Processing': return '👨🍳';
      case 'Out for delivery': return '🚚';
      case 'Delivered': return '✅';
      default: return '📦';
    }
  }

  const openGoogleMaps = (address) => {
    const query = `${address.area}, ${address.city}, ${address.state}`;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, '_blank');
  }

  return (
    <div className='orders-container'>
      <div className="orders-header">
        <h2>📋 Order Management</h2>
        <div className="orders-stats">
          <div className="stat-card">
            <span className="stat-number">{Orders.length}</span>
            <span className="stat-label">Total Orders</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{Orders.filter(o => o.status === 'Food Processing').length}</span>
            <span className="stat-label">Processing</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{Orders.filter(o => o.status === 'Out for delivery').length}</span>
            <span className="stat-label">Out for Delivery</span>
          </div>
        </div>
      </div>
      
      <div className="orders-table">
        <div className="table-header">
          <div className="header-cell">Order ID</div>
          <div className="header-cell">Items</div>
          <div className="header-cell">Customer</div>
          <div className="header-cell">Amount</div>
          <div className="header-cell">Status</div>
          <div className="header-cell">Actions</div>
        </div>
        
        {Orders.map((order, index) => {
          return (
            <div key={index} className='order-row'>
              <div className="order-cell order-id-cell">
                <div className="order-id">#{order._id.slice(-6)}</div>
                <div className="order-date">{new Date(order.date).toLocaleDateString()}</div>
              </div>
              
              <div className="order-cell items-cell">
                <div className="items-count">📦 {order.items.length} items</div>
                <div className="items-preview">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <span key={idx} className="item-preview">
                      {item.name} x{item.quantity}
                    </span>
                  ))}
                  {order.items.length > 2 && <span className="more-items">+{order.items.length - 2} more</span>}
                </div>
              </div>
              
              <div className="order-cell customer-cell">
                <div className="customer-name">👤 {order.address.name}</div>
                <div className="customer-phone">📞 {order.address.phone}</div>
                <div className="customer-location">📍 {order.address.city}, {order.address.state}</div>
                <div className="customer-area">{order.address.area}</div>
              </div>
              
              <div className="order-cell amount-cell">
                <div className="amount">₹{order.amount}</div>
              </div>
              
              <div className="order-cell status-cell">
                <div className="status-badge" style={{backgroundColor: getStatusColor(order.status)}}>
                  {getStatusIcon(order.status)} {order.status}
                </div>
              </div>
              
              <div className="order-cell actions-cell">
                <button 
                  className="track-btn-small"
                  onClick={() => openGoogleMaps(order.address)}
                  title="Track Location"
                >
                  🗺️
                </button>
                
                <select 
                  className="status-select-small"
                  onChange={(event)=>statusHandler(event,order._id)} 
                  value={order.status}
                >
                  <option value="Food Processing">👨🍳 Processing</option>
                  <option value="Out for delivery">🚚 Delivery</option>
                  <option value="Delivered">✅ Delivered</option>
                </select>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders