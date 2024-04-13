import axios from "axios";
import { LocalStorage } from "../utils";

const token = LocalStorage.get("token");

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
  headers: {
    // 'Content-Type': 'application/json',  // this thing will prevent sending files;
    'Authorization': `Bearer ${token}`
  }
})

apiClient.interceptors.request.use(
  function(config) {
    const token = LocalStorage.get("token");
    // set authorization with bearer token
    config.headers.Authorization = `Bearer ${token}`
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
)

const registerUser = (data: {
  username: string,
  email: string,
  password: string,
}) => {
  return apiClient.post('/user/register', data)
}

const loginUser = (data: { username: string; password: string}) => {
  return apiClient.post('/user/login', data);
}

const getUser = async () => {
  return await apiClient.post('/user/get-user')
}

const logoutUser = () => {
  return apiClient.post('/user/logout');
}

const editAvatar = (data:any) => {
  return apiClient.post('/user/edit/avatar', data)
}

const searchUsers = (query:string) => {
  return apiClient.get(`friend/search?searchQuery=${query}`);
}

const sentRequest = (data: any) => {
  return apiClient.post('friend/request/sent', data);
}

const acceptRequest = async (requestId: string) => {
  return await apiClient.get(`friend/request/accept?requestId=${requestId}`)
}
const rejectRequest = async (requestId: string) => {
  return await apiClient.get(`friend/request/reject?requestId=${requestId}`)
}
const getAllFriends = async () => {
  return await apiClient.get(`friend/get-friends`)
}

const getAllNotifications = () => {
  return apiClient.get('friend/request/get-requests');
}

const getAllMessages = (chatId:string) => {
  return apiClient.get(`messages/get?chatId=${chatId}`);
}

const sentMessages = (content:string , chatId:string | undefined) => {
  const data = {
    content: content,
  }
  return apiClient.post(`messages/send?chatId=${chatId}`, data);
}

const getAllGroupChats = () => {
  return apiClient.get('chats/group/get-all')
}

const createGroupChat = (data:{name:string, groupIds: string[]}) => {
  return apiClient.post('chats/group/create', data)
}

const editGroupAvatar = (data:any, query:string) => {
  return apiClient.post(`chats/group/edit/avatar?groupId=${query}`, data)
}

export {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  searchUsers,
  editAvatar,
  sentRequest,
  getAllNotifications,
  acceptRequest,
  rejectRequest,
  getAllFriends,
  getAllMessages,
  sentMessages,
  getAllGroupChats,
  createGroupChat,
  editGroupAvatar
}