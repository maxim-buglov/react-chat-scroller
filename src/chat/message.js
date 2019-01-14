import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles.css';

class Message extends Component {
  render() {
    const { text, date } = this.props.data;

    return (
      <div className="message-container">
        <div className="message-text">
          {text}
        </div>
        <div className="message-date">
          {date}
        </div>
      </div>
    );
  }
}
  
Message.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string.isRequired,
    date: PropTypes.number.isRequired,
  }).isRequired,
};

export default Message;
  