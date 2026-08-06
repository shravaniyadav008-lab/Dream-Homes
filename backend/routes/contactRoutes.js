const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");

// Save Contact Form
router.post("/", async(req, res) => {
    try {
        const contact = new Contact(req.body);
        const savedContact = await contact.save();
        res.status(201).json(savedContact);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});

// Get All Contacts
router.get("/", async(req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;