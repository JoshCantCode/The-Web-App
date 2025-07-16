import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from 'src/category/category.service';
import { CreateCategoryDto } from '@the-web-app/types';

@Controller('category')
export class CategoryController {

	constructor(
		private readonly categoryService: CategoryService
	) {}

	@Post('create')
	async createCategory(@Body() body: CreateCategoryDto) {
		return await this.categoryService.createCategory(body);
	}

	
	@Get(':id')
	async getCategory(@Param('id') id: string) {
		return await this.categoryService.getCategory(id);
	}

	@Get('server/:serverId')
	async getCategoriesForServer(@Param('serverId') serverId: string) {
		return await this.categoryService.getCategoriesForServer(serverId);
	}

	@Delete('delete')
	async deleteCategory(@Body() body: { categoryId: string }) {
		return await this.categoryService.deleteCategory(body.categoryId);
	}

}