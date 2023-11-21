const express = require("express");
const app = express();
const router = express.Router();
const authController = require("../controller/authController");
app.use(express.json())
const initAuthRouter = (app) =>{
    router.post("/register", authController.register);
    router.get("/login", authController.login);
    router.put("/refresh", authController.requestRefreshToken);
    router.put("/update/:id", authController.update);
    router.delete("/delete/:id", authController.delete);
    router.delete("/log-out", authController.logOut);
    return app.use("/", router);
}

module.exports = initAuthRouter;