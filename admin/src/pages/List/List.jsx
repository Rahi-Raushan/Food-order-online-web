import React from 'react'
import './List.css'
import axios from 'axios'; 
import {toast} from "react-toastify"

import { useState } from 'react'
import { useEffect } from 'react'

const List = ({url}) => {
// const url ="http://localhost:4000";
const [list,setList]=useState([]);
const fetchList = async () => {
    try {
        const response = await axios.get(`${url}/api/food/list`);
        console.log("API Response:", response.data);
        if (response.data.success && response.data.foods) {  // 🟢 `foods` ko check karo
            setList(response.data.foods);  // 🟢 Correct key use karo
        } else {
            toast.error("Error fetching list");
        }
    } catch (error) {
        console.error("API Error:", error);
        toast.error("Failed to fetch data");
    }
};

const removeFood=async(foodId)=>{
//    console.log(foodId);
const  response =await axios.post(`${url}/api/food/remove`,{id:foodId});
await fetchList();
if(response.data.success){
    toast.success(response.data.message)
}
else{
    toast.error("Error");
}
}

useEffect(()=>{
    fetchList();
},[])

    return (
        <div className='list add flex-col'>
            <p>All Foods List</p>
            <div className='list-table'>
                <div className='list-table-format title'>
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Action</b>   
                </div>
              {list.map((item,index)=>{
                return (
                    <div key={index} className='list-table-format'>
                        <img src={`${url}/images/`+item.image} alt='' />
                        <p>{item.name} </p>
                        <p>{item.category} </p>
                        <p>₹{item.price} </p>
                        <p onClick={()=>removeFood(item._id)} className='cursor'>X</p>

                     </div>   
                )
              })}
            </div>

        </div>
    )
}

export default List


