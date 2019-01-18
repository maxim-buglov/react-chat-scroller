import React, { Component, cloneElement } from 'react';
import PropTypes from 'prop-types';
import differenceBy from 'lodash/differenceBy';
import animation from '../utils/animation';
import './styles.css';

const MIN_SCROLL_DISTANCE_FOR_CALL_EVENT_LOAD = 100;

class Chat extends Component {
  static propTypes = {
    onScrollTop: PropTypes.func.isRequired,
    onScrollBottom: PropTypes.func.isRequired,
    scrollToKey: PropTypes.string.isRequired,
    children: PropTypes.node,
  };

  static defaultProps = {
    children: null,
  };

  constructor(props) {
    super(props);
    this.nodeContainer = null;
    this.nodeList = null;
    this.nodesChildren = {};
    this.saveClientHeight = 0;
    this.saveScrollTop = 0;
    this.pendingScrollTop = false;
    this.pendingScrollBottom = false;
    this.pendingScrollToKey = false;
    this.pendingUpdateChildren = false;
    this.pendingRefreshChildren = false;
  }

  componentDidMount() {
    this.nodeContainer.addEventListener('scroll', this.handlerScroll);
  }

  componentWillUnmount() {
    this.nodeContainer.removeEventListener('scroll', this.handlerScroll);
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const differentChildren = differenceBy(nextProps.children, this.props.children, 'key');
    const differentScrollToKey = nextProps.scrollToKey && (nextProps.scrollToKey !== this.props.scrollToKey);

    if (differentChildren.length) {
      this.pendingUpdateChildren = true;
      if (this.pendingScrollTop) {
        this.saveClientHeight = this.nodeList && this.nodeList.clientHeight;
      }
      if (differentChildren.length === nextProps.children.length) {
        this.pendingRefreshChildren = true;
      }
    }

    if (differentScrollToKey) {
      this.pendingScrollToKey = true;
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.pendingUpdateChildren) {
      if (this.pendingScrollTop) {
        this.nodeContainer.scrollTop = this.nodeList.clientHeight - this.saveClientHeight;
      }
      this.pendingScrollTop = false;
      this.pendingScrollBottom = false;
      this.pendingUpdateChildren = false;
    }

    if (this.pendingScrollToKey) {
      const node = this.nodesChildren[this.props.scrollToKey];
      this.pendingScrollToKey = false;
      if (node) {
        const position = parseInt(window.getComputedStyle(node).marginTop, 10);
        this.scrollTo(node.offsetTop - position, this.pendingRefreshChildren ? 0 : 300);
      }
    }

    this.pendingRefreshChildren = false;
  }

  scrollTo = (position, duration) => {
    animation((progress) => {
      this.nodeContainer.scrollTop =
        (this.nodeContainer.scrollTop * (1 - progress)) + (position * progress);
    }, duration);
  };

  handlerScroll = () => {
    const { scrollTop, clientHeight } = this.nodeContainer;
    const bottomLine = this.nodeList.clientHeight - MIN_SCROLL_DISTANCE_FOR_CALL_EVENT_LOAD;
    const topLimit = scrollTop <= MIN_SCROLL_DISTANCE_FOR_CALL_EVENT_LOAD;
    const bottomLimit = (scrollTop + clientHeight) >= bottomLine;
    const directionTop = this.saveScrollTop > scrollTop;
    this.saveScrollTop = scrollTop;

    if (!this.pendingScrollTop && topLimit && directionTop) {
      this.pendingScrollTop = true;
      this.props.onScrollTop();
    }

    if (!this.pendingScrollBottom && bottomLimit && !directionTop) {
      this.pendingScrollBottom = true;
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
    if (e) {
      this.nodesChildren[key] = e;
    }
  };

  renderItemChildren = (child) => {
    return cloneElement(child, { getRef: e => this.setRefChild(e, child.key) });
  };

  render() {
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

export default Chat;
  