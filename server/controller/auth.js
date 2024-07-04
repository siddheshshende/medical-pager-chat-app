//Contains the logic for handling signup and login requests.

const crypto = require('crypto');
const bcrypt= require('bcrypt');
const {connect}= require('getstream');
const { StreamChat } = require('stream-chat');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;  

const signup = async (req, res)=> {
    try {
        const { fullName, username, phoneNumber, password}= req.body;

//now creating a random userid for user name.
const userId = crypto.randomBytes(16).toString('hex');

//now making connection to stream to connect to server,so passing api_key, api_secret , app_id. which should be kept secret so using now env. variables.
const serverClient= connect(api_key, api_secret , app_id);

const hashedPassword= await bcrypt.hash(password, 10 );

const token = serverClient.createUserToken(userId);

res.status(200).json({token, fullName, username, userId , hashedPassword, phoneNumber});
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error during signup' });
    }
};

const login = async (req, res)=> {
    try {
        
        const {  username, password}= req.body;

        //serverClient: Connect to the Stream server and to create user tokens and 'client' is used to query users from db and manage chat functionalities
        const serverClient= connect(api_key, api_secret , app_id);
        const client = StreamChat.getInstance(api_key, api_secret );

        const { users }= await client.queryUsers({ name: username });

        if (!users.length ) return res.status(400).json({message: 'user not found '});

        const success = await bcrypt.compare(password, users[0].hashedPassword);
        //creating token using same existing id this time 
        const token = serverClient.createUserToken(users[0].id);
           //! if every action is successfully then send back all data 
        if (success) {
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id });
        } else {
            res.status(400).json({ message: 'Incorrect password or username' });
        }

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error during login' });
    }
};
 
module.exports= {login, signup};


