import {
	BarChart,
	Bell,
	ChevronDown,
	Code,
	FileText,
	GitBranch,
	GitPullRequest,
	MessageSquare,
	Plus,
	Search,
	Settings,
	Users,
} from 'lucide-react';
import { useState } from 'react';



import { useDisclosure } from '@/hooks/use-disclosure';
import { useSession } from '@/lib/auth-client';


import CreateServerModal from '../modals/CreateServerModal';
import { ModeToggle } from './ThemeButton';
import { ProfileDropdown } from '../dropdown/ProfileDropdownMenu';
import { useClientState } from '@/hooks/use-client-state';
import { Avatar, AvatarFallback, AvatarImage, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, Input, Skeleton, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@the-web-app/ui';
import sendNotification from '@the-web-app/notifications';
import { NotificationType, Server, User } from '@the-web-app/types';



export default function Navbar() {
	const {server, servers, refetchServers, setServer, isLoadingServers} = useClientState();
	const [searchQuery, setSearchQuery] = useState('');

	if(isLoadingServers || !server) {
		return (
			<Skeleton className="h-14 w-full"/>
		)
	}


	return (
		<TooltipProvider>
			<div className="flex h-14 items-center justify-between border-b border-border/50 px-4">
				<div className="flex items-center">
					<ServerSelector
						onJoinServer={refetchServers}
						activeServer={server}
						servers={servers!}
						setServer={setServer}
					/>
					<MainNavigation />
				</div>
				<SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
				<div className="flex items-center gap-2">
					<UserActions />
					<ProfileDropdown/>
					<Button
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={async () => {
							await navigator.clipboard.writeText(server.id);
							sendNotification({
								type: NotificationType.Success,
								message: `Copied ID: ${server.id}`,
							});
							
						}}
					>
						<Code className="h-5 w-5" />
					</Button>
					<ModeToggle/>
				</div>
			</div>
		</TooltipProvider>
	);
}

// ServerSelector
function ServerSelector({
	activeServer,
	servers,
	setServer,
	onJoinServer,
}: {
	activeServer: Server
	servers: Server[]
	setServer: (server: Server) => void
	onJoinServer: () => void
}) {
	const [open, { toggle, close }] = useDisclosure(false);
	const { data } = useSession();

	return (
		<div>
			<CreateServerModal onClose={close} open={open} onJoinServer={onJoinServer} user={data?.user as unknown as User} />

			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="flex items-center gap-2 px-2 py-1 text-base font-medium">
						<span className="flex items-center gap-2 ">
							<Users className="h-4 w-4" />
							{activeServer.name}
						</span>
						<ChevronDown className="h-4 w-4 text-slate-500" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start" className="w-56">
					<DropdownMenuLabel>Switch Server</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{servers.map(server => (
						<DropdownMenuItem
							key={server.id}
							onClick={() => { setServer(server); }}
							className="flex items-center gap-2"
						>
							<span className="flex items-center gap-4">
								<Avatar className="h-6 w-6">
									<AvatarImage src="" alt={server.name} />
									<AvatarFallback>{server.name.charAt(0)}</AvatarFallback>
								</Avatar>
								{server.name}
							</span>
						</DropdownMenuItem>
					))}
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={toggle}>
						<Plus className="mr-2 h-4 w-4" />
						Join Server
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

function MainNavigation() {
	return (
	  <div className="ml-6 flex items-center space-x-1">
		<Tooltip>
		  <TooltipTrigger asChild>
			<Button variant="ghost" size="icon">
			  <MessageSquare className="h-4 w-4" />
			</Button>
		  </TooltipTrigger>
		  <TooltipContent>Server Chat</TooltipContent>
		</Tooltip>
		<Tooltip>
		  <TooltipTrigger asChild>
			<Button variant="ghost" size="icon">
			  <GitBranch className="h-4 w-4" />
			</Button>
		  </TooltipTrigger>
		  <TooltipContent>Repositories</TooltipContent>
		</Tooltip>
		<Tooltip>
		  <TooltipTrigger asChild>
			<Button variant="ghost" size="icon">
			  <GitPullRequest className="h-4 w-4" />
			</Button>
		  </TooltipTrigger>
		  <TooltipContent>Pull Requests</TooltipContent>
		</Tooltip>
		<Tooltip>
		  <TooltipTrigger asChild>
			<Button variant="ghost" size="icon">
			  <FileText className="h-4 w-4" />
			</Button>
		  </TooltipTrigger>
		  <TooltipContent>Documents</TooltipContent>
		</Tooltip>
		<Tooltip>
		  <TooltipTrigger asChild>
			<Button variant="ghost" size="icon">
			  <BarChart className="h-4 w-4" />
			</Button>
		  </TooltipTrigger>
		  <TooltipContent>Analytics</TooltipContent>
		</Tooltip>
	  </div>
	)
  }

// SearchBar
function SearchBar({ searchQuery, setSearchQuery }: { searchQuery: string; setSearchQuery: (v: string) => void }) {
	return (
	  <div className="relative mr-2 w-[60%]">
		<Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
		<Input
		  placeholder="Search (ctrl + k)"
		  className="h-9 pl-8 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
		  value={searchQuery}
		  onChange={(e) => {
			setSearchQuery(e.target.value)
		  }}
		/>
	  </div>
	)
  }

function UserActions() {
	return (
	  <>
		<Tooltip>
		  <TooltipTrigger asChild>
			<Button variant="ghost" size="icon">
			  <Bell className="h-5 w-5" />
			</Button>
		  </TooltipTrigger>
		  <TooltipContent>Notifications</TooltipContent>
		</Tooltip>
		<Tooltip>
		  <TooltipTrigger asChild>
			<Button variant="ghost" size="icon">
			  <Settings className="h-5 w-5" />
			</Button>
		  </TooltipTrigger>
		  <TooltipContent>Settings</TooltipContent>
		</Tooltip>
	  </>
	)
  }

