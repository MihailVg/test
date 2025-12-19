import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { validateDto } from '../middleware/validation.middleware'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'
import * as categoryController from '../controllers/category.controller'

const router = Router()
router.use(requireAuth)

router.get('/', categoryController.getCategories)
router.post(
	'/',
	validateDto(CreateCategoryDto),
	categoryController.createCategory
)
router.patch(
	'/:id',
	validateDto(UpdateCategoryDto),
	categoryController.updateCategory
)
router.delete('/:id', categoryController.deleteCategory)

export default router
