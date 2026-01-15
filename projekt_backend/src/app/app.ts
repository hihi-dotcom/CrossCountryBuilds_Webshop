import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "../user/routes";
import productRoutes from "../product/routes";
import dateTimeRoutes from "../datetime/routes";
import adminRoutes from "../admin/routes";
import orderRoutes from "../order/routes";

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

}));
app.use(express.json());
app.use(cookieParser());
app.use("/", userRoutes);
app.use("/admin", adminRoutes);
app.use("/", productRoutes);
app.use("/", dateTimeRoutes);
app.use("/", orderRoutes);

export default app;