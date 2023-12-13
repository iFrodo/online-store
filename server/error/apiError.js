class ApiError extends Error { // Объявление нового класса ApiError, который наследует от стандартного класса Error.
    constructor(status, message) { // Конструктор класса, принимающий статус и сообщение об ошибке.
        super(); // Вызов конструктора родительского класса Error.
        this.status = status // Присваивание статуса ошибки свойству status экземпляра класса.
        this.message = message // Присваивание сообщения об ошибке свойству message экземпляра класса.
    }

    static badRequest(message) { // Статический метод для создания ошибки с кодом 404 (Bad Request).
        return new ApiError(404, message) // Возвращает новый экземпляр ApiError с указанным сообщением и статусом 404.
    }

    static internal(message) { // Статический метод для создания ошибки с кодом 500 (Internal Server Error).
        return new ApiError(500, message) // Возвращает новый экземпляр ApiError с указанным сообщением и статусом 500.
    }

    static forbidden(message) { // Статический метод для создания ошибки с кодом 403 (Forbidden).
        return new ApiError(403, message) // Возвращает новый экземпляр ApiError с указанным сообщением и статусом 403.
    }
}

module.exports = ApiError // Экспорт класса ApiError для использования в других файлах.
