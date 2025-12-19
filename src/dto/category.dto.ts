import { IsString, IsOptional, Matches } from 'class-validator'

export class CreateCategoryDto {
	@IsString()
	name!: string

	@IsOptional()
	@Matches(/^#[0-9A-Fa-f]{6}$/, {
		message: 'Color must be a valid hex code (e.g. #FF5733)',
	})
	color?: string
}

export class UpdateCategoryDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@Matches(/^#[0-9A-Fa-f]{6}$/, {
		message: 'Color must be a valid hex code (e.g. #FF5733)',
	})
	color?: string
}
