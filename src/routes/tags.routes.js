const { Router } = require("express")
const TagsController = require("../controllers/TagsController")   
const ensuredAuthenticated = require("../middlewares/ensureAuthenticated")
const tagsRoutes = Router()
const tagsController = new TagsController()
tagsRoutes.get("/", ensuredAuthenticated, tagsController.index)
module.exports = tagsRoutes


 