const express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../model/User");
const Message = require("../model/MessageModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authProvider = require("../middleware/authProvider");

const UPLOAD = "../client/public/uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD);
  },
  filename: (req, file, cb) => {
    const fileName =
      file.fieldname + "_" + Date.now() + "_" + file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
}).single("image");

router.post("/register", upload, async (req, res, next) => {
  try {
    const { title, username, password } = req.body;
    const salt = await bcrypt.genSalt(11);
    const hashedPassword = await bcrypt.hash(password, salt);
    const fileName = req.file.filename;
    const newUser = new User({
      title,
      username,
      password: hashedPassword,
      profile: fileName,
    });
    const findUser = await User.findOne({ username });
    if (findUser) {
      return res.status(400).json("User already exist");
    } else {
      const saveUser = newUser.save();
      if (saveUser) {
        return res.status(200).json("User created successfully.");
      } else {
        return res.status(400).json("Something went wrong when creating user.");
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const findUser = await User.findOne({ username });
    if (!findUser) {
      return res.status(400).json("User not found!");
    } else {
      const match = await bcrypt.compare(password, findUser.password);
      if (!match) {
        return res.status(400).json("Password not match!");
      } else {
        const token = jwt.sign(
          {
            username: findUser.username,
            userId: findUser._id,
          },
          process.env.SECRET_KEY,
          {
            expiresIn: "7d",
          }
        );
        return res.status(200).json({
          token: token,
          message: "User login successfull!",
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/loginUser", authProvider, async (req, res, next) => {
  try {
    const findUser = await User.findOne({ username: req.username });
    const findActiveUser = await User.find({ _id: { $ne: req.userId } });
    return res.status(200).json({
      findUser: findUser,
      findActiveUser: findActiveUser,
      usernameId: findUser._id
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/singleUser", authProvider, async (req, res, next) => {
  try {
    const findUser = await User.findOne({ _id: req.body.id });
    const allMsg = await Message.find({
      $or: [
        {
          $and: [{ reciverId: req.userId }, { senderId: req.body.id }],
        },
        {
          $and: [{ reciverId: req.body.id }, { senderId: req.userId }],
        },
      ],
    });
    return res.status(200).json({
      findUser: findUser,
      allMsg: allMsg,
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/sendMessage", authProvider, async (req, res, next) => {
  try {
    const { reciverId, msg } = req.body;  
    const newMessage = new Message({
      senderId: req.userId,
      reciverId,
      msg,
    });
    const saveMessage = newMessage.save();
    if (saveMessage) {
      return res.status(200).json("message send!");
    } else {
      return res.status(400).json("message hasn't been send!");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
