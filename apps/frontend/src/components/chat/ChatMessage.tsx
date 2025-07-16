import type { Message } from '@the-web-app/types';
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@the-web-app/ui';
export type ChatMessageProps = {
	message: Message;
};


function ChatMessageComponent({ message }: ChatMessageProps) {
	return (
		<div className="flex space-x-3 hover:bg-muted/50 p-[4px] rounded-md transition-colors">
			<Avatar>
				<AvatarImage
					src=""
					alt={message.author.name}
					className="rounded-full"
				>
				</AvatarImage>
				<AvatarFallback>{message.author.name.charAt(0)}</AvatarFallback>
			</Avatar>
			<div className="flex-1">
				<div className="flex items-center space-x-2">
					<span className="font-medium">{message.author.name}</span>
					{ /* <span className="text-xs text-gray-500">{message.createdAt.toISOString()}</span> */ }
				</div>
				<div className="mt-1 text-sm">{message.content}</div>
			</div>
		</div>
	);
}

const ChatMessage = React.memo(ChatMessageComponent);

export default ChatMessage;
