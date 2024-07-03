/* alternate methods are by 
1.using libraries like react-hook-form
2.Debouncing Search Input ( to reduce the frequency of search queries being sent to the server, 
especially if the search operation involves making API requests.) */

import React, { useState, useEffect } from "react";
import { useChatContext } from "stream-chat-react";

import { SearchIcon } from "../assets/SearchIcon";
import { ResultsDropdown } from "./index";

const ChannelSearch = ({ setToggleContainer }) => {
  const { client, setActiveChannel } = useChatContext();

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);//loading process is not currently happening.so,false.
  const [teamChannels, setTeamChannels] = useState([]);
  const [directChannels, setDirectChannels] = useState([]);

  useEffect(() => { // to clear the channel lists and set loading to false when the query is empty.
    if (!query) {
        setTeamChannels([]);
        setDirectChannels([]);
        setLoading(false);
    }
}, [query]);

  //we have to wait for channels to be fetched...so, this is async function.
  const getChannels = async (text) => {
    try {
      let checkAtLeastOneLetter = /[a-zA-Z]/.test(text); //ensure there's at least one letter in the query string before making the API call.

      if (checkAtLeastOneLetter) {
        const channelsResponse = await client.queryChannels({
          type: "team",
          name: { $autocomplete: text },
          members: { $in: [client.userID] },
        });

        const usersResponse = await client.queryUsers({
          id: { $ne: client.userID },//it excludes our id.
          name: { $autocomplete: text },
        });

         //we want channels and users at same time while searching.so,using promise.all for faster fetching.
        const [channels, { users }] = await Promise.all([ channelsResponse ,usersResponse, ]);

        if (channels.length) setTeamChannels(channels);
        if (users.length) setDirectChannels(users);
      }
    } catch (error) {
      console.log(error);
      setQuery("");  //reset the query for search to original state.
      setLoading(false);
    }
  };

  const onSearch = (e) => {
    e.preventDefault(); //It prevents the browser from reloading the page or navigating away when the form is submitted.
    setQuery(e.target.value);
    setLoading(true);
    getChannels(e.target.value);
  };

  const setChannel = (channel) => {
    setQuery("");
    setActiveChannel(channel);
  };

  useEffect(() => {
    if (!query) {
      setTeamChannels([]);
      setDirectChannels([]);
      setLoading(false);
    }
  }, [query]);

  return (
    <div className="channel-search__container">
      <form className="channel-search__input__wrapper">
        <div className="channel-search__input__icon">
          <SearchIcon />
        </div>
        <input
          type="text"
          placeholder="Search"
          className="channel-search__input__text"
          value={query}
          onChange={onSearch}
        />
      </form>
      {query && (
        <ResultsDropdown
          teamChannels={teamChannels}
          directChannels={directChannels}
          loading={loading}
          setChannel={setChannel}
          setToggleContainer={setToggleContainer}
        />
      )}
    </div>
  );
};

export default ChannelSearch;