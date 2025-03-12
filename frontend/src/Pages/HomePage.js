import React from 'react'
import {Container, Box, Text,Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs} from "@chakra-ui/react"
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useHistory } from 'react-router-dom';
import { useEffect } from 'react';
const HomePage = () => {
   const history = useHistory()
      useEffect(() => {
          const user = JSON.parse(localStorage.getItem("userInfo"));
          
  
          if(!user){
              history.push("/")
          }
      },[history])
  return (
     <Container maxW="xl" centerContent>
        <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
        >
            <Text fontSize='4xl' m="0 150px" fontFamily="Work sans" color="black">Chit-Chat</Text>
        </Box>
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
            <Login/>
            </TabPanel>
            <TabPanel>
              <Signup/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
     </Container>
  )
}

export default HomePage