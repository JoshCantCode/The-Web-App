import { Server } from "@the-web-app/types";
import { Avatar, AvatarFallback, AvatarImage } from "@the-web-app/ui";

type ServerNavbarIconProps = {
	server: Server
	onClick: (server: Server) => void
};

export default function ServerNavbarIcon({ server, onClick }: ServerNavbarIconProps) {
	return (
		<Avatar onClick={() => onClick(server)} key={server.id} className="hover:cursor-default hover:border-2">
			<AvatarImage src="" alt={server.name} />
			<AvatarFallback>{server.name.charAt(0)}</AvatarFallback>
		</Avatar>
	);
}