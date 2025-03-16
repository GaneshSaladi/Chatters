import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get)=>({
    messages : [],
    users : [],
    selectedUser : null,
    isUsersLoading : false,
    isMessagesLoading : false,

    getUsers : async ()=>{
        set({isUsersLoading  : true});
        try {
            const res = await axiosInstance.get("/messages/users");
            set({users : res.data});
          
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in getUsers Auth:",error);
            set({users : []});
        }finally{
            set({isUsersLoading : false,});
        }
    },

    getMessages : async (userId)=>{
        set({isMessagesLoading  : true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages : res.data});
          
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in getMessages Auth:",error);
            set({messages : []});
        }finally{
            set({isMessagesLoading : false,});
        }
    },

    sendMessage : async (messageData)=>{
        const {selectedUser , messages} = get();
        // set({isMessagesLoading  : true});
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`,messageData);
            set({messages : [...messages , res.data]});
          
        } catch (error) {
            toast.error(error.response.data.message)
            console.log("error in sendMessage Auth:",error);
           
        }finally{
            set({isMessagesLoading : false,});
        }
    },

    subscribeToMessages : ()=>{
        const {selectedUser} = get();
        if(!selectedUser) return;

        const socket = useAuthStore.getState().socket
// need to optimize later
        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if(!isMessageSentFromSelectedUser) return;


            set({
                messages : [...get().messages, newMessage]
            })
        })
    },

    unSubScribeToMessages : ()=>{
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage") 
    },

    setSelectedUser : (selectedUser) => set({ selectedUser }),

    
}))