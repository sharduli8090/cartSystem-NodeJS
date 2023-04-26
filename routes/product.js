import express from "express";
import { verifyToken,loginUser,registerUser,createProduct, deleteProduct, getAllProduct, getParticularProduct, updateProduct } from "../controllers/product.js";

const router = express.Router();

router.get("/product",verifyToken,getAllProduct);

router.post("/product",verifyToken,createProduct);

router.get("/product/:id", verifyToken ,getParticularProduct);

router.delete("/product/:id",verifyToken,deleteProduct);

router.patch("/product/:id",verifyToken,updateProduct);

router.post("/user/register",registerUser);

router.post("/user/login",loginUser);

export default router;