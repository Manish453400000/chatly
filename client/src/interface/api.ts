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