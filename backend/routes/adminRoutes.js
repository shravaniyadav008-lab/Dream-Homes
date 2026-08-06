const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Admin Dashboard
router.get("/dashboard", authMiddleware, adminMiddleware, (req, res) => {

    res.json({
        message: "Welcome Admin 👑"
    });

});

module.exports = router;