import { getModelForClass, prop, Ref } from '@typegoose/typegoose'
import { User } from './User'

export class Todo {
	@prop({ required: true, trim: true })
	title!: string

	@prop({ default: false })
	completed!: boolean

	@prop({ ref: () => User, required: true })
	owner!: Ref<User>
}

export const TodoModel = getModelForClass(Todo)
