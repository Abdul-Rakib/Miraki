import express from "express"
import {authCheck} from "../middleware/verifyToken.js";
import { checkApiKey, verifyToken } from "../middleware/auth.js";
import { createOrder, getOrders, orderStatus, upiGateway } from "../controller/order.js";

const router = express.Router();

router.post("/neworder",checkApiKey,verifyToken,createOrder)
router.post("/createOrder",checkApiKey,verifyToken,upiGateway)
router.post("/orderstatus",checkApiKey,verifyToken,orderStatus)

router.get("/:userId",getOrders)


export default router;