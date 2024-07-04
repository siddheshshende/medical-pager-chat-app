/*alternate method is by Using React Context or state management (like Redux) for centralized 
authentication state handling and conditional rendering in your application.*/

import React from 'react';
import { useState, useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { ChannelListContainer, ChannelContainer, Auth } from './components';
import './App.css';
import 'stream-chat-react/dist/css/index.css';//importing css from stream-chat-react for prebuilt component.
import ReactGA from 'react-ga4';


const cookies = new Cookies();
const apiKey = '3qm2waththmx';
const authToken = cookies.get('token');

const client = StreamChat.getInstance(apiKey);
//now we have to see that we have authToken or not. if we have authToken, then we will create user.
if (authToken) {
  client.connectUser({

    id: cookies.get('userId'),
    name: cookies.get('username'),
    fullName: cookies.get('fullName'),
    image: cookies.get('avatarURL'),
    hashedPassword: cookies.get('hashedPassword'),
    phoneNumber: cookies.get('phoneNumber'),
  }, authToken);
}
const App = () => {

//from channelcontainer, this variables are created 
const[createType, setCreateType]=useState('');
const[isCreating, setIsCreating]=useState(false);
const[ isEditing, setIsEditing]=useState(false);

//for GA
useEffect(() => {
  // Initialize Google Analytics
  ReactGA.initialize('G-DGYJ34MSNW');
  
  // Track page view
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });

  // Track session start
  ReactGA.event({
    category: 'Session',
    action: 'Start',
  });

  // Track session duration
  const startTime = Date.now();
  return () => {
    const endTime = Date.now();
    ReactGA.event({
      category: 'Session',
      action: 'Duration',
      value: Math.round((endTime - startTime) / 1000), // in seconds
    });
  };
}, []);
useEffect(() => {
  // Set up periodic ping to track active users
  const interval = setInterval(() => {
    ReactGA.event({
      category: 'User',
      action: 'Active',
    });
  }, 60000); // every minute

  return () => clearInterval(interval);
}, []);

  if (!authToken) return <Auth />
  return (

    <div className='app__wrapper'>
      <Chat client={client} theme='team light'>
        <ChannelListContainer 
        //passing the variables as a prop.
        isCreating={isCreating}
        setCreateType={setCreateType}
        setIsCreating={setIsCreating}
        setIsEditing={setIsEditing}
        />
        <ChannelContainer 
         //passing the variables as a prop.
           isCreating={isCreating}
           setIsCreating={setIsCreating}
           isEditing={isEditing}
           setIsEditing={setIsEditing}
           createType={createType}
        />
      </Chat>
    </div>
  );
};

export default App;
