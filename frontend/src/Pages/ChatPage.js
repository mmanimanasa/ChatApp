import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Box } from '@chakra-ui/react'
import MyCharts from "../components/ChatComponents/MyCharts"
import ChatBox from '../components/ChatComponents/ChatBox' 
import UserSerach from '../components/ChatComponents/UserSerach'
const ChatPage = () => {
  const {user} = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{width:'100%'}}>
      {user && <UserSerach/>}
      <Box display="flex"
      justifyContent="space-between" w="100%" h="91.5vh" p="10px">
      {user && (< MyCharts fetchAgain={fetchAgain} />) }
      {user && (<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>) }
      </Box>
    </div>
  )
}

export default ChatPage