import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';
import { InviteIcon } from '../assets';

//whatever you are going to render in listcontainer will be populated in children prop...
const ListContainer = ({ children }) => {
    return (
        <div className='user-list__container'>
            <div className='user-list__header'>
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
};

const UserItem = ({ user, setSelectedUsers }) => {
    //to toggle between invite icon
    const [selected, setSelected] = useState(false);

    const handleselected = () => {

        if (selected) {
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))//basically, we are keepig all selected Users and only removing the selected(clicked) ones. 
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }
        setSelected((prevSelected) => !prevSelected);

    };

    return (
        <div className='user-item__wrapper' onClick={handleselected}>
            <div className='user-item__name-wrapper' >
                <Avatar image={user.image} name={user?.fullName || user?.name || user?.id} size={32} />
                <p className='user-list__name'>{user?.fullName || user?.name || user?.id}</p>
            </div>
            {selected ? <InviteIcon /> : <div className='user-item__invite-empty' />}
        </div>
    )
}
const UserList = ({ setSelectedUsers }) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const { client } = useChatContext();
    const [listEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);

    //when something changes useEffect will be called. it is used to fetch Users from the useChatContext and update the state accordingly.
    useEffect(() => {
        const getUsers = async () => {
            if (loading) return; //we dont want Users if we are loading .So, come out of function.

            setLoading(true);//it is called before fetching Users to indicate that the data(Users) is being loaded.


            /*//we will query the Users from useChatContext.*/
            try {
                /*this is going to allow us to query Users based on specific parameters.*/
                const response = await client.queryUsers(
                    { id: { $ne: client.userID } }, //it excludes current user as we don't want to find ourselves there hahaha because we are the people adding different channels... 
                    { id: 1 },
                    { limit: 8 }
                )
                console.log(response);


                if (response.users.length) {
                    setUsers(response.users)
                } else {
                    setListEmpty(true); //if we don't have Users.
                }

            } catch (err) {

                setError(true);
            }
            setLoading(false);
        };
        if (client) getUsers(); // if we are connected (when the client is available)only then, we will call getUsers function.
    }, [])

    if (error) {
        return (
            < ListContainer>
                <div className='user-list__message'>
                    Error Loading... Please refresh and try again.
                </div>
            </ListContainer>
        )
    }

    if (listEmpty) {
        return (
            < ListContainer>
                <div className='user-list__message'>
                    No Users found.
                </div>
            </ListContainer>
        )
    }
    return (
        < ListContainer>
            {loading ? <div className='user-list__message'>Loading Users..</div> : (
                users?.map((user, i) => (
                    <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />
                ))
            )};

        </ListContainer>
    )
}
export default UserList;