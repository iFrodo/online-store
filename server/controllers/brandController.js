const ApiError = require('../error/apiError.js') // Подключение модуля ApiError для обработки ошибок API.
const {Brand} = require('../models/models.js') // Деструктуризация и подключение модели Brand из модулей моделей.

class BrandController { // Объявление класса BrandController для управления брендами.
    async create(req, res, next){ // Асинхронный метод create для создания нового бренда.

        try { // Начало блока обработки исключений.
            const {name} = req.body // Извлечение имени бренда из тела запроса.
            const brand = await Brand.create({name}) // Создание нового бренда с использованием модели Brand.
            res.json(brand) // Отправка данных созданного бренда в ответе.
        } catch (e) { // В случае возникновения ошибки...
           next(ApiError.badRequest(e.message)) // ...передать ошибку в обработчик ошибок.
        }
  
    }
    async getAll(req, res, next){ // Асинхронный метод getAll для получения списка всех брендов.
        try {
            const brands = await Brand.findAll() // Получение списка всех брендов с использованием модели Brand.
            res.json(brands) // Отправка списка брендов в ответе.
        } catch (e) { // В случае возникновения ошибки...
            next(ApiError.badRequest(e.message)) // ...передать ошибку в обработчик ошибок.
         }
    }
    async delete(req, res, next){ // Асинхронный метод delete для удаления бренда.
        const { id } = req.params // Извлечение ID бренда из параметров запроса.
        const deletedBrandsCount = await Brand.destroy({where:{id}}) // Удаление бренда по ID с использованием модели Brand.
        if (!id) { // Если ID не задан, то...
            return next(ApiError.badRequest('Не задан ID')) // ...передать ошибку в обработчик ошибок.
        }
        res.json(`Item in Brand collection with ID = ${id} was deleted `) // Отправка сообщения об успешном удалении бренда.
    }
}

module.exports = new BrandController() // Экспорт экземпляра класса BrandController для использования в других частях приложения.
