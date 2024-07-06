const { Router } = require("express")
const multer = require("multer")
const UsersController = require("../controllers/UsersController")
const ensuredAuthenticated = require("../middlewares/ensureAuthenticated")
const usersRoutes = Router()
const uploadConfig = require("../configs/upload")
const usersController = new UsersController()
const upload = multer(uploadConfig.MULTER)

usersRoutes.post("/", usersController.create)
usersRoutes.put("/", ensuredAuthenticated, usersController.update)
usersRoutes.patch("/avatar", ensuredAuthenticated, upload.single("avatar"), (req, res) => {
    console.log(req.file.filename)
    res.json()
})
module.exports = usersRoutes

