import {
	IsString,
	IsBoolean,
	IsOptional,
	IsISO8601,
	IsEnum,
} from 'class-validator'

export type Priority = 'low' | 'medium' | 'high'
export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly'

export class CreateTodoDto {
	@IsString()
	title!: string

	@IsOptional()
	@IsString()
	category?: string

	@IsOptional()
	@IsISO8601()
	dueDate?: string

	@IsOptional()
	@IsBoolean()
	completed?: boolean
}

export class UpdateTodoDto {
	@IsOptional()
	@IsString()
	title?: string

	@IsOptional()
	@IsString()
	@IsOptional()
	category?: string | null

	@IsOptional()
	@IsISO8601()
	dueDate?: string

	@IsOptional()
	@IsBoolean()
	completed?: boolean
}
