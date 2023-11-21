const jwt = require("jsonwebtoken");
const User = require("../model/user");

const userController = {
    getUser : async (req, res) => {
        try{
            const getAllUser = await User.find();
            return res.status(200).json(getAllUser)
        }catch(err){
            return res.status(500).json("error!")
        }
    },
    searchUser: async (req, res) => {
        try{
            const searchKeyWord = req.query.query;
            if(searchKeyWord){
                const getSearchData = await User.find({ 
                    $or: [
                    { username: { $regex: searchKeyWord } },
                    { email: { $regex: searchKeyWord } },
                  ], 
                });
                return res.status(200).json(getSearchData);
            }else{
                return res.status(404).json("not search!");
            }
        }catch(err){
            return res.status(500).json(err);
        }
    }
}
module.exports = userController;