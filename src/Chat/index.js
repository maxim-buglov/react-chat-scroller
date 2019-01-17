import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import differenceBy from 'lodash/differenceBy';
import animation from '../utils/animation';
import './styles.css';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.nodesChildren = {};
  }

  componentDidMount() {
    this.nodeContainer.addEventListener('scroll', this.handlerScroll);

    window.scrollTo = this.scrollTo;
    window.nodesChildren = this.nodesChildren;
  }

  componentWillUnmount() {
    this.nodeContainer.removeEventListener('scroll', this.handlerScroll);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const differentChildren = differenceBy(nextProps.children, this.props.children, 'key');

    if (differentChildren.length) {
      if (this.pendingScrollTop) {
        this.saveClientHeight = this.nodeList && this.nodeList.clientHeight;
      }
    } else {
      this.pendingScrollTop = false;
    }

    if (nextProps.scrollTo && (nextProps.scrollTo !== this.props.scrollTo)) {
      this.scrollTo();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.pendingScrollTop) {
      this.nodeContainer.scrollTop = this.nodeList.clientHeight - this.saveClientHeight;
      this.pendingScrollTop = false;
    }
  }

  scrollTo = (position) => {
    animation((progress) => {
      this.nodeContainer.scrollTop =
        (this.nodeContainer.scrollTop * (1 - progress)) + (position * progress);
    }, 300);
  };

  handlerScroll = () => {
    const { scrollTop, clientHeight } = this.nodeContainer;

    if (scrollTop === 0) {
      this.pendingScrollTop = true;
      this.props.onScrollTop();
    }

    if ((scrollTop + clientHeight) === this.nodeList.clientHeight) {
      this.props.onScrollBottom();
    }
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

  setRefChild = (e, key) => {
    console.log('Log e, key:', e, key);
    if (e) {
      this.nodesChildren[key] = e;
    }
  };

  renderItemChildren = (child) => {
    return cloneElement(child, { getRef: e => this.setRefChild(e, child.key) });
  };

  render() {
    console.log('Log this:', this);
    return (
      <div
        className="chat-view"
        ref={this.setRefContainer}
      >
        <div
          className="chat-list"
          ref={this.setRefList}
        >
          {this.props.children.map(this.renderItemChildren)}
        </div>
      </div>
    );
  }
}

Chat.propTypes = {
  onScrollTop: PropTypes.func.isRequired,
  onScrollBottom: PropTypes.func.isRequired,
  children: PropTypes.node,
};

Chat.defaultProps = {
  children: null,
};

export default Chat;
  