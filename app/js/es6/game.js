import Bg from './elements/background.js';

export default {
  init({ queue, stage }) {
    const bg = new Bg(queue);
    bg.addTo(stage);
  },
};
