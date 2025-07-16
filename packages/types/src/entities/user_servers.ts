import { Server } from "./Server.js";
import { User } from "./User.js";

export interface user_servers {
  User_owner: User;
  Server_inverse: Server;
}
