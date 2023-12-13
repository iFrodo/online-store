const Router = require('express')
const deviceController = require('../controllers/deviceController.js')
const checkRole = require('../middleware/checkRoleMiddleware.js')
const router = new Router()

router.post('/',checkRole('ADMIN'),deviceController.create)
router.get('/',deviceController.getAll)
router.get('/:id',deviceController.getOne)
router.delete('/',checkRole('ADMIN'),deviceController.delete)


module.exports = router