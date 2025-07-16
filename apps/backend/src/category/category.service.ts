import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';

import { CreateCategoryDto } from '@the-web-app/types';
import { Category } from '../entities/category/Category.entity';
import { Server } from '../entities/server/Server.entity';
import { generateId } from '../utils/generator';

@Injectable()
export class CategoryService {

	constructor(
		private readonly em: EntityManager,
        @InjectRepository(Server) private readonly serverRepository: EntityRepository<Server>,
		@InjectRepository(Category) private readonly categoryRepository: EntityRepository<Category>
	) {}

	async createCategory(body: CreateCategoryDto) {
		const server = await this.serverRepository.findOne({ id: body.serverId });

		if (!server) {
			return {
				status: 404,
				message: 'Server not found',
			};
		}

		const category = new Category();
		category.id = `${body.serverId}-category-${generateId(12)}`;
		category.name = body.name;
		category.server = server;

		await this.em.persistAndFlush(category);

		return {
			status: 200,
			message: 'Category created successfully',
			category,
		};
	}

	async getCategory(id: string) {
		const category = await this.categoryRepository.findOne({ id }, { populate: ['server', 'channels'] });
		if (!category) {
			return {
				status: 404,
				message: 'Category not found',
				category: null,
			};
		}

		return {
			status: 200,
			message: 'Category found',
			category,
		};
	}

	async deleteCategory(categoryId: string) {
		const category = await this.categoryRepository.findOne({ id: categoryId });
		if (!category) {
			return {
				status: 404,
				message: 'Category not found',
			};
		}
		const server = await this.serverRepository.findOne({ id: category.server.id });
		if (!server) {
			return {
				status: 404,
				message: 'Server not found',
			};
		}
		if (server.id !== category.server.id) {
			return {
				status: 401,
				message: 'Unauthorized',
			};
		}

		const channels = category.channels;

		await this.em.removeAndFlush(channels);
		// Remove the category from the server
		server.categories.remove(category);
		await this.em.persistAndFlush(server);

		await this.em.removeAndFlush(category);

		return {
			status: 200,
			message: 'Category deleted successfully',
		};
	}

	async getCategoriesForServer(serverId: string) {
		const server = await this.serverRepository.findOne({ id: serverId }, { populate: ['categories'] });
		if (!server) {
			return {
				status: 404,
				message: 'Server not found',
				categories: null,
			};
		}

		if (!server.categories || server.categories.length === 0) {
			return {
				status: 401,
				message: 'No categories found for this server',
				categories: null,
			};
		}

		return {
			status: 200,
			message: 'Categories found',
			categories: server.categories,
		};
	}

}