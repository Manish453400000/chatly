import axios from "axios";
import { LocalStorage } from "../utils";

import { AxiosResponse } from "axios";
import { ApiSuccessResponseInterface } from "../interface/api";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URI,
  withCredentials: true,
  timeout: 120000,
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

const editAvatar = async (data:any) => {
  return await apiClient.post('/user/edit/avatar', data)
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
  getAllFriends
}