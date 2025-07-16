import { Category } from "./Category.js";
import { Message } from "./Message.js";
import { Server } from "./Server.js";
export interface Channel {
    id: string;
    name: string;
    description: string;
    category: Category;
    server: Server;
    messages?: Message[];
}
//# sourceMappingURL=Channel.d.ts.map