import { Request, Response } from 'express'
import { Category, CategoryModel } from '../models/Category'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'
import { TodoModel } from '../models/Todo'

export const getCategories = async (req: Request, res: Response) => {
	const categories = await CategoryModel.find({
		owner: req.session.userId,
	}).select('-__v')
	res.json(categories)
}

export const createCategory = async (req: Request, res: Response) => {
	const { name, color } = req.body as CreateCategoryDto

	const existing = await CategoryModel.findOne({
		name,
		owner: req.session.userId,
	})
	if (existing) {
		return res
			.status(409)
			.json({ error: 'Category with this name already exists' })
	}

	const category = await CategoryModel.create({
		name,
		color,
		owner: req.session.userId,
	})

	res.status(201).json(category)
}

export const updateCategory = async (req: Request, res: Response) => {
	const { id } = req.params
	const { name, color } = req.body as UpdateCategoryDto
	const userId = req.session.userId

	const category = await CategoryModel.findOne({ _id: id, owner: userId })
	if (!category) {
		return res
			.status(404)
			.json({ error: 'Category not found or access denied' })
	}

	if (name !== undefined && name !== category.name) {
		const duplicate = await CategoryModel.findOne({
			name,
			owner: userId,
			_id: { $ne: id },
		})

		if (duplicate) {
			return res
				.status(409)
				.json({ error: 'Category with this name already exists' })
		}
	}

	const updateData: Partial<Category> = {}
	if (name !== undefined) updateData.name = name
	if (color !== undefined) updateData.color = color

	const updatedCategory = await CategoryModel.findByIdAndUpdate(
		id,
		updateData,
		{ new: true, runValidators: true }
	)

	const { __v, ...cleanCategory } = updatedCategory!.toObject()
	return res.json(cleanCategory)
}

export const deleteCategory = async (req: Request, res: Response) => {
	const { id } = req.params

	const result = await CategoryModel.deleteOne({
		_id: id,
		owner: req.session.userId,
	})
	if (result.deletedCount === 0) {
		return res.status(404).json({ error: 'Category not found' })
	}

	await TodoModel.updateMany({ category: id }, { $unset: { category: 1 } })

	res.status(204).send()
}
