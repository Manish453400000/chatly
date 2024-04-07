export interface User {
  avatar: {
    localPath: string;
    url: string,
    _id: string,
  },
  createdAt: string,
  email: string,
  about: string,
  requests: [],
  friends: [],
  isEmailVerified: boolean,
  role: string,
  updatedAt: string,
  username: string,
  __v: number,
  __id: string,
}