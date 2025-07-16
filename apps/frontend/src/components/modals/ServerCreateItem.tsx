'use client'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { createCategory, createChannel, getServerCategories } from '@/api/server';
import { Category, ModalProps } from '@the-web-app/types';
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Form, FormField, Input, Label, Select } from '@the-web-app/ui';

type CreateModalProps = {
	serverId: string
	onCreated: () => void
} & ModalProps;

export function CreateServerChannelModal({ serverId, onCreated, ...props }: CreateModalProps) {
	const [categories, setCategories] = useState<Category[]>([]);
	const formSchema = z.object({
		name: z.string().min(4, 'Channel name must be at least 4 characters'),
		description: z.string().min(4, 'Description must be at least 4 characters'),
		category: z.string().min(1, 'Please select a category'),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			name: '',
			description: '',
			category: '',
		},
		resolver: zodResolver(formSchema),
	});

	const handleAddChannelClick = async (values: z.infer<typeof formSchema>) => {
		const channel = {
			name: values.name,
			description: values.description,
			categoryId: values.category,
			serverId,
		};

		const createdChannel = await createChannel(channel);
		if (!createdChannel) {
			return;
		}

		props.onClose();
		onCreated();
		form.reset();
	};

	useEffect(() => {
		if (props.open) {
		  getServerCategories(serverId).then(fetched => {
			setCategories(fetched ?? []);
		  });
		}
	  }, [props.open, serverId]);

	return (
		<Dialog open={props.open} onOpenChange={props.onClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Create a new channel</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<div className="space-y-2">
									<Label htmlFor="channel-name">Channel name</Label>
									<Input
										id="channel-name"
										placeholder="General"
										{...field}
									/>
									{fieldState.error && (
										<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
									)}
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field, fieldState }) => (
								<div className="space-y-2">
									<Label htmlFor="channel-description">Channel description</Label>
									<Input
										id="channel-description"
										placeholder="A general channel"
										{...field}
									/>
									{fieldState.error && (
										<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
									)}
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="channel-category">Choose the category</Label>
									<Select
										title="Choose a category"
										values={categories.map(c => ({ label: c.name, value: c.id }))}
										value={field.value}
										onChange={field.onChange}
										className="w-full"
										id="channel-category"
									/>
								</div>
							)}
						/>
					</div>
					<Button type="submit" className="mt-4" onClick={form.handleSubmit(handleAddChannelClick)}>
						Create Channel
					</Button>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

export function CreateServerCategoryModal({ serverId, onCreated, ...props }: CreateModalProps) {
	const formSchema = z.object({
		name: z.string().min(4, 'A category name longer than 4 characters is required'),
		description: z.string().min(1, 'Description is required'),
	});

	const form = useForm<z.infer<typeof formSchema>>({
		defaultValues: {
			name: '',
			description: 'A general category',
		},
		resolver: zodResolver(formSchema),
	});

	const handleAddCategoryClick = async (values: z.infer<typeof formSchema>) => {
		const category = {
			name: values.name,
			description: values.description,
			serverId,
		};
		const createdCategory = await createCategory(category);

		if (!createdCategory) {
			return;
		}

		props.onClose();
		onCreated();
		form.reset();
	};

	return (
		<Dialog open={props.open} onOpenChange={props.onClose}>
			<DialogContent>
				<DialogHeader>Create a new category</DialogHeader>
				<Form {...form}>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field, fieldState }) => (
								<div className="space-y-2">
									<Label htmlFor="category-name">Category name</Label>
									<Input
										id="category-name"
										placeholder="Category name"
										{...field}
									/>
									{fieldState.error && (
										<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
									)}
								</div>
							)}
						/>
						<FormField
							control={form.control}
							name="description"
							render={({ field, fieldState }) => (
								<div className="space-y-2">
									<Label htmlFor="category-description">Category description</Label>
									<Input
										id="category-description"
										placeholder="A general category"
										{...field}
									/>
									{fieldState.error && (
										<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
									)}
								</div>
							)}
						/>
					</div>
					<Button type="submit" className="mt-4" onClick={form.handleSubmit(handleAddCategoryClick)}>
						Create Category
					</Button>
				</Form>
			</DialogContent>
		</Dialog>
	);
}