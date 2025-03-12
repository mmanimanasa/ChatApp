import { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import React from 'react';
const ChatContext = createContext();

const ChatProvider = ({children}) => {
    const [user, setuser] = useState();
    const [selectedChat, setSelectedChat]=useState();
    const [chats,setChats] = useState([]);
    const [notification, setNotification] = useState([]);
    const history = useHistory()
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setuser(userInfo)

        if(!userInfo){
            history.push("/")
        }
    },[history])
    return <ChatContext.Provider value={{user, setuser, selectedChat, setSelectedChat, chats,setChats, notification,setNotification}}>{children}</ChatContext.Provider>
}
export const ChatState = () => {
  return useContext(ChatContext);
}

export default ChatProvider