import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider'
import { Box,Center,FormControl,IconButton,Input,Spinner,Text } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender,getSenderFull } from '../../config/ChatLogics';
import ProfileModal from './ProfileModal';
import UpdateGroupChatModal from './UpdateGroupChatModal';
import axios from 'axios';
import { useToast } from "@chakra-ui/react";
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import "../Styles/style.css";
import Lottie from "react-lottie";
import animationData from "../Styles/typing.json"
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({fetchAgain,setFetchAgain}) => {
  console.log(fetchAgain,"start")
    const {user,selectedChat,setSelectedChat,notification,setNotification} = ChatState();
    const [messages,setMessages] = useState([])
    const [loading, setLoading] = useState(false);
    const [newMessage, setnewMessage] = useState();
    const [socketConnected,setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const toast = useToast();
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    const sendMessage = async (event) => {
      if (event.key === "Enter" && newMessage) {
        socket.emit('stop typing', selectedChat._id)
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setnewMessage("");
          const { data } = await axios.post(
            "/api/message",
            {
              content: newMessage,
              chatId: selectedChat,
            },
            config
          );
          socket.emit("new message", data);
          setMessages([...messages, data]);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    };
    const fetchMessages = async () => {
      if (!selectedChat) return;
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        setLoading(true);
  
        const { data } = await axios.get(
          `/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
        setLoading(false);
        socket.emit("join chat", selectedChat._id);
  
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
    const typingHandler = (e) => {
      setnewMessage(e.target.value)
      if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
        
      }
    }, timerLength);
    }
    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup",user);
      socket.on('connected',()=> setSocketConnected(true))
      socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
    },[])
    useEffect(() => {
      fetchMessages();
  
      selectedChatCompare = selectedChat;  
    }, [selectedChat]);

    console.log("--",notification);
    useEffect(() => {
      socket.on("message recieved", (newMessageRecieved) => {
        if (
          !selectedChatCompare || 
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved, ...notification]);
            console.log(fetchAgain)
            setFetchAgain(!fetchAgain)
        }
      }
         else {
          setMessages([...messages, newMessageRecieved]);
        }
      });
    });
  return (
    
    <>
   
    {selectedChat ? (<>
    <Text fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center">
                <IconButton display={{ base: "flex", md: "none"}}
                icon={<ArrowBackIcon/>}
                onClick={() => setSelectedChat("")}
                />
                {!selectedChat.isGroupChat ? (
                    <>
                    {getSender(user, selectedChat.users)}
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}/>
                    </>
                ):(<>{selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} fetchMessages={fetchMessages}/>
                </>)}
            </Text>
            <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflow="hidden">
                {loading ? <Spinner size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"/>:(
                <div className='messages'  >
                  <ScrollableChat messages={messages}/>

                </div>
              )}
                <FormControl onKeyDown={sendMessage} isRequired marginTop={3}>
                  {isTyping ? <div><Lottie
                     options={defaultOptions}
                    // height={50}
                    width={70}
                    style={{ marginBottom: 15, marginLeft: 0 }}
                  /></div>: <div></div>}
                  <Input variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}/>
                  </FormControl>
            </Box>
    </>):(
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>
    )}
    </>
  )
}

export default SingleChat