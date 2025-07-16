'use client'

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { z } from 'zod';

import { signIn, signUp, useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { useToggle } from '@/hooks/use-toggle';
import { useRouter } from 'next/navigation';
import { Button, Card, Checkbox, Form, FormField, Input, Label } from '@the-web-app/ui';
import sendNotification from '@the-web-app/notifications';
import { NotificationType } from '@the-web-app/types';
import { useForm } from 'react-hook-form';

function LoginForm({ onSubmit, onToggle, loading }: { onSubmit: (values: any) => void, onToggle: () => void, loading: boolean }) {
	const loginFormSchema = z.object({
		email: z.string().email(),
		password: z.string().min(6, {
			message: 'Password should include at least 6 characters',
		}),
	});
	const loginForm = useForm({
		resolver: zodResolver(loginFormSchema),
		defaultValues: { email: '', password: '' },
	});

	useEffect(() => {
		loginForm.reset({ email: '', password: '' });
	}, [loginForm]);

	return (
		<Form {...loginForm}>
			<div className="space-y-4">
				<FormField
					control={loginForm.control}
					name="email"
					render={({ field, fieldState }) => (
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								required
								placeholder="john@email.com"
								value={field.value || ''}
								onChange={field.onChange}
							/>
							{fieldState.error && (
								<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
							)}
						</div>
					)}
				/>
				<FormField
					control={loginForm.control}
					name="password"
					render={({ field, fieldState }) => (
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								required
								placeholder="Your password"
								value={field.value || ''}
								onChange={field.onChange}
							/>
							{fieldState.error && (
								<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
							)}
						</div>
					)}
				/>
			</div>
			<div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-2">
				<Button
					variant='transparent'
					type="button"
					className={cn('text-xs text-muted-foreground hover:underline border-none p-0')}
					onClick={onToggle}
				>
					Don't have an account? Register
				</Button>
				<Button type="submit" disabled={loading} className="rounded-full w-full sm:w-auto" onClick={loginForm.handleSubmit(onSubmit)}>
					{loading ? <Loader2 className="animate-spin" /> : 'Login'}
				</Button>
			</div>
		</Form>
	);
}

function RegisterForm({ onSubmit, onToggle }: { onSubmit: (values: any) => void, onToggle: () => void }) {
	const registerFormSchema = z.object({
		email: z.string().email(),
		name: z.string().min(6, {
			message: 'Name should include at least 6 characters',
		}),
		password: z.string().min(6, {
			message: 'Password should include at least 6 characters',
		}),
		terms: z.boolean().refine(value => value, {
			message: 'You must accept the terms and conditions',
		}),
	});
	const registerForm = useForm({
		resolver: zodResolver(registerFormSchema),
		defaultValues: { email: '', name: '', password: '', terms: false },
	});

	useEffect(() => {
		registerForm.reset({ email: '', name: '', password: '', terms: false });
	}, [registerForm]);

	return (
		<Form {...registerForm}>
			<div className="space-y-4">
				<FormField
					control={registerForm.control}
					name="name"
					render={({ field, fieldState }) => (
						<div className="space-y-2">
							<Label htmlFor="username">Name</Label>
							<Input
								id="username"
								placeholder="Your name"
								value={field.value}
								onChange={e => { field.onChange(e.target.value); }}
							/>
							{fieldState.error && (
								<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
							)}
						</div>
					)}
				/>
				<FormField
					control={registerForm.control}
					name="email"
					render={({ field, fieldState }) => (
						<div className="space-y-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								type="email"
								required
								placeholder="hello@shadcn.dev"
								value={field.value || ''}
								onChange={field.onChange}
							/>
							{fieldState.error && (
								<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
							)}
						</div>
					)}
				/>
				<FormField
					control={registerForm.control}
					name="password"
					render={({ field, fieldState }) => (
						<div className="space-y-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								type="password"
								required
								placeholder="Your password"
								value={field.value || ''}
								onChange={field.onChange}
							/>
							{fieldState.error && (
								<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
							)}
						</div>
					)}
				/>
				<FormField
					control={registerForm.control}
					name="terms"
					render={({ field, fieldState }) => (
						<div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="terms"
									checked={!!field.value}
									onCheckedChange={field.onChange}
								/>
								<Label htmlFor="terms">I accept terms and conditions</Label>
							</div>
							{fieldState.error && (
								<p className="text-xs text-red-500 mt-1">{fieldState.error.message}</p>
							)}
						</div>
					)}
				/>
			</div>
			<div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-2">
				<button
					type="button"
					className={cn('text-xs text-muted-foreground hover:underline bg-transparent border-none p-0')}
					onClick={onToggle}
				>
					Already have an account? Login
				</button>
				<Button type="submit" className="rounded-full w-full sm:w-auto" onClick={registerForm.handleSubmit(onSubmit)}>
					Register
				</Button>
			</div>
		</Form>
	);
}

const LoginPage: React.FC = () => {
	const [type, toggle] = useToggle(['login', 'register']);
	const router = useRouter();
	const [isLoading, setLoading] = useState(false);
	const session = useSession();

	const hasRedirected = useRef(false);

	useEffect(() => {
		const user = session.data?.user;

		if (user && !hasRedirected.current) {
			hasRedirected.current = true;
			router.push('/');
		}
	}, [session.data?.user, router]); // just track if user exists

	const handleLoginSubmit = async (values: Record<string, string>) => {
		await signIn.email({
			email: values.email,
			password: values.password,
			callbackURL: '/',
			rememberMe: true,
			

		}, {
			onRequest: (ctx) => {
				setLoading(true);
				sendNotification({
					message: 'Logging in...',
					type: NotificationType.Info,
				});
				console.log(ctx);
			},
			onSuccess: () => {
				sendNotification({
					message: 'You have successfully logged in',
					type: NotificationType.Success,
				});
			},
		});
	};

	const handleRegisterSubmit = async (values: Record<string, string>) => {
		await signUp.email(
			{
				email: values.email,
				password: values.password,
				name: values.name,
				callbackURL: '/',
			}
		);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen w-full gap-4 px-2 bg-background">
			<Label className="text-xl text-center text-foreground">Welcome to The Web App</Label>
			<Card className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-[28rem] p-6 sm:p-8 border rounded-lg shadow">
				{type === 'login'
					? (
							<LoginForm onSubmit={handleLoginSubmit} loading={isLoading} onToggle={toggle} />
						)
					: (
							<RegisterForm onSubmit={handleRegisterSubmit} onToggle={toggle} />
						)}
			</Card>
		</div>
	);
};

export default LoginPage;