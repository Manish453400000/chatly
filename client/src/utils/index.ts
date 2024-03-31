import { AxiosResponse } from "axios";
import { ApiSuccessResponseInterface } from "../interface/api";

export const isBrowser = typeof window !== "undefined";

export const requestHandler = async (
  api: () => Promise<AxiosResponse<ApiSuccessResponseInterface, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: ApiSuccessResponseInterface) => void,
  onError: (error: String) => void,
) => {
  setLoading && setLoading(true);
  try {
    console.log('1');
    const response = await api();
    console.log('2');
    const { data } = response;
    console.log('3');
    if(data?.success) {
      onSuccess(data);
    }
    console.log('4');
  }catch(error: any) {
    localStorage.clear();
    console.log(error);
    // if(isBrowser) window.location.href = "/app/auth/sign-in";
    // onError(error?.response?.data?.message || "Somthing went wrong while handling request");
  }finally {
    setLoading && setLoading(false);
  }
}


export class LocalStorage {
  static get(key: string) {
    if(!isBrowser) return;
    const value = localStorage.getItem(key);
    if(value) {
      try {
       return JSON.parse(value); 
      }catch(error) {
        return null;
      }
    }
    return null;
  }
  static set(key: string, value: any) {
    if(!isBrowser) return;
    localStorage.setItem(key, JSON.stringify(value));
  }
  static remove(key: string) {
    if(!isBrowser) return;
    localStorage.removeItem(key);
  }
  static clear(key: string) {
    if(!isBrowser) return;
    localStorage.clear();
  }
}