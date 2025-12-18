import { getModelForClass, prop } from '@typegoose/typegoose'
import { compare, hash } from 'bcrypt'

const SALT = Number(process.env.SALT)

export class User {
	@prop({ required: true, unique: true, lowercase: true })
	email!: string

	@prop({ required: true, select: false })
	passwordHash!: string

	async setPassword(password: string): Promise<void> {
		this.passwordHash = await hash(password, SALT)
	}

	async verifyPassword(password: string): Promise<boolean> {
		return compare(password, this.passwordHash)
	}
}

export const UserModel = getModelForClass(User)
