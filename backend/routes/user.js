const express = require("express");

// user controller
const { loginUser, signupUser, getUser, updateUser, deleteUser } = require("../controllers/userController");

const router = express.Router();

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

// GET a user
router.get("/:id", getUser);

// UPDATE a user
router.put("/:id", updateUser);

// DELETE a user
router.delete("/:id", deleteUser);

module.exports = router;