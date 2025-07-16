import { CollectionOrArray } from "../util/index.js";
import { Category } from "./Category.js";
import { Channel } from "./Channel.js";
import { User } from "./User.js";
export interface Server {
    id: string;
    name: string;
    description: string;
    categories?: CollectionOrArray<Category>;
    channels?: CollectionOrArray<Channel>;
    users?: CollectionOrArray<User>;
    createdAt: Date;
    updatedAt: Date;
    owner?: User;
}
//# sourceMappingURL=Server.d.ts.map