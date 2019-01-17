import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import last from 'lodash/last';
import head from 'lodash/head';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import Conversation from './fixtures/Conversation';
import Chat from './Chat';
import Message from './Message';
import './styles.css';

class App extends Component {
  state = {
    conversation: new Conversation({ startCount: 300 }),
    countPartMessages: 33,
    messages: [],
    loadedBottomMessages: false,
  };

  componentDidMount() {
    const { conversation, countPartMessages } = this.state;
    const unreadCount = conversation.getUnreadCount();

    if (!unreadCount) {
      this.setState({
        loadedBottomMessages: true,
      });
    }

    return conversation.getMessages({
      count: countPartMessages,
      offset: unreadCount,
    })
      .then(this.addMessage);
  }

  addMessage = (data) => {
    const messages = sortBy(uniqBy([
      ...this.state.messages,
      ...data,
    ], i => i.id), i => i.id);

    this.setState({ messages });
  };

  onScrollTop = () => {
    const { conversation, countPartMessages, loadedBottomMessages, messages } = this.state;
    const options = {
      count: countPartMessages,
    };

    if (!loadedBottomMessages) {
      options.tillDateExclusive = head(messages).date;
    } else {
      options.offset = messages.length;
    }

    return conversation.getMessages(options)
      .then(this.addMessage);
  };

  onScrollBottom = () => {
    const { conversation, countPartMessages, loadedBottomMessages, messages } = this.state;
    const options = {
      count: countPartMessages,
    };

    if (!loadedBottomMessages) {
      options.sinceDateExclusive = last(messages).date;
    } else {
      options.offset = messages.length;
    }

    return conversation.getMessages(options)
      .then(this.addMessage);
  };

  render() {
    return (
      <div className="app-container">
        <div className="chat-container">
          <Chat
            onScrollTop={this.onScrollTop}
            onScrollBottom={this.onScrollBottom}
            // scrollTo={}
          >
            {this.state.messages.map(message => (
              <Message
                key={message.id}
                {...message}
              />
            ))}
          </Chat>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
