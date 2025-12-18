import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'
import { Request, Response, NextFunction } from 'express'

export const validateDto = (dtoClass: any) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		const dto = plainToInstance(dtoClass, req.body)
		const errors = await validate(dto)

		if (errors.length > 0) {
			const messages = errors.flatMap(err =>
				Object.values(err.constraints || {})
			)
			return res
				.status(400)
				.json({ error: 'Validation failed', details: messages })
		}

		req.body = dto
		next()
	}
}
