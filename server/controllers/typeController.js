// Импортируем класс Type из файла models.js, который находится в папке models
const { Type } = require('../models/models.js')

// Импортируем класс ApiError из файла apiError.js, который находится в папке error
const ApiError = require('../error/apiError.js')

// Определяем класс TypeController
class TypeController {
    // Асинхронный метод create для создания нового типа
    async create(req, res, next) {
        try {
            // Получаем имя типа из тела запроса
            const { name } = req.body
            // Создаем новый тип с помощью метода create модели Type
            const type = await Type.create({ name })
            // Отправляем созданный тип обратно клиенту в формате JSON
            res.json(type)
        } catch (e) {
            // В случае ошибки вызываем следующий обработчик ошибок с созданным ApiError
            next(ApiError.badRequest(e.message))
        }
    }

    // Асинхронный метод getAll для получения всех типов
    async getAll(req, res) {
        // Получаем все типы с помощью метода findAll модели Type
        const types = await Type.findAll()
        // Отправляем полученные типы обратно клиенту в формате JSON
        res.json(types)
    }

    // Асинхронный метод delete для удаления типа по ID
    async delete(req, res, next) {
        // Получаем ID типа из строки запроса
        const { id } = req.query
        // Удаляем тип по указанному ID с помощью метода destroy модели Type
        const deletedTypesCount = await Type.destroy({where:{id}})
        // Если ID не был задан, возвращаем ошибку с помощью ApiError
        if (!id) {
            return next(ApiError.badRequest('Не задан ID'))
        }
        // Отправляем сообщение об успешном удалении типа обратно клиенту в формате JSON
        res.json(`Item in Type collection with ID = ${id} was deleted`)
    }
}

// Экспортируем экземпляр класса TypeController
module.exports = new TypeController()
