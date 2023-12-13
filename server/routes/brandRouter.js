const Router = require('express')
const brandController = require('../controllers/brandController.js')
const checkRole = require('../middleware/checkRoleMiddleware.js')
const router = new Router()

router.post('/',checkRole('ADMIN'),brandController.create)
router.get('/',brandController.getAll)
router.delete('/:id',checkRole('ADMIN'),brandController.delete)


module.exports = router