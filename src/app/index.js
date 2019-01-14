import React, { Component } from 'react';
import Chat from '../chat';
import getConversation from '../services/getConversation';
import './styles.css';

const conversation = getConversation();

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <Chat
          getMessagesTop={conversation.getMessagesTop}
          getMessagesBottom={conversation.getMessagesBottom}
          getMessagesUnread={conversation.getMessagesUnread}
        />
      </div>
    );
  }
}

export default App;
