'use client'

import { useState } from 'react';
import { Textarea } from "@the-web-app/ui";
import { Channel } from '@the-web-app/types';

export type ChatInputProps = {
	channel: Channel
	onSubmit: (message: string) => void;
}

export function ChatInput(props: ChatInputProps) {
	const [value, setValue] = useState('');

	return (
		<div className=" p-3">
			<div className="flex items-center space-x-2 pb-3">
				<Textarea
					className="w-full rounded-md py-2 h-12 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
					placeholder={`Message ${props.channel.name}`}
					value={value}
					onChange={e => setValue(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Enter' && !e.shiftKey) {
							e.preventDefault();
							props.onSubmit(value);
							setValue('');
						}
					}}
				/>

			</div>
		</div>
	);
}
