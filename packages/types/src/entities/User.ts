import { CollectionOrArray } from "../util/index.js";
import { FavouritedChannel } from "./FavouritedChannel.js";
import { Message } from "./Message.js";
import { Server } from "./Server.js";

export interface User {
  id: string;
  name: string;
  email: string | null;
  emailVerified?: boolean | null;
  image?: string | null;
  favouritedChannels?: CollectionOrArray<FavouritedChannel>;
  password?: string | null; // Made optional to avoid backend conflicts
  createdAt: Date;
  updatedAt: Date;
  servers?: CollectionOrArray<Server>;
  ownedServer?: Server;
  messages?: CollectionOrArray<Message>;
}
