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

const addUser = (req, res, next) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  });
  user
    .save()
    .then((response) => {
      res.json({ response });
    })
    .catch((error) => {
      res.json({ error: error });
    });
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
exports.getUsers = getUsers;
exports.addUser = addUser;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
