import { Channel } from "./Channel.js";
import { Server } from "./Server.js";
export interface Category {
    id: string;
    name: string;
    description: string;
    server: Server;
    channels?: Channel[];
}
//# sourceMappingURL=Category.d.ts.map