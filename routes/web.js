const express = require("express");
const app = express();
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken } = require("../middleware/verifyTokenMiddleware");
app.use(express.json())
const initWebRouter = (app) => {
    router.get("/", verifyToken, userController.getUser);
    router.get("/search", userController.searchUser);
    return app.use("/", router)
}
module.exports = initWebRouter;