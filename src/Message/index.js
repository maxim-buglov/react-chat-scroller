import React, { Component } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import classNames from 'classnames';
import './styles.css';

class Message extends Component {
  render() {
    const classListMessageContainer = classNames('message-container', {
      'message-container-my': this.props.isMyMessage,
    });
    return (
      <div
        className={classListMessageContainer}
        ref={e => this.props.getRef(e)}
      >
        <div className="message-text">
          {this.props.text}
        </div>
        <div className="message-options">
          <span>{new Date(this.props.date).toLocaleTimeString()}</span>
          <span>#{this.props.id}</span>
        </div>
      </div>
    );
  }
}

Message.propTypes = {
  isMyMessage: PropTypes.bool.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  getRef: PropTypes.func,
};

Message.defaultProps = {
  getRef: noop,
};

export default Message;
  