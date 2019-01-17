import random from 'lodash/random';
import fastLoremIpsum from 'fast-lorem-ipsum';

export default ({ date, id }) => ({
  isMyMessage: !!random(0, 1),
  text: fastLoremIpsum(random(3, 15), 'w'),
  date: date,
  id: id,
});
