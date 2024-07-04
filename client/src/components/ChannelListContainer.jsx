//alternate method is Combining ChannelListContent and ChannelListContainer into a single component

import React, { useState , useEffect} from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';
import HospitalIcon from '../assets/hospital.png'
import LogoutIcon from '../assets/logout.png'
import ReactGA from 'react-ga4';

const cookies = new Cookies();

//retrieving logout as a prop 
const SideBar = ({ logout }) => (
    <div className='channel-list__sidebar'>
        <div className='channel-list__sidebar__icon1'>
            <div className="icon1__inner">
                <img src={HospitalIcon} alt="Hospital" width="30" />
            </div>
        </div>
        <div className='channel-list__sidebar__icon2'>
            <div className="icon1__inner" onClick={logout}>
                <img src={LogoutIcon} alt="Logout" width="30" />
            </div>
        </div>
    </div>
);

const CompanyHeader = () => {
    return (
        <div className='channel-list__header'>
            <p className='channel-list__header__text'>Medical Pager</p>
        </div>
    );
}
//we want to display names below search bar.
const customchannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
}
const customchannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging');
}


const ChannelListContent = ({ isCreating, setCreateType, setIsCreating, setIsEditing, setToggleContainer }) => {
    const { client } = useChatContext();

    //making button work
    const logout = () => {
        ReactGA.event({
            category: 'User',
            action: 'Logout'
        });

        cookies.remove('token')
        cookies.remove('userId');
        cookies.remove('username');
        cookies.remove('fullName');
        cookies.remove('avatarURL');
        cookies.remove('hashedPassword');
        cookies.remove('phoneNumber');

        window.location.reload();
    }

    const filters = { members: { $in: [client.userID] } };//we want all channels and messages where our client/user is included.
    return (
        <>
            <SideBar logout={logout} />  {/*passing logout as a prop */}
            <div className='channel-list__list__wrapper'>
                <CompanyHeader />
                <ChannelSearch setToggleContainer={setToggleContainer} />

                <ChannelList
                    filters={filters} // can add list items by filtering the messages or channels
                    channelRenderFilterFn={customchannelTeamFilter} //based on this we can also pass on additional filters 
                    List={(listProps) => (
                        <TeamChannelList  // custom component will get all props that ChannelList usually gets. 
                            {...listProps}
                            type='team'
                            isCreating={isCreating}
                            setCreateType={setCreateType}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview   // custom component will get all props that ChannelList usually gets.
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            type='team'
                        />
                    )}
                />
                <ChannelList
                    filters={filters}
                    channelRenderFilterFn={customchannelMessagingFilter}
                    List={(listProps) => (
                        <TeamChannelList
                            {...listProps}
                            type='messaging'
                            isCreating={isCreating}
                            setCreateType={setCreateType}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            type='messaging'
                        />
                    )}
                />

            </div>
        </>
    );
};

//it displays ChannelListContent in both way default and responsive view.
const ChannelListContainer = ({ setIsCreating, setIsEditing, setCreateType }) => {
    const [toggleContainer, setToggleContainer] = useState(false);

    useEffect(() => {
        ReactGA.event({ // to track when the container is viewed (desktop or mobile).
            category: 'ChannelListContainer',
            action: 'View',
            label: toggleContainer ? 'Mobile' : 'Desktop'
        });
    }, [toggleContainer]);

    return (
        <>
            <div className='channel-list__container'>
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                    setCreateType={setCreateType}

                />
            </div>
            {/*visible only on mobile devices.*/}
            <div className='channel-list__container-responsive' style={{ left: toggleContainer ? '0%' : '-89%', backgroundColor: '#005fff' }}>
                <div className='channel-list__container-toggle' onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
                </div>
                <ChannelListContent
                    setIsCreating={setIsCreating}
                    setIsEditing={setIsEditing}
                    setCreateType={setCreateType}
                    setToggleContainer={setToggleContainer}
                />
            </div>
        </>
    )
}

export default ChannelListContainer;


