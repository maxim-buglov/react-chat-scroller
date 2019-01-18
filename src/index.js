import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import last from 'lodash/last';
import head from 'lodash/head';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import Conversation from './fixtures/Conversation';
import Chat from './Chat';
import Message from './Message';
import './styles.css';

// TODO: Skip button, unread messages
// TODO: Dynamic new message

// TODO: Go to message animation
// TODO: Fix double event scroll load
// TODO: Offset load
// TODO: Few messages, bug load
// TODO: Scrolls controls

const START_COUNT_MESSAGES = 300;

class App extends Component {
  state = {
    conversation: new Conversation({ startCount: START_COUNT_MESSAGES }),
    countPartMessages: 33,
    messages: [],
    loadedBottomMessages: false,
    optionScrollToKey: '',
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

  onClickScrollControl = (id) => {
    const { conversation, countPartMessages, messages } = this.state;
    const idNumber = parseInt(id);

    if (messages.find(m => m.id === idNumber)) {
      return this.setState({ optionScrollToKey: id });
    }

    return conversation.getMessages({
      count: countPartMessages,
      offset: -5,
      id: idNumber,
    })
      .then(messages => this.setState({ messages, optionScrollToKey: id }));
  };

  renderScrollControlItem = (message) => {
    return (
      <button
        key={message.id}
        className={classNames("scroll-controls-item", {
          'loaded': this.state.messages.find(m => m.id === message.id),
        })}
        onClick={() => this.onClickScrollControl(message.id.toString())}
        type="button"
      >
        {`#${message.id}`}
      </button>
    );
  };

  renderMessage = (message) => {
    return (
      <Message
        key={message.id}
        {...message}
      />
    );
  };

  render() {
    return (
      <div className="app-container">
        <div className="scroll-controls-container">
          {this.state.conversation.messages.map(this.renderScrollControlItem)}
        </div>
        <div className="chat-container">
          <Chat
            onScrollTop={this.onScrollTop}
            onScrollBottom={this.onScrollBottom}
            scrollToKey={this.state.optionScrollToKey}
          >
            {this.state.messages.map(this.renderMessage)}
          </Chat>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
