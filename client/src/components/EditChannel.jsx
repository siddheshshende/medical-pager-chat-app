import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import { UserList } from './';
import { CloseCreateChannel } from '../assets';

//from CreateChannel component.
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
const EditChannel = ({ setIsEditing }) => {
  const { channel } = useChatContext();
  const [ChannelName, setChannelName] = useState(channel?.data?.name)//if there is already a channelname,we will try to get from channel.
  const [SelectedUsers, setSelectedUsers] = useState([]);


  const updateChannel = async (event) => {
    event.preventDefault();

    const nameChanged = ChannelName !== (channel.data.name || channel.data.id); // this means that channel name has been changed as it is not matching.so then 
    if(nameChanged){
      await channel.update({name: ChannelName}, {text:`channel name changed to ${ChannelName}`});
    }
  //if name is not changed.But, no. of users has been changed then
  if(SelectedUsers.length){
await channel.addMembers(SelectedUsers);
  }
  setChannelName(null);
  setIsEditing(false);
  setSelectedUsers([]);
  }
  
  return (
    <div className='edit-channel__container'>
      <div className='edit-channel__header'>
        <p> Edit Channel</p>
        <CloseCreateChannel setIsEditing={setIsEditing} />
      </div>
      <ChannelNameInput ChannelName={ChannelName} setChannelName={setChannelName} />
      <UserList setSelectedUsers={setSelectedUsers} />
      <div className='edit-channel__button-wrapper' onClick={updateChannel}>
        <p>Save Changes</p>

      </div>
    </div>
  )
}

export default EditChannel;