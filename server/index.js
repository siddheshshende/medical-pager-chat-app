
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;
//we will be using many env. variables. So, mentioned below line.
require('dotenv').config(); // this is going to allow us to call environment variables right inside our node application.

// Import routes for signin and signup
const authRoutes = require('./routes/auth.js');


const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

// Middleware setup
app.use(cors());
app.use(express.json()); // Allows us to pass JSON data from frontend to backend
app.use(express.urlencoded({ extended: true })); // Allows us to pass URL-encoded data.This is a bult-in middleware function in express which is now depreciated. so added { extended: true }

// Testing and setting up route
app.get('/', (req, res) => {
    res.send("hello winner");
});

// setting up Route (webhook endpoint) for handling new messages
app.post('/', (req, res) => {
    const { user: sender, message, type, members } = req.body;

    if (type === 'message.new') { // We are tracking only new messages
        members
            .filter((member) => member.user_id != sender.id) // We don't want to send a message to ourselves
            .forEach(({ user }) => {
                if (!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid, //from parameter i.e twilio number.
                        to: user.phoneNumber
                    })
                    .then(() => console.log('Message sent!'))
                    .catch((err) => console.log(err));
                }
            });
        return res.status(200).send("Message sent successfully!");
    }
return res.status(200).send("Not a new message");//if error
});

app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
 