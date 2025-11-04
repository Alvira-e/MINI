import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import user from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new user({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User created succesfully!");
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await user.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'Email not Found!'));
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'Invalid password!'));
        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, {expiresIn: '7d'});
        const { password:pass, ...rest } = validUser._doc;
        res
            .status(200)
            .json({ token, user: rest });
    } catch (error) {
        next(error);
    }
}

export const verifytoken = async(req,res,next) => {
  const authHeader = req.headers['authorization'];
  if(!authHeader) return res.status(203).send('No token provided!');

const token = authHeader.split(' ')[1]; // Remove "Bearer" prefix


  jwt.verify(token, process.env.JWT_SECRET, (err,decoded) => {
    if (err) return res.status(403).send('Invalid Token');
    req.validUserid = decoded.validUserid;
    next();
  });
}
