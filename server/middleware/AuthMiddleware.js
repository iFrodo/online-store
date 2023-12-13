// Импортируем модуль jsonwebtoken как jsw для работы с JWT (JSON Web Tokens)
const jsw = require('jsonwebtoken');

// Экспортируем функцию middleware, которая будет использоваться в Express.js приложении
module.exports = function (req, res, next) {
    // Проверяем, является ли HTTP метод запроса 'OPTIONS', который используется для предварительных запросов CORS
    if (req.method === 'OPTIONS') {
        // Если да, то пропускаем обработку запроса дальше по цепочке middleware
        next()
    }
    try {
        // Пытаемся получить токен из заголовка авторизации запроса
        // Заголовок обычно выглядит как "Bearer TOKEN", поэтому разделяем строку по пробелу и берем второй элемент
        const token = req.headers.authorization.split(' ')[1] // Пример: Bearer asdqr13rwerwa
        // Если токен не найден, отправляем ответ с кодом 401 (Не авторизован)
        if (!token) {
            return res.status(401).json({ message: 'Не авторизован' })
        }
        // Верифицируем токен с помощью секретного ключа, который хранится в переменных окружения
        const decoded = jsw.verify(token, process.env.SECRET_KEY)
        // Если токен верифицирован, добавляем декодированные данные пользователя в объект запроса
        req.user = decoded
        // Пропускаем обработку запроса дальше по цепочке middleware
        next()
    } catch (e) {
        // В случае ошибки при верификации токена, отправляем ответ с кодом 401 (Не авторизован)
        res.status(401).json({ message: 'Не авторизован' })
    }
}
