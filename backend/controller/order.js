import Order from "../models/Orders.js";
import User from "../models/User.js";


function generateUniqueId() {
  const timestamp = Date.now(); // Get the current timestamp
  const randomNum = Math.floor(Math.random() * 1000000); // Generate a random number
  return `${timestamp}-${randomNum}`; // Combine them to form the unique ID
}



export const createOrder = async (req,res) => {
   try{
    const {itemname,status,userid,input1,input2,paymentmode,value} = req.body;

    const newOrder = new Order({
      itemname,status,userid,input1,input2,paymentmode,value
    })

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);

   }catch(err){
    res.status(500).json({error : err.message}); 
   }
}

export const upiGateway = async(req,res) => {
  try{
    const {itemname,userid,value} = req.body;
    const number = parseFloat(value)
    const uniqueId = generateUniqueId();
    const userInfo = await User.find({_id:userid})
    const user = userInfo[0]
    console.log(user.name);
    const response = await fetch(`https://api.ekqr.in/api/create_order`,{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({
        "key": process.env.API_KEY,
        "client_txn_id": uniqueId,
        "amount": number.toFixed(2),
        "p_info": "test",
        "customer_name": user.name,
        "customer_email": user.email,
        "customer_mobile": user.mobilenumber,
        "redirect_url": "https://topupsite.netlify.app/confirmation"
        
      })
    })

    const data = await response.json();
    res.status(200).json(data);
  }
  catch(err){
    res.status(500).json({error : err.message});
  }
}

export const orderStatus = async (req, res) => {
  try {
    

    const response = await fetch(`https://api.ekqr.in/api/check_order_status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "key": process.env.API_KEY,
        "client_txn_id": req.body.client_txn_id,
        "txn_date": req.body.date
      })
    });

 

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getOrders = async(req,res) =>{
  try{
    const {userId} = req.params;
    const orders = await Order.find({userid:userId});
    res.status(200).json(orders);
  }
  catch(e){
    res.status(500).json({error : err.message});
  }
}


