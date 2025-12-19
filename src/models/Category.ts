import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from './User'

export class Category {
	@prop({ required: true, trim: true })
	name!: string

	@prop({ required: false, match: /^#[0-9A-Fa-f]{6}$/ })
	color?: string

	@prop({ ref: () => User, required: true })
	owner!: Ref<User>
}

export const CategoryModel = getModelForClass(Category)
