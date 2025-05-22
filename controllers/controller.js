const { response } = require("../app");
const User = require("../models/model");

const getUsers = (req, res, next) => {
  User.find()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();
    res.status(200).json({ message: "User created", user: savedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = (req, res, next) => {
  const id = req.body.id;
  const username = req.body.username;
  User.updateOne({ id: id }, { $set: { username: username } })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

const deleteUser = (req, res, next) => {
  const id = req.body.id;
  User.deleteOne({ id: id })
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error });
    });
};

const jwt = require("jsonwebtoken");
const SECRET_KEY = "yoursecretkey"; // Use .env file in real apps

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.loginUser = loginUser;
exports.getUsers = getUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
