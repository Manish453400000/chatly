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

export interface GroupChats {
  _id: string;
  name: string;
  GroupAvatar: {
    localPath: string;
    url: string,
    _id: string,
  },
  isGroupChat: boolean;
  Participants: [string],
  admin: string;
  createdAt: Date;
  participantDetails: [
    {
      _id: string,
      avatar: {
        localPath: string;
        url: string,
        _id: string,
      }, 
      username: string,
      about: string,
      isOnline: boolean
    }
  ]
}