import express from "express";
import bodyParser from "body-parser";
import productRoutes from "./routes/product.js";

const app = express();
const PORT = 1234;


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/cartSystem",productRoutes);

app.get('/',(req,res)=>{
    res.send("MAIN PAGE");
})

app.listen(PORT , ()=> {
    console.log(`Server is Running on ${PORT}`);
})