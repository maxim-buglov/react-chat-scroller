import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Message from './message';
import './styles.css';

class Chat extends Component {
  state = {
    messages: [],
  };

  componentDidMount() {
    this.props.getMessagesUnread()
      .then(this.addMessages);

    this.nodeContainer.addEventListener('scroll', this.handlerScroll);
  }

  componentWillUnmount() {
    this.nodeContainer.removeEventListener('scroll', this.handlerScroll);
  }

  handlerScroll = () => {
    if (this.nodeContainer.scrollTop === 0) {
      console.log('Log top:');
      this.props.getMessagesTop()
        .then(this.addMessages);
    }

    if ((this.nodeContainer.scrollTop + this.nodeContainer.clientHeight) === this.nodeList.clientHeight) {
      console.log('Log bottom:');
      this.props.getMessagesBottom()
        .then(this.addMessages);
    }
  };

  addMessages = (data) => {
    this.setState({
      messages: [
        ...this.state.messages,
        ...data,
      ],
    });
  };

  setRefContainer = (e) => {
    if (e) {
      this.nodeContainer = e;
    }
  };

  setRefList = (e) => {
    if (e) {
      this.nodeList = e;
    }
  };

  render() {
    const { messages } = this.state;

    return (
      <div className="chat-container">
        <div
          className="chat-view"
          ref={this.setRefContainer}
        >
          <div
            className="chat-list"
            ref={this.setRefList}
          >
            {messages.map(message => (
              <Message
                // key={message.id}
                {...message}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  getMessagesTop: PropTypes.func.isRequired,
  getMessagesBottom: PropTypes.func.isRequired,
  getMessagesUnread: PropTypes.func.isRequired,
};

export default Chat;
  