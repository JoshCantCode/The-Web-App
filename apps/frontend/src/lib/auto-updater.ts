/* eslint-disable no-console */
import { check } from '@tauri-apps/plugin-updater';

export async function autoUpdate() {
	const update = await check();
	try {
		console.log(`New version available: ${update?.version}`);
		await update?.downloadAndInstall();
	} catch (error) {
		console.error('Failed to update:', error);
	}
}
