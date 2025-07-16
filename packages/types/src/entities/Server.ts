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
  users?: CollectionOrArray<User>; // Made optional and flexible
  createdAt: Date;
  updatedAt: Date;
  owner?: User; // Made optional to handle nullable relationships
}
