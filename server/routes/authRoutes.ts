import mongoose from "mongoose";
import { Router } from "express";
import session from "express-session";

const router = Router();
export default router;

router.post("/login", async (req, res) => {
    res.json({
        success: true,
        message: "Logged In"
    });
    return;
});

router.post("/register", (req, res) => {
    res.json({
        success: true,
        message: "Registered"
    });
    return;
});