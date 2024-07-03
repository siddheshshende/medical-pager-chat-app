//alternative approach is without using custom hooks. 

import React, { useState } from 'react'
import { useChatContext } from 'stream-chat-react';
import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ ChannelName = '', setChannelName }) => {
  const handleChange = (event) => {
    event.preventDefault();
    setChannelName(event.target.value);
  }

  return (
    <div className='channel-name-input__wrapper'>
      <p>Name</p>
      <input type='text' value={ChannelName} onChange={handleChange} placeholder='channel name' />
      <p>Add members</p>
    </div>
  )
}

const CreateChannel = ({ createType, setIsCreating }) => {       //used props from ChannelContainer component. 

  // we have to keep record of which one is toggle on and off(inviteicon selected from UserList component),when there are multiple users.
  const { client, setActiveChannel } = useChatContext();
  const [SelectedUsers, setSelectedUsers] = useState([client.userID || '']); //at the start we always want to be in chat.So, we want to input our own id immediately.
  const [ChannelName, setChannelName] = useState('');

  //creating button
  const handleCreateChannel = async (e) => {
    e.preventDefault();
    try {
      const newChannel = await client.channel(createType, ChannelName, {
        name: ChannelName,
 members: SelectedUsers
      });

      await newChannel.watch();// we want to see(keep watching) whenever there is new message in the channel.
      //input field operations
      setChannelName("")
      setIsCreating(false)
      setSelectedUsers([client.userID])//to reset 
      setActiveChannel(newChannel)//to switch channel

    } catch (error) {
      console.log(error);
    }

  }
  return (
    <div className='create-channel__container'>
      <div className='create-channel__header'>
        <p> {createType === 'team' ? 'create a new channel' : 'send a direct message'}</p>
        <CloseCreateChannel setIsCreating={setIsCreating} />  {/*used prop here just to reset it to not creating afterwards(exit creation mode).*/}

      </div>
      {createType === 'team' && ( <ChannelNameInput ChannelName={ChannelName} setChannelName={setChannelName} />)}
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className='create-channel__button-wrapper' onClick={handleCreateChannel}>
        <p>{createType === 'team' ? 'create channel' : 'create message group'}</p>

      </div>
    </div>
  )
};

export default CreateChannel;



