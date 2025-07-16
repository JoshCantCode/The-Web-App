import { Options } from '@mikro-orm/core';
import { EntityGenerator } from '@mikro-orm/entity-generator';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options<PostgreSqlDriver> = {
	driver: PostgreSqlDriver,
	host: 'ep-odd-band-abgfjxqs-pooler.eu-west-2.aws.neon.tech',
	port: 5432,
	user: 'the-web_owner',
	password: 'npg_kmDALSjfP82u',
	dbName: 'the-web',

	// Use TS files in development and JS files in production
	entities: ['src/entities/**/*.js'],
	entitiesTs: ['src/entities/**/*.ts'], // Use .ts in development

	debug: true,

	migrations: {
		path: 'dist/migrations', // Compiled JS migrations
		pathTs: 'src/migrations', // TS migrations in development
		disableForeignKeys: false,
	},

	driverOptions: {
		connection: {
			ssl: true,
		},
	},
	extensions: [
		EntityGenerator,
	],
	metadataProvider: TsMorphMetadataProvider,
	allowGlobalContext: true,
};

export default config;
