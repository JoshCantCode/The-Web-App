
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ClipboardCopy, Hash, Plus, Search, Star, Trash, XIcon } from 'lucide-react';
import { useState } from 'react';

import { deleteChannel, favouriteChannel, type FavouritedChannel, getFavouritedChannels, unfavouriteChannel } from '@/api/server';
import { useClientState } from '@/hooks/use-client-state';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useSession } from '@/lib/auth-client';
import { cn } from '@/lib/utils';

import { CreateServerCategoryModal, CreateServerChannelModal } from '../modals/ServerCreateItem';
import { Button, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, Input, Label } from '@the-web-app/ui';
import sendNotification from '@the-web-app/notifications';
import { Category, NotificationType, Channel } from '@the-web-app/types';


export function ServerSidebar() {
	const state = useClientState();
	const { server: currentServer, channel: activeChannel, setChannel, refreshServer } = state;
	const session = useSession();
	const user = session.data?.user;

	const [searchQuery, setSearchQuery] = useState("")

	const {
		data: favourites = [],
		isLoading: loadingFavourites,
		refetch: refetchFavourites,
	} = useQuery({
		queryKey: ['favouritedChannels', user?.id, currentServer?.id],
		queryFn: () => user && currentServer ? getFavouritedChannels(user.id, currentServer.id) : Promise.resolve([]),
		enabled: !!user && !!currentServer,
	});

	if (!user) {
		return null;
	}
	console.log("Current Server:", currentServer);
	if (!currentServer) {
		return null;
	}

	const filteredCategories = currentServer.categories.map((category) => ({
		...category,
		channels: category.channels?.filter((channel) => {
			// Check if channel matches search query
			const matchesSearch = searchQuery 
				? channel.name.toLowerCase().includes(searchQuery.toLowerCase()) 
				: true;
			
			// Check if channel is not favorited
			const isNotFavorited = !favourites?.some(fav => fav.channel.id === channel.id);
			
			return matchesSearch && isNotFavorited;
		}),
	})).filter((category) => category.channels && category.channels.length > 0)

	return (
		<div className="w-full flex flex-col h-full">
			<div className="flex items-center justify-between border-b border-border/50 p-4">
				<h2 className="text-base font-medium">Channels</h2>
				<CreateButton serverId={currentServer.id} />
			</div>
			<div className="flex items-center gap-2 p-3">
				<Search className="h-4 w-4 text-muted-foreground" />
				<Input
				placeholder="Search channels"
				className="h-8 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-border"
				value={searchQuery}
				onChange={(e) => { setSearchQuery(e.target.value); }}
				/>
			</div>
			<div className="flex-1 overflow-y-auto px-2">
        {favourites && favourites.length > 0 && (
          <FavouritedChannelsSection
            channels={favourites}
            onChannelSelect={setChannel}
            onUnfavourite={refetchFavourites}
            activeChannel={activeChannel}
          />
        )}

        <div className="py-1">
          {filteredCategories.map((category: Category) => (
            <ChannelGroup
              key={category.id}
              title={category.name}
              channels={category.channels ?? []}
              activeChannel={activeChannel}
              onChannelSelect={setChannel}
              onFavourite={() => {
				refetchFavourites();
				refreshServer();
			  }}
              serverId={currentServer.id}
            />
          ))}
        </div>
      </div>
		</div>
	);
}

function CreateButton({ serverId }: { serverId: string }) {
	const [channelOpened, { open: channelOpen, close: channelClose }] = useDisclosure(false);
	const [categoryOpened, { open: categoryOpen, close: categoryClose }] = useDisclosure(false);
	const { refreshServer } = useClientState();

	return (
		<>
			<CreateServerChannelModal onClose={channelClose} open={channelOpened} serverId={serverId} onCreated={refreshServer} />
			<CreateServerCategoryModal onClose={categoryClose} open={categoryOpened} serverId={serverId} onCreated={refreshServer} />
			<DropdownMenu>
				<DropdownMenuTrigger>
					<Button variant="ghost" size="sm">
						<Plus className="h-3 w-3" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuItem onClick={channelOpen}>
						<Plus className="h-3 w-3 mr-1" />
						<Label>Create a channel</Label>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={categoryOpen}>
						<Plus className="h-3 w-3 mr-1" />
						<Label>Create a category</Label>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
}

interface ChannelGroupProps {
	title: string
	channels: Channel[]
	activeChannel: Channel | null
	onChannelSelect: (channel: Channel) => void
	onFavourite: () => void
	serverId: string
}

function ChannelGroup({ title, channels, activeChannel, onChannelSelect, onFavourite, serverId }: ChannelGroupProps) {
	const [isOpen, setIsOpen] = useState(true)
	const session = useSession();

	const handleDeleteChannel = async (channel: Channel) => {
		try {
			await deleteChannel(channel.id);
			sendNotification({
				type: NotificationType.Success,
				message: "Successfully deleted channel!",
			});
			onFavourite(); // Refetches channels. I need to rename
		} catch {
			sendNotification({
				type: NotificationType.Error,
				message: "Failed to delete channel.",
			});
			console.log("Failed to delete channel");
		}
	}

	const handleFavouriteChannel = async (channel: Channel) => {
		const user = session.data?.user;

		try {
			await favouriteChannel(channel.id, user!.id, serverId);
			sendNotification({
				type: NotificationType.Success,
				message: "Successfully favourited channel!",
			});
			onFavourite();
		} catch (error) {
			sendNotification({
				type: NotificationType.Error,
				message: "Failed to favourite channel.",
			});
		}
	}

	return (
		<div className="mb-2">
			<div
				className="flex items-center justify-between py-1 px-2 text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground"
				onClick={() => { setIsOpen(!isOpen); }}
			>
				<Label className="text-sm">{title}</Label>
				<ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? "rotate-0" : "-rotate-90"}`} />
			</div>
			<div className={`mt-1 space-y-1 ${isOpen ? "block" : "hidden"}`}>
				{channels.map((channel) => (
					<ContextMenu key={channel.id}>
						<ContextMenuTrigger>
							<ChannelButton
								channel={channel}
								active={activeChannel?.id === channel.id}
								onClick={() => { onChannelSelect(channel); }}
							/>
						</ContextMenuTrigger>
						<ContextMenuContent>
							<ContextMenuItem onClick={() => { handleFavouriteChannel(channel); }}>
								<Star className="h-3 w-3 mr-1" />
								<Label>Favourite channel</Label>
							</ContextMenuItem>
							
							<ContextMenuItem>
								<ClipboardCopy className="h-3 w-3 mr-1" />
								<Label>Copy channel ID</Label>
							</ContextMenuItem>
							<ContextMenuSeparator/>
							<ContextMenuItem variant='destructive' onClick={() => handleDeleteChannel(channel)}>
								<Trash className="h-3 w-3 mr-1" />
								<Label>Delete channel</Label>
							</ContextMenuItem>
						</ContextMenuContent>
					</ContextMenu>
				))}
			</div>
		</div>
	)
}

interface ChannelButtonProps {
	channel: Channel
	active: boolean
	onClick: () => void

}

function ChannelButton({ channel, onClick, active }: ChannelButtonProps) {
	return (
		
	  <Button
		key={channel.id}
		variant="ghost"
		className={cn(
		  "w-full justify-start px-2 py-1.5 text-sm font-normal",
		  active
			? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
			: "hover:bg-muted hover:text-foreground",
		)}
		onClick={onClick}
	  >
		<Hash className="mr-2 h-4 w-4" />
		{channel.name}
	  </Button>
	)
}

interface FavouritedChannelsSectionProps {
	channels: FavouritedChannel[]
	onChannelSelect: (channel: Channel) => void
	onUnfavourite: () => void
	activeChannel: Channel | null
}
  
function FavouritedChannelsSection({
	channels,
	onChannelSelect,
	onUnfavourite,
	activeChannel,
}: FavouritedChannelsSectionProps) {
	if (channels.length === 0) return null

	const handleUnfavouriteChannel = async (channel: FavouritedChannel) => {

		try {
			await unfavouriteChannel({
				channelId: channel.channel.id,
				userId: channel.user.id,
				serverId: channel.server.id,
			});
			sendNotification({
				type: NotificationType.Success,
				message: "Successfully unfavourited channel!",
			});
			onUnfavourite();
		} catch (error) {
			sendNotification({
				type: NotificationType.Error,
				message: "Failed to unfavourite channel.",
			});
		}
	}

	return (
	<>
		<div className="flex items-center justify-between py-1 px-2 text-xs font-medium text-muted-foreground">
		<Label className="text-sm">Favourites</Label>
		</div>
		<div className="py-1">
		{channels.map((fc) => (
			<div
			className={cn(
				"flex items-center pl-1 pr-2 rounded-md text-sm group hover:bg-muted",
				activeChannel && activeChannel.id === fc.channel.id
				? "bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
				: "",
			)}
			key={fc.id}
			>
			<div className="flex flex-1 items-center">
				<ChannelButton
				channel={fc.channel}
				active={activeChannel?.id === fc.channel.id}
				onClick={() => { onChannelSelect(fc.channel); }}
				/>
				<Hash className="mr-2 h-4 w-4" />
			</div>
			<XIcon
				width={18}
				height={18}
				className="ml-2 cursor-pointer flex-shrink-0 text-muted-foreground hover:text-destructive"
				style={{ minWidth: 18, minHeight: 18 }}
				onClick={() => { handleUnfavouriteChannel(fc); }}
			/>
			</div>
		))}
		</div>
	</>
	)
}