import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";

const BASE_URL = import.meta.env.MODE === 'development' ? "http://localhost:5001" : "/"
export const useAuthStore = create((set,get)=>({
    authUser : null,

    isSigningUp : false,
    isLoggingIn : false,
    isUpdatingProfile : false,

    isCheckingAuth : true,
    onlineUsers : [],
    socket : null,

    checkAuth : async()=>{
        try {
            const res = await axiosInstance.get("/auth/check");
            set({authUser : res.data});
            get().connectSocket();
        } catch (error) {
            console.log("error in check Auth:",error);
            set({authUser : null});
        }finally{
            set({isCheckingAuth : false,});
        }
    },

    signUp : async(data)=>{
        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post("/auth/signup",data);
            toast.success("Account created successfully");
            set({authUser : res.data});
            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in signup Auth:",error);
            set({authUser : null});
        }finally{
            set({isSigningUp : false});
        }
    },

     
    login : async(data)=>{
        set({isLoggingIn : true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            toast.success("Logged in successfully");
            set({authUser : res.data});

            get().connectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in login Auth:",error);
            set({authUser : null});
        }finally{
            set({isLoggingIn : false});
        }
    },

    logOut : async()=>{
        set({isSigningUp : true});
        try {
            const res = await axiosInstance.post("/auth/logout");
            toast.success("Logged Out Successfully");
            set({authUser : null});
            get().disConnectSocket();
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in signup Auth:",error);
            set({authUser : null});
        }finally{
            set({isSigningUp : false});
        }
    },

    updateProfile : async(data)=>{
        set({isUpdatingProfile : true});
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser : res.data});
            toast.success("Profile pic updated");
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in isUpdatingProfile Auth:",error);
           
        }finally{
            set({isUpdatingProfile : false});
        }
    },

    connectSocket : ()=>{
        const {authUser} = get();
        if(!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
              userId: authUser._id,
            },
          });
        socket.connect();

        set({socket : socket});

        socket.on("getOnlineUsers",(userIds)=>{
            set({onlineUsers : userIds})
        })
    },

    disConnectSocket : ()=>{
        if(get().socket?.connected) get().socket.disconnect();
    }
}))