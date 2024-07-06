const { hash, compare } = require("bcryptjs")
const AppError = require("../utils/AppError")
const sqliteConection = require("../database/sqlite")
const { use } = require("../routes/user.routes")

class UsersController {
    async create(request, response) {
        const { name, email, password} = request.body
        const database = await sqliteConection()
        const checkUserExists = await database.get("SELECT * FROM users WHERE email = (?)", [email])
        if(checkUserExists) {
            throw new AppError("E-mail já cadastrado.")
        }
        const hashedPassword = await hash(password, 8)
        await database.run(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword]
        )
        return response.status(201).json()
    }

    async update(request, response) {
        const { name, email, password, oldpassword} = request.body
        const user_id = request.user.id

        const database = await sqliteConection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id])

        if(!user) {
            throw new AppError("Usuário inexistente.")
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])

        if(userWithUpdatedEmail && userWithUpdatedEmail.id != user.id) {
            throw new AppError("E-mail informado já em uso.")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !oldpassword) {
            throw new AppError("Informe a senha antiga.")
        }

        if(password && oldpassword) {
            const checkOldPassword = await compare(oldpassword, user.password)
            if(!checkOldPassword) {
                throw new AppError("Senha antiga é inválida.")
            }
            user.password = await hash(password, 8)
        }


        await database.run(`
            UPDATE users SET 
                name = ?,
                email = ?, 
                password = ?, 
                updated_at = DATETIME('now')
                WHERE id = ?`, 
                [user.name, user.email, user.password, user_id]
            )

        return response.json()
    }
}

module.exports = UsersController


