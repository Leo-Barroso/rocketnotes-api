require("express-async-errors")
const migrationsRun = require("./database/sqlite/migrations")
const AppError = require("./utils/AppError")
const cors = require("cors")
const express = require("express")
const routes = require("./routes")
migrationsRun()
// const usersRoutes = require("./routes/user.routes")
const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)
app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }
    return response.status(500).json({
        status: "error",
        message: "Internal Server Error"
    })
})

//porta utilizada pelo express
const PORT = 3333
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})



