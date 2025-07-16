import { Channel } from "./Channel.js";
import { Server } from "./Server.js";
import { User } from "./User.js";

export interface FavouritedChannel {
    id: string;
    channel: Channel;
    server: Server;
    user: User;
}