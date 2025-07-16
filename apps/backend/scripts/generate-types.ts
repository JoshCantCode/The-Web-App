import 'reflect-metadata';

import { MikroORM } from '@mikro-orm/core';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Path where the generated interfaces will be saved
 */
const OUTPUT_DIR = path.resolve(__dirname, '../../the-web-types/src/entities');

/**
 * Function to convert MikroORM types to TypeScript types
 */
function mapType(prop: any): string {
	const typeMap: Record<string, string> = {
		string: 'string',
		number: 'number',
		boolean: 'boolean',
		Date: 'Date',
		BigInt: 'bigint',
		Buffer: 'Buffer',
		Channel: 'Channel',
		Category: 'Category',
		Server: 'Server',
		Message: 'Message',
		User: 'User',
		Json: 'any', // JSON fields are typically `any`
	};

	// Handle collection types (many-to-many or one-to-many relationships)
	if (Array.isArray(prop.type)) {
		console.log(`🔍 Collection detected for ${prop.type[0].name}`); // Log collection

		return `${prop.type[0].name}[]`; // If it's a collection (e.g., Message[]), return type array
	}

	// Handle ManyToOne or OneToOne relationships
	if (prop.entity) {
		console.log(`🔍 Relationship detected for ${prop.entity.name}`);

		return prop.entity.name; // Return the related entity type (e.g., Category, Message)
	}

	// Handle other primitive types
	return typeMap[prop.type] || 'any';
}

async function generateTypes() {
	const config = await import(path.resolve(__dirname, '../mikro-orm.config')).then(m => m.default);
	const orm = await MikroORM.init(config); // Initialize MikroORM

	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	const metadata = orm.getMetadata();
	const entityNames = Object.keys(metadata.getAll());
	const exports = entityNames.map(entityName => `export * from "./entities/${entityName}";`).join('\n');

	entityNames.forEach((entityName) => {
		const meta = metadata.get(entityName);

		// Track imports based on related entities
		const neededImports: Set<string> = new Set();

		// Start building the interface
		let interfaceStr = ``;

		// Loop through properties and determine what imports are needed
		interfaceStr += `export interface ${entityName} {\n`;

		Object.entries(meta.properties).forEach(([field, prop]) => {
			console.log(`🔹 Field: ${field}`, prop); // Debug each property

			// Ensure 'prop' has the 'type' property
			if (typeof prop !== 'object' || !('type' in prop)) {
				console.warn(`⚠️ Skipping field ${field} as it has no 'type'`);

				return;
			}

			// Check for relationships and add to imports
			if (prop.entity) {
				// If it is a relationship, add related entity to imports
				neededImports.add(prop.entity.name);
			} else if (Array.isArray(prop.type)) {
				// If it is a collection, add the related type (array)
				if (prop.type[0].name) {
					neededImports.add(prop.type[0].name); // Add the name of the related entity type
				}
			}

			const tsType = mapType(prop);
			interfaceStr += `  ${field}: ${tsType};\n`;
		});

		interfaceStr += `}\n`;

		// Create the imports at the top of the file based on needed imports
		if (neededImports.size > 0) {
			interfaceStr = `import { ${Array.from(neededImports).join(', ')} } from "./entities";\n\n${interfaceStr}`;
		}

		const filePath = path.join(OUTPUT_DIR, `${entityName}.ts`);
		fs.writeFileSync(filePath, interfaceStr, 'utf8');

		console.log(`✅ Generated: ${filePath}`);
	});

	// Write the index file
	fs.writeFileSync(path.resolve(__dirname, '../../the-web-types/src/index.ts'), exports, 'utf8');

	await orm.close();
}

generateTypes().catch(console.error);
