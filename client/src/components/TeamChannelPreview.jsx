/*alternate method is by using switch statement to handle different types of channels,team(channel) and direct*/

import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';


//here, setToggleContainer is passed from ChannelListContainer.jsx AND setIsCreating,setIsEditing are passed to preview a channel.
const TeamChannelPreview = ({ setActiveChannel, setIsCreating, setIsEditing, setToggleContainer, channel, type }) => { //channel is A specific channel being rendered by the TeamChannelPreview component, provided as a prop.
    const { channel: activeChannel, client } = useChatContext();// activeChannel is The currently selected channel by user, managed by the chat context hook.

    // Preview for channels with multiple users
    const ChannelPreview = () => (
        <p className='channel-preview__item'>
            # {channel?.data?.name || channel?.data?.id} {/* Ensure we have channel before accessing data */}
        </p>
    );

    // Preview for direct messages
    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
        console.log(members[0]);
        return (
            <div className='channel-preview__item single'>
                <Avatar
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName || members[0]?.user?.name || members[0]?.user?.id}
                    size={24}
                />
                <p>{members[0]?.user?.fullName || members[0]?.user?.name || members[0]?.user?.id}</p>
            </div>
        );
    };

    return (
        <div
            className={
                channel?.id === activeChannel?.id
                    ? 'channel-preview__wrapper__selected'
                    : 'channel-preview__wrapper'
            }

            //clicking on specific channel to open the messages for that channel.
            //setIsCreating,setIsEditing are used here to preview a channel and not for actual editing or creating.
            onClick={() => {
                setIsCreating(false)
                setIsEditing(false)
                setActiveChannel(channel);
                //for mobile devices this if statement is added.
                if (setToggleContainer) {
                    setToggleContainer((prevState) => !prevState)
                }
            }}
        >
            {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
        </div>
    );
};

export default TeamChannelPreview;
