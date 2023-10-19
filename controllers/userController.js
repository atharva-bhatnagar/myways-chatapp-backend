const asyncHandler = require("express-async-handler");
const User = require("../models/User");



const getOneUser = asyncHandler(async (req, res) => {
  const { email } = req.query;
  const user = await User.findOne({ email }).lean();
  if (!user) {
    return res.json({
      message: "No such user , Please register before logging in!!!",
    });
  } else {
    res.json(user);
  }
});

const createNewUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { email, name, password,todos } = req.body;

  const duplicate = await User.findOne({ email }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "duplicate email" });
  }

  const userObject = {
    email,
    name,
    password,
    todos
  };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `new user ${name} created` });
  } else {
    res.status(400).json({ messgae: `Invalid user data received` });
  }
});
// });
const updateUser = asyncHandler(async (req, res) => {
  const { id, transactions, investments } = req.body;

  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(400).json({ message: `user not found` });
  }

  user.transactions = transactions;
  user.investments = investments;

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

module.exports = {
  createNewUser,
  getOneUser,
  updateUser,
};