const Router = require('express')
const userController = require('../controllers/userController')
const authMiddleware = require('../middleware/AuthMiddleware.js')
const checkRole = require('../middleware/checkRoleMiddleware.js')
const router = new Router()

router.post('/registration', userController.registration)
router.post('/login',  userController.login)
router.get('/auth',authMiddleware, userController.checkAuth)
router.delete('/',checkRole('ADMIN'),  userController.delete)


module.exports = router