const { Router } = require("express")
const SessionsController = require("../controllers/SessionsController")
const sessionsController = new SessionsController()

const sessionsRouters = Router()
sessionsRouters.post("/", sessionsController.create)


module.exports = sessionsRouters