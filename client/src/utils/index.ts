import { AxiosResponse } from "axios";
import { ApiSuccessResponseInterface } from "../interface/api";

export const isBrowser = typeof window !== "undefined";

export const requestHandler = async (
  api: () => Promise<AxiosResponse<ApiSuccessResponseInterface, any>>,
  setLoading: ((loading: boolean) => void) | null,
  onSuccess: (data: ApiSuccessResponseInterface) => void,
  _onError: (error: String) => void,
) => {
  setLoading && setLoading(true);
  try {
    const response = await api();
    const { data } = response;
    if(data?.success) {
      onSuccess(data);
    }
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
  static clear(_key: string) {
    if(!isBrowser) return;
    localStorage.clear();
  }
}

export const debouncer: (
  callback: (...args: any[]) => void,
  delay: number
) => (...args: any[]) => void = (callback, delay = 500) => {
  let timeOut: any;
  return async (...args: any[]) => {
    clearTimeout(timeOut);
    timeOut = setTimeout(() => {
      callback(...args);
    }, delay);
  };
};



export const mongoLocalTimeConverter = (timeString: string) => {
  var utcDate = new Date(timeString);

  // Get hours and minutes in UTC
  var hours = utcDate.getUTCHours();
  var minutes = utcDate.getUTCMinutes();

  // Format the time
  var formattedTime = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');

  return formattedTime;
};