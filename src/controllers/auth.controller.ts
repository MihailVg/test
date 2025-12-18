import { Request, Response } from 'express'
import { UserModel } from '../models/User'

export const register = async (req: Request, res: Response) => {
	const { email, password } = req.body

	if (!email || !password) {
		return res.status(400).json({ error: 'Email and password required' })
	}

	const existing = await UserModel.findOne({ email })
	if (existing) {
		return res.status(409).json({ error: 'Email already in use' })
	}

	const user = new UserModel({ email })
	await user.setPassword(password)
	await user.save()

	req.session.userId = user._id.toString()
	return res.status(201).json({ message: 'User created', userId: user._id })
}

export const login = async (req: Request, res: Response) => {
	const { email, password } = req.body

	const user = await UserModel.findOne({ email }).select('+passwordHash')
	if (!user || !(await user.verifyPassword(password))) {
		return res.status(401).json({ error: 'Invalid email or password' })
	}

	req.session.userId = user._id.toString()
	return res.json({ message: 'Logged in', userId: user._id })
}

export const logout = (req: Request, res: Response) => {
	req.session.destroy(err => {
		if (err) return res.status(500).json({ error: 'Logout failed' })
		res.clearCookie('connect.sid')
		res.json({ message: 'Logged out' })
	})
}

export const me = async (req: Request, res: Response) => {
	if (!req.session.userId) {
		return res.status(401).json({ error: 'Not authenticated' })
	}
	const user = await UserModel.findById(req.session.userId).select(
		'-passwordHash -__v'
	)
	if (!user) {
		return res.status(404).json({ error: 'User not found' })
	}
	res.json({ user })
}
