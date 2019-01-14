import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './styles.css';

class Message extends Component {
  render() {
    const classListMessageContainer = classNames('message-container', {
      'message-container-my': this.props.isMyMessage,
    });
    return (
      <div className={classListMessageContainer}>
        <div className="message-text">
          {this.props.text}
        </div>
        <div className="message-date">
          {this.props.date}
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  isMyMessage: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
};

export default Message;
  