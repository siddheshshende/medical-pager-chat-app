/*alternate methods are by 
1.using libraries like react-query or redux
2.useEffect and useState:Usage with Data Fetching := using hooks to manage state and effect and 
conditional rendering for loading and error states. */
import React from 'react'
import { AddChannel } from '../assets';

//here, setToggleContainer is passed from ChannelListContainer.jsx
const TeamChannelList = ({ children, type, loading, error = false, isCreating, setCreateType, setIsCreating, setIsEditing, setToggleContainer }) => {
  if (error) {
    return type === 'team' ? (
      <div className='team-channel-list'>
        <p className='team-channel-list__message'>
          connection error,please wait a moment and try again...
        </p>
      </div>
    ) : null
  }
  if (loading) {
    return (
      <div className='team-channel-list'>
        <p className='team-channel-list__message loading'>
          {type === 'team' ? 'channel' : 'message'} loading...
        </p>
      </div>
    )
  }


  return (
    <div className='team-channel-list'>
      <div className='team-channel-list__header'>
        <p className='team-channel-list__header__title'>
          {type === 'team' ? 'Channel' : 'Direct Messages'}

        </p>
        <AddChannel
          isCreating={isCreating}
          setCreateType={setCreateType}
          setIsCreating={setIsCreating}
          setIsEditing={setIsEditing}
          type= { type=== 'team' ?  'team' : 'messaging'}
          setToggleContainer={setToggleContainer}
        />
      </div>
      {children   /*everything that is pass to teamchannellist, we want to render it here. */}
    </div>
  )
}

export default TeamChannelList;