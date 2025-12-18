import { Request, Response } from 'express'
import { TodoModel } from '../models/Todo'
import { CreateTodoDto } from '../dto/todo.dto'

export const getTodos = async (req: Request, res: Response) => {
	const todos = await TodoModel.find({ owner: req.session.userId }).select(
		'-__v'
	)
	res.json(todos)
}

export const createTodo = async (req: Request, res: Response) => {
	const { title, completed = false } = req.body as CreateTodoDto

	const todo = await TodoModel.create({
		title,
		completed,
		owner: req.session.userId,
	})

	res.status(201).json(todo)
}

export const updateTodo = async (req: Request, res: Response) => {
	const { id } = req.params
	const { completed, title } = req.body

	const todo = await TodoModel.findOneAndUpdate(
		{ _id: id, owner: req.session.userId },
		{ completed, title },
		{ new: true }
	)

	if (!todo) return res.status(404).json({ error: 'Todo not found' })
	res.json(todo)
}

export const deleteTodo = async (req: Request, res: Response) => {
	const { id } = req.params

	const result = await TodoModel.deleteOne({
		_id: id,
		owner: req.session.userId,
	})
	if (result.deletedCount === 0) {
		return res.status(404).json({ error: 'Todo not found' })
	}
	res.status(204).send()
}
