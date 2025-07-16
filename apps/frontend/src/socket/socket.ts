import { io, type Socket } from 'socket.io-client';


export function connectSocket(namespace: string): Socket {
	const url = 'http://localhost:3001'; // base URL only
	console.log('Connecting to namespace:', namespace);
	return io(url + '/' + namespace, {
		transports: ['websocket'],
		withCredentials: true,
	});
}