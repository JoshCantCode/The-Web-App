'use client';

import { relaunch } from '@tauri-apps/plugin-process';
import { Download, RefreshCw } from 'lucide-react';
import { useState } from 'react';


import { autoUpdate } from '@/lib/auto-updater';
import { Button, Card, CardContent, CardFooter, CardHeader, CardTitle } from '@the-web-app/ui';
import { Progress } from '@radix-ui/react-progress';

export default function UpdateAvailablePage() {
	const [updateState, setUpdateState] = useState<'available' | 'downloading' | 'complete'>('available');
	const [progress, setProgress] = useState(0);

	const handleUpdate = async () => {
		setUpdateState('downloading');

		// Simulate download progress
		let currentProgress = 0;
		const interval = setInterval(async () => {
			currentProgress += 5; // Increment progress
			setProgress(currentProgress);

			if (currentProgress >= 100) {
				clearInterval(interval);
				try {
					await autoUpdate();
					setUpdateState('complete');
				} catch (error) {
					console.error('Update failed:', error);
					setUpdateState('available');
				}
			}
		}, 200);
	};

	const handleRestart = async () => {
		await relaunch();
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-background p-4">
			<Card className="w-full max-w-md">
				<CardHeader className="text-center">
					<div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
						<RefreshCw className="h-8 w-8 text-primary" />
					</div>
					<CardTitle className="text-2xl">New Update Available</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					{updateState === 'downloading' && (
						<div className="space-y-2">
							<div className="flex justify-between text-sm">
								<span>Downloading update...</span>
								<span>
									{progress}
									%
								</span>
							</div>
							<Progress value={progress} className="h-2" />
						</div>
					)}

					{updateState === 'complete' && (
						<div className="text-center space-y-2">
							<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
								<Download className="h-6 w-6 text-green-600" />
							</div>
							<p className="font-medium text-green-600">Update downloaded successfully!</p>
							<p className="text-sm text-muted-foreground">The application needs to restart to apply the update.</p>
						</div>
					)}
				</CardContent>
				<CardFooter className="flex flex-col space-y-2">
					{updateState === 'available' && (
						<div>
                            <Button onClick={handleUpdate} className="w-full">
								Update Now
							</Button>
                        </div>
					)}

					{updateState === 'downloading' && (
						<Button variant="outline" disabled className="w-full">
							Downloading...
						</Button>
					)}

					{updateState === 'complete' && (
						<Button onClick={handleRestart} className="w-full">
							Restart Now
						</Button>
					)}
				</CardFooter>
			</Card>
		</div>
	);
}
