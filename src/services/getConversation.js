import getMessages from './getMessages';

const getMessagesAsync = (count, isUp) => () => new Promise((resolve, reject) => {
  setTimeout(()=> {
    resolve(getMessages(count, isUp))
  }, 300);
});

export default () => {
  return {
    getMessagesTop: getMessagesAsync(33, true),
    getMessagesBottom: getMessagesAsync(33),
    getMessagesUnread: getMessagesAsync(33),
  }
}