export interface ApiSuccessResponseInterface {
  data: any;
  message: string;
  statusCode: number;
  success: boolean;
}

import { User } from "./user";
export interface Message {
  _id: string;
  attachments: [];
  chat: string;
  content: string;
  sender: User;
}

export interface Chats {
  _id: string,
  name: string,
  isGroupChat: boolean,
  groupAvatar: {
    localPath: string;
    url: string,
    _id: string,
  },
  newMessageCount?: number,
  participants: [string],
  admin: string,
  messages: Message[],
  participantDetails: [
    {
      avatar: {
        localPath: string;
        url: string,
        _id: string,
      };
      isOnline: boolean;
      username: string;
      about: string;
      _id: string;
    }
  ],
}