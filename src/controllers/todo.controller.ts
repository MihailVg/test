import { Request, Response } from 'express'
import { Todo, TodoModel } from '../models/Todo'
import { CreateTodoDto, UpdateTodoDto } from '../dto/todo.dto'
import { parseDate } from '../utils/utils'
import { CategoryModel } from '../models/Category'
import { Types } from 'mongoose'

export const getTodos = async (req: Request, res: Response) => {
	const { category, dueDateFrom, dueDateTo, completed } = req.query
	const filter: any = { owner: req.session.userId }

	if (category) filter.category = category
	if (completed !== undefined) filter.completed = completed === 'true'

	if (dueDateFrom || dueDateTo) {
		filter.dueDate = {}
		if (dueDateFrom) filter.dueDate.$gte = new Date(dueDateFrom as string)
		if (dueDateTo) filter.dueDate.$lte = new Date(dueDateTo as string)
	}

	const todos = await TodoModel.find(filter).select('-__v')
	res.json(todos)
}

export const createTodo = async (req: Request, res: Response) => {
	const {
		title,
		completed = false,
		category,
		dueDate,
	} = req.body as CreateTodoDto

	let categoryId = undefined
	if (category) {
		const cat = await CategoryModel.findOne({
			_id: category,
			owner: req.session.userId,
		})
		if (!cat) {
			return res.status(400).json({ error: 'Invalid category ID' })
		}
		categoryId = cat._id
	}

	const todo = await TodoModel.create({
		title,
		completed,
		dueDate: parseDate(dueDate),
		category: categoryId,
		owner: req.session.userId,
	})

	res.status(201).json(todo)
}

export const updateTodo = async (req: Request, res: Response) => {
	const { id } = req.params
	const {
		title,
		completed,
		category: categoryIdStr,
		dueDate,
	} = req.body as UpdateTodoDto
	let validatedCategoryId: Types.ObjectId | undefined

	if (categoryIdStr !== undefined) {
		if (categoryIdStr === null || categoryIdStr === '') {
			validatedCategoryId = undefined
		} else {
			if (!Types.ObjectId.isValid(categoryIdStr)) {
				return res.status(400).json({ error: 'Invalid category ID format' })
			}

			const category = await CategoryModel.findOne({
				_id: categoryIdStr,
				owner: req.session.userId,
			})

			if (!category) {
				return res
					.status(400)
					.json({ error: 'Category not found or does not belong to you' })
			}

			validatedCategoryId = new Types.ObjectId(categoryIdStr)
		}
	}

	const updateData: Partial<Todo> = {}
	if (title !== undefined) updateData.title = title
	if (completed !== undefined) updateData.completed = completed
	if (dueDate !== undefined) updateData.dueDate = parseDate(dueDate)
	if (categoryIdStr !== undefined) {
		updateData.category = validatedCategoryId
	}

	const todo = await TodoModel.findOneAndUpdate(
		{ _id: id, owner: req.session.userId },
		updateData,
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
