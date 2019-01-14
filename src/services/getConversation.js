import getMessages from './getMessages';

export default () => {
  return {
    getMessagesUnread: () => new Promise((resolve, reject) => {
      setTimeout(()=> {
        resolve(getMessages(33))
      }, 300);
    })
  }
}