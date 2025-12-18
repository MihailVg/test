import { Router } from 'express'
import * as authController from '../controllers/auth.controller'
import { validateDto } from '../middleware/validation.middleware'
import { RegisterDto, LoginDto } from '../dto/auth.dto'

const router = Router()

router.post('/register', validateDto(RegisterDto), authController.register)
router.post('/login', validateDto(LoginDto), authController.login)
router.post('/logout', authController.logout)
router.get('/me', authController.me)

export default router
