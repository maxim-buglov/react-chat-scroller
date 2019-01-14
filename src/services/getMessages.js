import random from 'lodash/random';
import fastLoremIpsum from 'fast-lorem-ipsum';

let lastId = random(0, 300);
let lastDate = new Date().getTime();

const getMessage = (isUp) => ({
    id: lastId = isUp ? lastId - 1 : lastId + 1,
    isMyMessage: !!random(0, 1),
    date: lastDate = isUp ? lastDate - 10 : lastDate + 10, 
    text: fastLoremIpsum(random(3, 30), 'w'),
});

export default (countMessage, isUp) => {
  let messages = [];
  for (let i = 0; i < countMessage; i++) {
    messages.push(getMessage(isUp));
  }
  return messages;
};