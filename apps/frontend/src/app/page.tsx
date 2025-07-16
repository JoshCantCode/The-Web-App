'use client'

import { useEffect } from 'react';
import ChatWindow from '@/components/chat/MainChatMenu';
import { ServerSidebar } from '@/components/main/ServerSidebar';
import { useSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';
import { Hash } from 'lucide-react';
import { ClientState, useClientState } from '@/hooks/use-client-state';
import Navbar from '@/components/main/Navbar';
import { Button, Card, CardContent, CardHeader, Label } from '@the-web-app/ui';
import CreateServerModal from '@/components/modals/CreateServerModal';
import { useDisclosure } from '@/hooks/use-disclosure';

export default function Home() {
	const { data: session } = useSession();
	const state = useClientState();
	const { server: currentServer, setServer, servers, isLoadingServers: loadingServers } = state;

	useEffect(() => {
		if (!session?.user) {
			redirect('/login');
		}
	}, [session?.user]);

	useEffect(() => {
		if (servers && servers.length > 0 && !currentServer) {
			setServer(servers[0]);
		}
	}, [servers, currentServer, setServer]);

	if (loadingServers) {
		return (
			<div className="flex h-screen items-center justify-center">
				<div className="flex flex-col items-center gap-4">
					<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
					<p className="text-sm text-muted-foreground">Loading servers...</p>
				</div>
			</div>
		);
	}
	
	if (!currentServer) {
		return <NoServerSelectedCard state={state} />;
	}

	return (
		<div className="flex h-screen w-full flex-col bg-background">
			<Navbar/>
			<div className="flex flex-1 overflow-hidden">
				<div className="w-[260px] min-w-[200px] h-full flex flex-col border-r border-border/50">
				<ServerSidebar/>
				</div>
			<div className="flex flex-1 flex-col overflow-hidden">
				<ChatWindow />
			</div>
			</div>
		</div>
	);
}


type NoServerSelectedCardProps = {
	state: ClientState
}


function NoServerSelectedCard({ state }: NoServerSelectedCardProps) {
	const { servers, isLoadingServers, setServer } = state;
	const { data } = useSession();
	const user = data?.user;
	const [open, { close, toggle }] = useDisclosure();

	if (isLoadingServers) {
		return <div>Loading...</div>;
	}
	if (servers && servers.length === 0) {
		return (
			<div>
				<CreateServerModal user={user!} onJoinServer={() => {}} open={open} onClose={close} />
				<Label>No servers found. Create or join a server to get started!</Label>
				<Button onClick={toggle}>Click here!</Button>
			</div>
		);
	}

	return (
		<Card>
			<CardHeader>Choose a server</CardHeader>
			<CardContent>
				{servers!.map((server) => (
					<Button key={server.id} variant="ghost" className="w-full justify-start px-2 py-1.5 text-sm font-normal" onClick={() => { setServer(server); }}>
						<Hash className="mr-2 h-4 w-4" />
						{server.name}
					</Button>
				))}
			</CardContent>
		</Card>
	)
}

