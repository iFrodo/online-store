// Подключение модуля для обработки API ошибок
const ApiError = require('../error/apiError.js')

// Подключение моделей User и Basket из файла models.js
const { User, Basket } = require('../models/models.js')

// Подключение модуля bcrypt для хеширования паролей
const bcrypt = require('bcrypt')

// Подключение модуля jsonwebtoken для работы с JWT-токенами
const jwt = require('jsonwebtoken')

// Функция для генерации JWT-токена
const generateGwt = (id, email, role) => {
    // Создание токена с данными пользователя и временем жизни 24 часа
    return jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' })
}

// Определение класса UserController
class UserController {
    // Асинхронный метод для регистрации пользователя
    async registration(req, res, next) {
        // Извлечение данных из тела запроса
        let { email, password, role } = req.body
        // Проверка наличия email и пароля
        if (!email || !password) {
            // Возврат ошибки, если данные некорректны
            return next(ApiError.badRequest('Некорректный email или password'))
        }
        // Поиск пользователя с таким же email
        const candidate = await User.findOne({ where: { email } })
        // Проверка на существование пользователя с таким email
        if (candidate) {
            // Возврат ошибки, если пользователь уже существует
            return next(ApiError.badRequest('Пользователь с таким email уже существует'))
        }
        // Хеширование пароля
        const hashPassword = await bcrypt.hash(password, 5)
        // Создание нового пользователя с хешированным паролем
        const user = await User.create({ email, role, password: hashPassword })
        // Создание корзины для пользователя
        const basket = await Basket.create({ userId: user.id })
        // Генерация токена для пользователя
        const token = generateGwt(user.id, user.email, user.role)
        // Возврат токена в ответе
        return res.json({ token })
    }

    // Асинхронный метод для входа пользователя
    async login(req, res, next) {
        // Извлечение данных из тела запроса
        const { email, password } = req.body
        // Поиск пользователя по email
        const user = await User.findOne({ where: { email } })
        // Проверка на существование пользователя
        if (!user) {
            // Возврат ошибки, если пользователь не найден
            return next(ApiError.internal('Пользователь не найден'))
        }
        // Сравнение введенного пароля с хешированным паролем в базе данных
        let comparePassword = bcrypt.compareSync(password, user.password)
        // Проверка корректности пароля
        if (!comparePassword) {
            // Возврат ошибки, если пароль неверен
            return next(ApiError.internal('Пароль указан неверно'))
        }
        // Генерация токена для пользователя
        const token = generateGwt(user.id, user.email, user.role)
        // Возврат токена в ответе
        return res.json({ token })
    }
    // Асинхронный метод для проверки авторизации пользователя
    async checkAuth(req, res, next) {
        // Генерация токена с данными пользователя из запроса
        const token = generateGwt(req.user.id, req.user.email, req.user.role)
        // Возврат токена в ответе
        return res.json({ token })
    }
    // Метод для удаления пользователя (не реализован)
    async delete(req, res) {

    }
}

// Экспорт экземпляра класса UserController
module.exports = new UserController()
