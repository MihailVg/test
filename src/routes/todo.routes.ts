import { Router } from 'express'
import { requireAuth } from '../middleware/requireAuth'
import { validateDto } from '../middleware/validation.middleware'
import { CreateTodoDto } from '../dto/todo.dto'
import * as todoController from '../controllers/todo.controller'

const router = Router()

router.use(requireAuth)

router.get('/', todoController.getTodos)
router.post('/', validateDto(CreateTodoDto), todoController.createTodo)
router.patch('/:id', todoController.updateTodo)
router.delete('/:id', todoController.deleteTodo)

export default router
