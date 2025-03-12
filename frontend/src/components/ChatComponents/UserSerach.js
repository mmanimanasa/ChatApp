import React, { useState } from 'react'
import { Spinner,Input,Box, Tooltip, Button,Text,Menu,MenuList, MenuButton, Avatar, MenuItem, Drawer,DrawerBody,DrawerContent,DrawerHeader,DrawerOverlay, Flex } from '@chakra-ui/react'
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import { useDisclosure } from "@chakra-ui/hooks";
import { useToast } from '@chakra-ui/react';
import ChatLoading from './ChatLoading';
import UserListItem from './UserListItem';
import axios from "axios"
import { getSender } from '../../config/ChatLogics';
const UserSerach = () => {
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading,setLoading] = useState(false)
    const [loadingChat,setLoadingChat] = useState()
    const history = useHistory();
    const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };
  const toast = useToast();
    const {user,selectedChat, setSelectedChat,chats,setChats, notification,setNotification} = ChatState();
    const hadleSearch = async() => {
        if (!search) {
            toast({
              title: "Please Enter something in search",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "top-left",
            });
            return;
          }
      
          try {
            setLoading(true);
      
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            };
      
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            
            setLoading(false);
            setSearchResult(data);
          } catch (error) {
            toast({
              title: "Error Occured!",
              description: "Failed to Load the Search Results",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
          }
    }
    const accessChat = async(userId) => {
        try {
            setLoadingChat(true);
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);
      
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            
            setLoadingChat(false);
            onClose();
          } catch (error) {
            toast({
              title: "Error fetching the chat",
              description: error.message,
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
          }
    }
  return (
    <>
    <Box display="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px">
        <Tooltip label="Search User">
        <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
          </Tooltip>
          <Text fontSize="2xl" fontWeight="bold" fontStyle="italic" fontFamily="Work sans">
          Chit-Chat
        </Text>
        <div>
            <Menu>
                <MenuButton p={1}>
                    <BellIcon fontSize="2xl" m={1} color={!notification.length ? "blue.400" : "red.400"} />
                </MenuButton>
                <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
            </Menu>
            <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
                <Avatar size={"sm"} cursor={"pointer"} name={user.name}></Avatar>
                </MenuButton>
                <MenuList>
                    <ProfileModal user={user}> 
                        <MenuItem>Profile</MenuItem>
                    </ProfileModal>
                    <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                </MenuList>
            </Menu>
        </div>
    </Box>
    <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
            <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
            <DrawerBody>
                <Box display="flex" paddingBottom={2}>
                <Input
                placeholder="Search by name or email"
                margin={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={hadleSearch}>Go</Button>
                </Box>
                {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
            </DrawerBody>
        </DrawerContent>

    </Drawer>
    </>
  )
}

export default UserSerach