const express = require("express");
const router = express.Router();

const Property = require("../models/Property");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get all properties
router.get("/", async(req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get property by ID
router.get("/:id", async(req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        res.status(200).json(property);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Property (Admin Only)
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    async(req, res) => {
        try {
            const property = new Property(req.body);
            const savedProperty = await property.save();

            res.status(201).json(savedProperty);

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
);

// Update Property (Admin Only)
router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    async(req, res) => {
        try {

            const updatedProperty = await Property.findByIdAndUpdate(
                req.params.id,
                req.body, { new: true }
            );

            if (!updatedProperty) {
                return res.status(404).json({
                    message: "Property not found"
                });
            }

            res.status(200).json(updatedProperty);

        } catch (error) {
            res.status(400).json({
                message: error.message
            });
        }
    }
);

// Delete Property (Admin Only)
router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    async(req, res) => {
        try {

            const deletedProperty = await Property.findByIdAndDelete(
                req.params.id
            );

            if (!deletedProperty) {
                return res.status(404).json({
                    message: "Property not found"
                });
            }

            res.status(200).json({
                message: "Property deleted successfully"
            });

        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    }
);

module.exports = router;