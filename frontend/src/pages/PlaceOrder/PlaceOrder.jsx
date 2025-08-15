import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const PlaceOrder = () => {

    const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

    const [data, setData] = useState({
        name: "",
        phone: "",
        state: "Chhattisgarh",
        city: "",
        area: "",
        useCurrentLocation: false
    });

    const chhattisgarh_cities = [
        "Raipur", "Bilaspur", "Korba", "Durg", "Bhilai", "Rajnandgaon", 
        "Jagdalpur", "Raigarh", "Ambikapur", "Mahasamund", "Dhamtari", 
        "Chirmiri", "Janjgir", "Sakti", "Tilda", "Mungeli", "Naila Janjgir"
    ];

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const getCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setData(data => ({ 
                        ...data, 
                        area: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
                        useCurrentLocation: true
                    }));
                    alert("Current location added!");
                },
                (error) => {
                    alert("Unable to get location. Please enter manually.");
                }
            );
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    const PlaceOrder = async (event) => {
        event.preventDefault();
        let orderItems = [];
        food_list.forEach((item) => {
            if (cartItems[item._id] > 0) {
                orderItems.push(item);   
            }
        })

        let orderData = {
            address: data,
            items: orderItems,  // Corrected the typo here
            amount: getTotalCartAmount() + 2,
        }

        try {
            let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } });
         
            if (response.data.success) {
                const { session_url } = response.data;
                window.location.replace(session_url);
            }
            else {
                alert("Error");
            }
        } catch (error) {
            console.error("Error placing order", error);
            alert("An error occurred while placing the order.");
        }
         

    }

    return (
        <form onSubmit={PlaceOrder} className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                
                <input required name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Full Name' />
                
                <input required name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='Contact Number' />
                
                <div className='multi-fields'>
                    <select required name='state' onChange={onChangeHandler} value={data.state}>
                        <option value="Chhattisgarh">Chhattisgarh</option>
                    </select>
                    
                    <select required name='city' onChange={onChangeHandler} value={data.city}>
                        <option value="">Select City</option>
                        {chhattisgarh_cities.map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
                
                <div className='location-section'>
                    <input 
                        name='area' 
                        onChange={onChangeHandler} 
                        value={data.area} 
                        type="text" 
                        placeholder='Nearby Area / Landmark' 
                        required={!data.useCurrentLocation}
                    />
                    <button type="button" onClick={getCurrentLocation} className='location-btn'>
                        📍 Use Current Location
                    </button>
                </div>
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details">
                            <p>Subtotal</p>
                            <p>₹{getTotalCartAmount()}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <p>Delivery Fee</p>
                            <p>₹{getTotalCartAmount() === 0 ? 0 : 2}</p>
                        </div>
                        <hr />
                        <div className="cart-total-details">
                            <b>Total</b>
                            <b>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
                        </div>
                    </div>
                    <button type='submit'>PLACE ORDER (Cash on Delivery)</button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder;
