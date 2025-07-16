/* eslint-disable no-console */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';

import { AppModule } from './app.module';

export const origins: string[] = [
	'http://localhost:1420',
	'https://thewebapi-production.up.railway.app',
	'http://tauri.localhost',
	'tauri://localhost',
	'http://localhost:3000',
];

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		cors: {
			origin: origins,
			methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
			credentials: true,
		},
	});
	app.set('query parser', 'extended');
	app.setGlobalPrefix('api', { exclude: ['/api/auth/{*path}'] });

	app.useWebSocketAdapter(new IoAdapter(app));
	// eslint-disable-next-line node/prefer-global/process
	const port = process.env.PORT || 3001;
	app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
	await app.listen(port);

	console.log(`🚀 Server running on port ${port}`);
}
bootstrap();
