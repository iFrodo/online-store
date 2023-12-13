// Импортируем класс ApiError из файла apiError.js, который находится в папке error
const ApiError = require('../error/apiError.js')

// Импортируем классы Device и DeviceInfo из файла models.js, который находится в папке models
const { Device, DeviceInfo } = require('../models/models.js')

// Импортируем модуль uuid для генерации уникальных идентификаторов
const uuid = require('uuid')

// Импортируем модуль path для работы с путями файлов
const path = require('path')

// Определяем класс DeviceController
class DeviceController {
    // Асинхронный метод create для создания нового устройства
    async create(req, res, next) {
        try {
            // Получаем данные устройства из тела запроса
            let { name, price, brandId, typeId, info } = req.body;
            // Получаем файл изображения из запроса
            const { img } = req.files;
            // Генерируем уникальное имя файла с расширением .jpg
            let fileName = uuid.v4() + '.jpg'
            // Перемещаем файл изображения в папку static
            img.mv(path.resolve(__dirname, '..', 'static', fileName))
            // Создаем новое устройство с полученными данными и именем файла изображения
            const device = await Device.create({ name, price, brandId, typeId, img: fileName })
            // Если предоставлена информация об устройстве, парсим ее и создаем записи в DeviceInfo
            if(info){
                info = JSON.parse(info)
                info.forEach(i => {
                    DeviceInfo.create({
                        title: i.title,
                        description: i.description,
                        deviceId: device.id
                    })
                });
            }
            // Возвращаем созданное устройство клиенту в формате JSON
            return res.json(device)
        } catch (e) {
            // В случае ошибки вызываем следующий обработчик ошибок с созданным ApiError
            next(ApiError.badRequest(e.message))
        }
    }

    // Асинхронный метод getAll для получения всех устройств
    async getAll(req, res) {
        // Получаем параметры фильтрации и пагинации из строки запроса
        let { brandId, typeId, limit, page } = req.query
        // Устанавливаем значения по умолчанию для пагинации
        page = page || 1;
        limit = limit || 9;
        // Вычисляем смещение для пагинации
        let offset = page * limit - limit
        let devices;
        // Получаем устройства в зависимости от заданных фильтров
        if (!brandId && !typeId) {
            devices = await Device.findAndCountAll({limit, offset})
        }
        if (brandId && !typeId) {
            devices = await Device.findAndCountAll({ where: { brandId }, limit, offset })
        }
        if (!brandId && typeId) {
            devices = await Device.findAndCountAll({ where: { typeId }, limit, offset })
        }
        if (brandId && typeId) {
            devices = await Device.findAndCountAll({ where: { brandId, typeId }, limit, offset })
        }
        // Возвращаем полученные устройства клиенту в формате JSON
        return res.json(devices)
    }

    // Асинхронный метод getOne для получения одного устройства по ID
    async getOne(req, res, next) {
        try {
            // Получаем ID устройства из параметров запроса
            const {id} = req.params
            // Получаем устройство по ID вместе с информацией из DeviceInfo
            const device = await Device.findOne({
                where: {id},
                include: [{model: DeviceInfo, as: 'info'}]
            })
            // Возвращаем полученное устройство клиенту в формате JSON
            return res.json(device)
        } catch (e) {
            // В случае ошибки вызываем следующий обработчик ошибок с созданным ApiError
            next(ApiError.badRequest(e.message))
        }
    }

    // Асинхронный метод delete для удаления устройства по ID
    async delete(req, res) {
        try {
            // Получаем ID устройства из строки запроса
            const { id } = req.query
            // Удаляем устройство по указанному ID
            const deletedDevicesCount = await Device.destroy({ where: { id } })
            // Отправляем сообщение об успешном удалении устройства клиенту в формате JSON
            res.json(`Item in Device collection with ID = ${id} was deleted`)
        } catch (e) {
            // В случае ошибки вызываем следующий обработчик ошибок с созданным ApiError
            next(ApiError.badRequest(e.message))
        }
    }
}

// Экспортируем экземпляр класса DeviceController
module.exports = new DeviceController()
