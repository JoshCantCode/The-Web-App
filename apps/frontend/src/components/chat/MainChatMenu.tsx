'use client'

import { Clock, CopyIcon, Hash, MoreHorizontal, Pencil, Trash } from 'lucide-react';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';

import { deleteMessage, editMessage, getCategory } from '@/api/server';
import { useSocket } from '@/hooks/use-socket';
import { useSession } from '@/lib/auth-client';

import { ChatInput } from './ChatInput';
import ChatMessage from './ChatMessage';
import { useClientState } from '@/hooks/use-client-state';
import EditMessageModal from '../modals/EditMessageModal';
import { useDisclosure } from '@/hooks/use-disclosure';
import { Channel, Message, NotificationType } from '@the-web-app/types';
import sendNotification from '@the-web-app/notifications';
import { Button, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger, ScrollArea } from '@the-web-app/ui';
import ViewMessageEditsModal from '../modals/ViewMessageEditsModal';

export default function ChatWindow() {
	const { channel, server } = useClientState();
	const session = useSession();
	const user = session.data?.user;

	const [messages, setMessages] = useState<Message[]>([]);
	const { joinChannel, leaveChannel, sendMessage, getMessages, onMessage, offMessage } = useSocket(
		server ? `server-${server.id}` : 'none'
	);
	const channelId = channel?.id ?? '';
	const messageEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!channelId || !server) return;
		joinChannel(channelId);
		getMessages(channelId, (messages) => {
			console.log('Received messages from backend:', messages);
			setMessages(messages);
		});

		return () => {
			leaveChannel(channelId);
		};
	}, [channelId, server, joinChannel, leaveChannel, getMessages]);

	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messages]);

	useEffect(() => {
		if (!server) return;
		
		const handleMessage = (newMessage: Message) => {
			console.log('Received new message:', newMessage);
			setMessages(prev => [...prev, newMessage]);
		};

		onMessage(handleMessage);
		return () => {
			offMessage(handleMessage);
		};
	}, [server, onMessage, offMessage]);

	if (!user || !channel || !server) {
		return null;
	}

	const handleSendMessage = (messageContent: string) => {
		if (!messageContent.trim()) return;
		
		console.log('Sending message:', { authorId: user.id, channelId, content: messageContent });
		sendMessage({ authorId: user.id, channelId, content: messageContent });
	};

	return (
		<div className="flex flex-col h-full max-w-full">
			{/* Header */}
			<div className="border-b px-4 py-3 flex items-center justify-between bg-background z-10">
				<ChannelHeader channel={channel} />
			</div>

			{/* Scrollable messages */}
			<div className="flex-1 overflow-hidden">
				<MessageList 
					messages={messages} 
					messageEndRef={messageEndRef as React.RefObject<HTMLDivElement>} 
					getMessages={getMessages}
					setMessages={setMessages}
				/>
			</div>

			{/* Footer */}
			<div className="border-t bg-background pr-4 py-3 z-10">
				<ChatInput
					channel={channel}
					onSubmit={handleSendMessage}
				/>
			</div>
		</div>
	);
}

function MessageList({ 
	messages, 
	messageEndRef, 
	getMessages,
	setMessages 
}: { 
	messages: Message[], 
	messageEndRef: React.RefObject<HTMLDivElement>, 
	getMessages: (channelId: string, setMessages: (messages: Message[]) => void) => void,
	setMessages: (messages: Message[]) => void 
}) {
	const { channel } = useClientState();
	const [messageBeingEdited, setMessageBeingEdited] = useState<Message | null>(null);
	const [messageBeingViewed, setMessageBeingViewed] = useState<Message | null>(null);
	const [isOpen, { open, close }] = useDisclosure();
	const [isViewEditsOpen, { open: openViewEdits, close: closeViewEdits }] = useDisclosure();

	const handleMessageDelete = async (message: Message) => {
		if (!message?.id) {
			console.error('Cannot delete message: no message ID');
			sendNotification({
				type: NotificationType.Error,
				message: 'Cannot delete message: missing message ID',
			});
			return;
		}
		
		console.log('Deleting message with ID:', message.id);
		const messageDelete = await deleteMessage(message.id);
		if (messageDelete) {
			sendNotification({
				type: NotificationType.Success,
				message: 'Message deleted successfully!',
			});
			// Refetch messages after deletion
			getMessages(channel?.id ?? '', setMessages);
			setMessageBeingEdited(null); // clean up
		} else {
			sendNotification({
				type: NotificationType.Error,
				message: 'Failed to delete message',
			});
		}
	}

	const handleMessageEdit = async (content: string) => {
		if (!messageBeingEdited?.id) {
			console.error('Cannot edit message: no message ID');
			sendNotification({
				type: NotificationType.Error,
				message: 'Cannot edit message: missing message ID',
			});
			return;
		}
		
		if (!messageBeingEdited?.content) {
			console.error('Cannot edit message: no content');
			sendNotification({
				type: NotificationType.Error,
				message: 'Cannot edit message: missing content',
			});
			return;
		}
		
		console.log('Editing message with ID:', messageBeingEdited.id);
		const edit = await editMessage(messageBeingEdited.id, content);
		if(edit) {
			sendNotification({
				type: NotificationType.Success,
				message: 'Message edited successfully!',
			});
			// Refetch messages after edit
			getMessages(channel?.id ?? '', setMessages);
			setMessageBeingEdited(null); // clean up
		} else {
			sendNotification({
				type: NotificationType.Error,
				message: 'Failed to edit message',
			});
		}
	};

	const handleMessageCopy = (message: Message) => {
		navigator.clipboard.writeText(message.content);
		sendNotification({
			type: NotificationType.Success,
			message: 'Message copied to clipboard!',
		});
	};

	const handleMessageViewEdits = (message: Message) => {
		setMessageBeingViewed(message);
		openViewEdits();
	}

	return (
		<ScrollArea className="h-full" type="auto">
			<div className="p-4 flex flex-col space-y-6">
				{messageBeingEdited && (
					<EditMessageModal
						open={isOpen}
						onClose={() => {
							close();
							setMessageBeingEdited(null); // clean up
						}}
						message={messageBeingEdited}
						onEdit={handleMessageEdit}
					/>
				)}

				
				{messageBeingViewed && (
					<ViewMessageEditsModal
					open={isViewEditsOpen}
					onClose={() => {
						closeViewEdits();
						setMessageBeingViewed(null); // clean up
					}}
					message={messageBeingViewed}
				/>
				)}

				{messages.length > 0
					? (
							messages.map(message => (
								<ContextMenu>
									<ContextMenuTrigger key={message.id} className="w-full">
										<ChatMessage key={message.id} message={message} />
									</ContextMenuTrigger>
									<ContextMenuContent>
										<ContextMenuItem onClick={() => handleMessageCopy(message)}>
											<CopyIcon className="mr-2 h-4 w-4" />
											Copy
										</ContextMenuItem>
										<ContextMenuItem onClick={() => {
												setMessageBeingEdited(message);
												open()
											}}>
											<Pencil className="mr-2 h-4 w-4" />
											Edit
										</ContextMenuItem>
										<ContextMenuSeparator/>
										{message.edited ? (
											<ContextMenuItem onClick={() => handleMessageViewEdits(message)}>
												<Clock className="mr-2 h-4 w-4" />
												View Edits
											</ContextMenuItem>
										) : null}
										<ContextMenuSeparator />
										<ContextMenuItem onClick={() => handleMessageDelete(message)}>
											<Trash className="mr-2 h-4 w-4" />
											Delete
										</ContextMenuItem>
									</ContextMenuContent>
								</ContextMenu>
							))
						)
					: (
							<div>No messages yet. Be the first to send a message!</div>
						)}
				<div ref={messageEndRef} />
			</div>
		</ScrollArea>
	);
}

function ChannelHeader({ channel }: { channel: Channel }) {
	const [category, setCategory] = useState<string>('Loading...');

	// Fetch the category only once when the channel changes
	useEffect(() => {
		async function getCategoryName() {
			const categoryData = await getCategory(channel.category as unknown as string);
			if (categoryData) {
				setCategory(categoryData.name);
			} else {
				setCategory('Unknown Category');
			}
		}

		void getCategoryName();
	}, [channel]);

	return (
		<div className="flex items-center justify-between w-full">
			<div className="flex items-center space-x-2">
				<Hash className="h-5 w-5 text-gray-500" />
				<span className="font-medium">{category}</span>
				<span className="text-gray-500">/</span>
				<span className="font-medium">{channel.name}</span>
			</div>
			<div className="flex items-center space-x-2">
				<Button variant="ghost" size="icon" className="h-8 w-8 ml-1">
					<MoreHorizontal className="h-5 w-5" />
				</Button>
			</div>
		</div>
	);
}
