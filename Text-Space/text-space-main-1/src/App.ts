import  express from 'express';
import * as bodyParser from 'body-parser';
import * as crypto from 'crypto';
import  cors from 'cors';
import connectDB from './dbConnect';
import Message, { IMessage } from './models/Message';

// Creates and configures an ExpressJS web server.
class App {

  // ref to Express instance
  public expressApp: express.Application;

  // Run configuration methods on the Express instance.
  constructor() {
    this.expressApp = express();
    this.connectToDatabase();
    this.configureMiddleware();
    this.configureRoutes();
  }

  public connectToDatabase(): void {
    connectDB();
  }
  // Configure Express middleware.
  private configureMiddleware(): void {
    this.expressApp.use(bodyParser.json());
    this.expressApp.use(bodyParser.urlencoded({ extended: false }));
    this.expressApp.use(cors()); // Enable CORS for Postman testing
    this.expressApp.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });
  }

  // Configure API endpoints.
  private configureRoutes(): void {
    const router = express.Router();

    // Simple test route
    router.get('/', async (req, res) => {
      try {
        res.status(200).send('Hello World');
      } catch (error) {
        res.status(500).send('Server Error');
      }
    });

    // Create a new message route
    router.post('/api/messages', async (req, res) => {
      const { senderID, receiverID, content } = req.body;

      if (!senderID || !receiverID || !content) {
        res.status(400).json({ error: "All fields are required: senderID, receiverID, content." });
        return;
      }

      try {
        const newMessage: IMessage = new Message({ senderID, receiverID, content });
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
      } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ error: 'Failed to create message.' });
      }
    });

    // Get all messages with optional senderID and receiverID as query parameters
    router.get('/api/messages', async (req, res) => {
      const { senderID, receiverID } = req.query;

      try {
        const filter: { senderID?: string; receiverID?: string } = {};
        if (senderID) filter.senderID = senderID as string;
        if (receiverID) filter.receiverID = receiverID as string;

        const messages = await Message.find(filter);
        res.status(200).json(messages);
      } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages.' });
      }
    });

    // Other routes for messages
    router.get('/api/messages/sender/:senderID/message/:messageID', async (req, res) => {
      const { senderID, messageID } = req.params;
      try {
        const message = await Message.findOne({ senderID, messageID });
        if (message) {
          res.status(200).json(message);
        } else {
          res.status(404).json({ message: 'Message not found' });
        }
      } catch (error) {
        console.error('Error fetching message by sender and ID:', error);
        res.status(500).json({ error: 'Failed to fetch message.' });
      }
    });

    router.put('/api/messages/sender/:senderID/receiver/:receiverID/message/:messageID', async (req, res) => {
      const { senderID, receiverID, messageID } = req.params;
      const { content } = req.body;
      try {
        const updatedMessage = await Message.findOneAndUpdate(
          { senderID, receiverID, messageID },
          { content },
          { new: true, runValidators: true }
        );
        if (updatedMessage) {
          res.status(200).json(updatedMessage);
        } else {
          res.status(404).json({ message: 'Message not found' });
        }
      } catch (error) {
        console.error('Error updating message:', error);
        res.status(500).json({ error: 'Failed to update message.' });
      }
    });

    router.delete('/api/messages/sender/:senderID/receiver/:receiverID/message/:messageID', async (req, res) => {
      const { senderID, receiverID, messageID } = req.params;

      try {
        const deletedMessage = await Message.findOneAndDelete({ senderID, receiverID, messageID });
        if (deletedMessage) {
          res.status(200).json({ message: 'Message deleted' });
        } else {
          res.status(404).json({ message: 'Message not found' });
        }
      } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message.' });
      }
    });

    // Register the router middleware
    this.expressApp.use('/', router);

    // Static routes
    this.expressApp.use('/app/json/', express.static(__dirname + '/app/json'));
    this.expressApp.use('/images', express.static(__dirname + '/img'));
    this.expressApp.use('/', express.static(__dirname + '/pages'));
  }
}

// Export the App class
export { App };