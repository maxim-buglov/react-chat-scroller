import random from 'lodash/random';
import getMessage from './getMessage';

const getAsync = (data) => new Promise((resolve) =>
  setTimeout(() => resolve(data), random(100, 300)));

class Conversation {
  constructor(options) {
    this.onNewMessageListeners = [];
    this.init(options);
  }

  init(options) {
    this.messages = [];
    this.nextId = 0;
    this.nextDate = new Date().getTime();
    this.unreadCount = random(0, options.startCount);

    for (let i = 0; i < options.startCount; i++) {
      this.addMessage();
    }
  }

  addMessage() {
    const message = getMessage({
      date: this.nextDate,
      id: this.nextId,
    });
    this.messages.push(message);
    this.nextId += 1;
    this.nextDate += random(1000, 300000);
    return message;
  }

  getUnreadCount() {
    return this.unreadCount;
  };

  getMessages(options) {
    const {
      offset = 0,
      count = 0,
      sinceDateInclusive = false,
      sinceDateExclusive = false,
      tillDateInclusive = false,
      tillDateExclusive = false,
    } = options;

    const sinceDate = sinceDateInclusive || sinceDateExclusive;
    const tillDate = tillDateInclusive || tillDateExclusive;
    const searchOptionDate = sinceDate || tillDate;

    if (!searchOptionDate) {
      return getAsync(this.messages.slice(offset, offset + count));
    }

    const currentMessage = this.messages.find(m => (m.date === searchOptionDate));
    if (!currentMessage) {
      console.error("No found message");
      return Promise.resolve();
    }

    if (sinceDate) {
      const sinceDateOffset = offset + currentMessage.id + (sinceDateInclusive ?  0 : 1);
      return getAsync(this.messages.slice(sinceDateOffset, sinceDateOffset + count));
    }

    if (tillDate) {
      const tillDateOffset = offset + currentMessage.id - (tillDateInclusive ?  1 : 0);
      const startIndex = tillDateOffset - count;
      const startIndexCorrect = Math.max(0,startIndex);
      const endIndexCorrect = Math.max(0,tillDateOffset);
      return getAsync(this.messages.slice(startIndexCorrect, endIndexCorrect));
    }

    return Promise.resolve();
  };

  onNewMessage(listener) {
    this.onNewMessageListeners.push(listener);
  }
}

export default Conversation;