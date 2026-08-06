const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");


// =========================
// REGISTER USER
// =========================

router.post("/register", async(req, res) => {

    try {

        const { name, email, password } = req.body;


        // Check existing user

        const existingUser = await User.findOne({ email });


        if (existingUser) {

            return res.status(400).json({

                message: "User already exists"

            });

        }


        // Password Encryption

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        const user = new User({

            name: name,

            email: email,

            password: hashedPassword

        });


        const savedUser = await user.save();


        res.status(201).json({

            message: "Registration Successful",

            user: savedUser

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});




// =========================
// LOGIN USER + JWT TOKEN
// =========================


router.post("/login", async(req, res) => {


    try {


        const { email, password } = req.body;



        // Find User

        const user = await User.findOne({
            email
        });



        if (!user) {

            return res.status(400).json({

                message: "User not found"

            });

        }



        // Compare Password


        const isPasswordCorrect = await bcrypt.compare(

            password,

            user.password

        );



        if (!isPasswordCorrect) {


            return res.status(400).json({

                message: "Invalid Password"

            });


        }




        // Generate JWT Token


        const token = jwt.sign(

            {

                id: user._id,

                email: user.email

            },


            process.env.JWT_SECRET,


            {

                expiresIn: "1d"

            }


        );




        res.status(200).json({

            message: "Login Successful ✅",


            token: token,


            user: {

                id: user._id,

                name: user.name,

                email: user.email

            }


        });



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


});




// =========================
// GET ALL USERS
// =========================


router.get("/", async(req, res) => {


    try {


        const users = await User.find();


        res.status(200).json(users);



    } catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


});





// =========================
// PROTECTED PROFILE ROUTE
// =========================


router.get("/profile", authMiddleware, async(req, res) => {


    res.json({

        message: "User Profile Access Granted ✅",

        user: req.user

    });


});





module.exports = router;