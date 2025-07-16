/* eslint-disable @typescript-eslint/no-misused-promises */
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogTitle } from '@radix-ui/react-dialog';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createServer, joinServer } from '@/api/server';
import { ModalProps, User } from '@the-web-app/types';
import { Form, Button, DialogContent, DialogHeader, FormField, Input, Label, Separator } from '@the-web-app/ui';

type CreateServerModalProps = {
	onJoinServer: () => void
	user: User
} & ModalProps;

export default function CreateServerModal(props: CreateServerModalProps) {
	const [serverIdInput, setServerIdInput] = useState('');
	const { user } = props;

	const formSchema = z.object({
		name: z.string().min(1),
		description: z.string().min(1),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			name: '',
			description: '',
		},
		resolver: zodResolver(formSchema),
	});

	const handleAddServerButtonClick = async (values: z.infer<typeof formSchema>) => {
		if (!values.name || !values.description) {
			return;
		}
		const server = await createServer({
			name: values.name,
			description: values.description,
			ownerId: user.id,
		});

		if (!server) {
			return;
		}

		props.onClose();
		form.reset();
		props.onJoinServer();
	};

	const handleJoinServerButtonClick = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		await joinServer(serverIdInput, user.id);

		props.onClose();
		props.onJoinServer();
		setServerIdInput('');
	};

	return (
		<Dialog open={props.open} onOpenChange={props.onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className='text-foreground'>Create a new server</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<div className="flex flex-col gap-6">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="name">Name</Label>
									<Input
										id="name"
										placeholder="The server name"
										value={field.value || ''}
										onChange={field.onChange}
									/>
								</div>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="description">Description</Label>
									<Input
										id="description"
										placeholder="The server description"
										value={field.value || ''}
										onChange={field.onChange}
									/>
								</div>
							)}
						/>

						<Button type="submit" onClick={form.handleSubmit(handleAddServerButtonClick)}>Create</Button>
					</div>
				</Form>
				<div className="flex flex-col gap-2">
					<Separator />
					<Label>Or join a server</Label>
					<form onSubmit={handleJoinServerButtonClick} className="flex-col flex gap-4">
						<Input placeholder="Enter a server ID" value={serverIdInput} onChange={e => { setServerIdInput(e.target.value); }} />
						<Button type="submit">Join</Button>
					</form>
				</div>
			</DialogContent>
		</Dialog>
	);
}