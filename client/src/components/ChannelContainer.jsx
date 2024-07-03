import React from 'react';
import { Channel, useChatContext , MessageSimple } from 'stream-chat-react';
import { ChannelInner, EditChannel, CreateChannel, TeamChannelPreview } from './';
// MessageSimple is used to display messages that users are going to send  
const ChannelContainer = ({ isCreating, setIsCreating, isEditing, setIsEditing, createType }) => {
  const { channel } = useChatContext();

  if (isCreating) {
    return (
      <div className='channel__container'>
        <CreateChannel createType={createType} setIsCreating={setIsCreating} /> {/*rendering*/}
      </div>
    )
  }
  if (isEditing) {
    return (
      <div className='channel__container'>
        <EditChannel setIsEditing={setIsEditing} />
      </div>
    )
  }


  //when we create channel,but it is empty. so, we created another state I.E NOTHING TO DISPLAY   
  const EmptyState = () => {
    return(
    <div className='channel-empty__container'>
      <p className='channel-empty__first'>This is the beginning of your chat history.</p>
      <p className='channel-empty__second'>Send attachments,messages,links,emoji's and more!!</p>

    </div>
    );
  };
  return (
    <div className='channel__container'>
      {/*passing the props and message is defined which is to be displayed  which it is empty*/}
   <Channel
  EmptyStateIndicator={EmptyState}
  Message={(messageProps, i) => <MessageSimple  key={i} {...messageProps} />}
>

        <ChannelInner setIsEditing={setIsEditing} />
      </Channel>
    </div>
  );
};

export default ChannelContainer;
