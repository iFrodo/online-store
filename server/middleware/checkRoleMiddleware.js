const jsw = require('jsonwebtoken') // Подключение библиотеки jsonwebtoken для работы с JWT.

module.exports = function (role) { // Экспорт функции, которая принимает параметр role.
    return function (req, res, next) { // Возвращение функции middleware для Express.
        if (req.method === 'OPTIONS') { // Если HTTP-метод запроса - OPTIONS, то...
            next() // ...передать управление следующему обработчику.
        }
        try { // Начало блока обработки исключений.
            const token = req.headers.authorization.split(' ')[1] // Извлечение токена из заголовка авторизации.
            if (!token) { // Если токен отсутствует, то...
                return res.status(401).json({ message: 'Не авторизован' }) // ...отправить статус 401 с сообщением.
            }
            const decoded = jsw.verify(token, process.env.SECRET_KEY) // Проверка токена с использованием секретного ключа.
            if (decoded.role !== role) { // Если роль в токене не соответствует требуемой, то...
                return res.status(403).json({ message: 'Нет доступа' }) // ...отправить статус 403 с сообщением.
            }
            req.user = decoded // Присвоение расшифрованных данных токена свойству user объекта запроса.
            next() // Передать управление следующему обработчику.
        } catch (e) { // В случае возникновения исключения...
            res.status(401).json({ message: 'Не авторизован' }) // ...отправить статус 401 с сообщением.
        }
    }
}
