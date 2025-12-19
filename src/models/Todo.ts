import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from './User'
import { Category } from './Category'

export class Todo {
	@prop({ required: true, trim: true })
	title!: string

	@prop({ default: false })
	completed!: boolean

	@prop({ required: false })
	dueDate?: Date

	@prop({ ref: () => Category, required: false })
	category?: Ref<Category>

	@prop({ ref: () => User, required: true })
	owner!: Ref<User>
}

export const TodoModel = getModelForClass(Todo)
