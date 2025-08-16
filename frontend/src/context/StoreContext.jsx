import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "https://food-order-online-web-bankend.vercel.app";
    const [token, setToken] = useState("");
    const [food_list, setFoodList] = useState([]);
    const [user, setUser] = useState(null);

    const addToCart =async (itemId) => {
       if(!cartItems[itemId]){
        setCartItems((prev)=>({...prev,[itemId]:1}))
       }
       else {
        setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
       }
       if(token){
        await axios.post(url+"/api/cart/add",{itemId},{headers:{token}})
       }
    };

    const removeFormCart =async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] > 1 ? prev[itemId] - 1 : 0,
        }));
        if(token){
            await axios.post(url+"/api/cart/remove",{itemId},{headers:{token}})
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = food_list.find((product) => product._id === item);
                if (itemInfo) {
                    totalAmount += itemInfo.price * cartItems[item];
                } else {
                    console.warn(`Item with id ${item} not found in food list.`);
                }
            }
        }
        return totalAmount;
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            console.log(" Food List Response:", response.data);
            setFoodList(response.data.foods);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    const loadCartData =async (token)=>{
        const response =await axios.post(url+"/api/cart/get",{},{headers:{token}});
        setCartItems(response.data.cartData)
    }

    const getUserProfile = async (token) => {
        try {
            const response = await axios.post(url + "/api/user/profile", {}, { headers: { token } });
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
        }
    }

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
                await getUserProfile(storedToken);
            }
        }
        loadData();
    }, []);

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFormCart,
        getTotalCartAmount,
        url,
        token,
        setToken,
        user,
        setUser,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
