import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from './message';
import './styles.css';

class Chat extends Component {
  state = {
    messages: [],
  }

  componentDidMount(){
    this.props.getMessagesUnread()
      .then(this.addMessages);
  }

  addMessages = (data) => {
    this.setState({ 
      messages: [
        ...this.state.messages,
        ...data,
      ],
     });
  };

  render() {
    const { messages } = this.state;

    return (
      <div className="chat-container">
        <div className="chat-view">
          <div className="chat-list">
            {messages.map(message => (
              <Message 
                key={message.id}
                data={message}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
Chat.propTypes = {
  // getMessagesTop: PropTypes.func.isRequired,
  // getMessagesBottom: PropTypes.func.isRequired,
  getMessagesUnread: PropTypes.func.isRequired,
};

export default Chat;
  