const bcrypt = require("bcrypt");
const User = require("../model/user");
const refreshTokenModel = require("../model/refreshToken");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
let refreshTokens = [];
const authController = {
    register: async (req, res) => {
        try{
            const { email, password, username } = req.body;
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            const newUser = await new User({
                email: email,
                password: hashed,
                username: username
            })
            const saveUser = await newUser.save();
            return res.status(200).json(saveUser);
        }catch(err){
            return res.status(500).json(err);
        }
    },
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin
            },
            process.env.ACCESS_TOKEN_SECRET_KEY,
            { expiresIn: "30s" }
        )
    },
    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin
            },
            process.env.REFRESH_TOKEN_SECRET_KEY,
            { expiresIn: "7d" }
        )
    },
    login: async (req, res) => {
        try{
            const { email, password } = req.body;
            const user = await User.findOne({ email: email });
            if(!user){
                return res.status(404).json("user not valid!");
            }
            const validPassword = await bcrypt.compare(
                password, user.password
            )
            if(!validPassword){
                return res.status(404).json("wrong password!");
            }else{
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                const getRefreshToken = await refreshTokenModel.findOne({ idUser: user.id });
                if(!getRefreshToken){
                    const newRefreshToken = new refreshTokenModel({
                        idUser: user.id,
                        refreshToken: refreshToken,
                    });
                    await newRefreshToken.save();
                }
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict"
                });
                return res.status(200).json({ user, accessToken });
            }
        }catch(err){
            return res.status(404).json(err)
        }
    },
    requestRefreshToken: async (req, res, user) => {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken){
            return res.status(401).json("you are not authenticated!");
        }
        const getRefreshToken = await refreshTokenModel.findOne({ refreshToken: refreshToken });
        if(getRefreshToken){
            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);
            const newRefreshTokens = await refreshTokenModel.updateOne({ refreshToken: refreshToken }, {$set: { refreshToken: newRefreshToken }})
            if(!newRefreshTokens){
                return res.status(500).json("update error!");
            }
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                sameSite: "strict",
                secure: false,
                path: "/"
            })
            return res.status(200).json({ 
                accessToken: newAccessToken,
            });
        }else{
            return res.status(401).json("token does not exist!");
        }
    },
    update: async (req, res) => {
        try{
            const { username, email, password } = req.body;
            const idUser = req.params.id;
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(password, salt);
            const updateUser = await User.findByIdAndUpdate(idUser, {$set: {username: username, password: hashed, email: email}}, {new: true})
            if(updateUser){
                return res.status(200).json({ massage: "success!", updateUser });
            }else{
                return res.status(404).json("error!");
            }
        }catch(err){
            return res.status(500).json("error!");
        }
    },
    delete: async (req, res) => {
        try{
            const idUser = req.params.id;
            const deleteUser = await User.findByIdAndDelete(idUser);
            if(deleteUser){
                return res.status(200).json("delete success");
            }else{
                return res.status(404).json("user not valid!");
            }
        }catch(err){
            return res.status(500).json("error!");
        }
        

    },
    logOut: async (req, res) => {
        const refreshToken = req.cookies.refreshToken;
        const deleteUser = await refreshTokenModel.deleteOne({ refreshToken: refreshToken });
        if(deleteUser){
            res.clearCookie("refreshToken");
            return res.status(200).json("Logged out successfully!");
        }else{
            return res.status(404).json("user does not exist!");
        }
    }
}
module.exports = authController;