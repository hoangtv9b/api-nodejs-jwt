const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
    const token = req.headers.token;
    const refreshToken = req.cookies.refreshToken;
    if(token){
        const accessToken = token.split(" ")[1];
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
            if(err){
                return res.status(500).json("token has expried!");
            }
            req.user = user;
            next();
        });
    }else{
        return res.status(401).json("you not authenticated!");
    }
}
module.exports = { verifyToken };