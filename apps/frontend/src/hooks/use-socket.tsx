"use client";

import { useCallback, useEffect, useRef } from 'react';
import type { Socket } from 'socket.io-client';

import { connectSocket } from '@/socket';
import { ChatEvents, Message } from '@the-web-app/types';

export function useSocket(serverId: string) {
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		if (serverId === 'none') {
			console.log('No server selected, skipping socket connection');
			return;
		}

		const socket = connectSocket(serverId);
		socketRef.current = socket;

		console.log('Connecting to socket:', serverId);

		return () => {
			console.log('Disconnecting socket:', serverId);
			socket.disconnect();
			socketRef.current = null;
		};
	}, [serverId]);

	const joinChannel = useCallback((channelId: string) => {
		if (!socketRef.current) {
			console.log('Socket not connected, skipping join channel');
			return;
		}
		socketRef.current.emit(ChatEvents.JOIN_CHANNEL, channelId);
	}, []);

	const leaveChannel = useCallback((channelId: string) => {
		if (!socketRef.current) {
			console.log('Socket not connected, skipping leave channel');
			return;
		}
		socketRef.current.emit(ChatEvents.LEAVE_CHANNEL, channelId);
	}, []);

	const sendMessage = useCallback((message: any) => {
		console.log('Socket sendMessage called with:', message);
		if (!socketRef.current) {
			console.error('Socket not connected');
			return;
		}
		socketRef.current.emit(ChatEvents.SEND_MESSAGE, message);
	}, []);

	const getMessages = useCallback((channelId: string, callback: (messages: Message[]) => void) => {
		if (!socketRef.current) {
			console.log('Socket not connected, skipping get messages');
			return;
		}
		
		const handleMessageHistory = (messages: Message[]) => {
			callback(messages);
		};
		
		socketRef.current.once(ChatEvents.MESSAGE_HISTORY, handleMessageHistory);
		socketRef.current.emit(ChatEvents.GET_MESSAGES, channelId);
	}, []);

	const onMessage = useCallback((callback: (msg: Message) => void) => {
		if (!socketRef.current) {
			console.error('Socket not connected for onMessage');
			return;
		}
		console.log('Setting up message listener for event:', ChatEvents.MESSAGE);
		socketRef.current.on(ChatEvents.MESSAGE, callback);
	}, []);

	const offMessage = useCallback((callback: (msg: Message) => void) => {
		if (!socketRef.current) return;
		socketRef.current.off(ChatEvents.MESSAGE, callback);
	}, []);

	return { joinChannel, leaveChannel, sendMessage, getMessages, onMessage, offMessage };
}
