import { Channel } from "./Channel.js";
import { User } from "./User.js";


export interface Message {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  editedAt: Date;
  channel: Channel;
  edited: boolean;
  editedMetadata: EditedMetadata[];
}


export interface EditedMetadata {
  version: number;
	editedBy: User;
	editedAt: Date;
	editedContent: string;
}