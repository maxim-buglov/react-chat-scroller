export default (func, duration = 0, easing = data => data) => {
  return new Promise((resolve) => {
    if (!duration) {
      func(1);
      return resolve();
    }
    const startDate = Date.now();
    const tick = () => {
      const progress = Math.min(1, (Date.now() - startDate) / duration);

      func(easing(progress));

      if (progress < 1) {
        window.requestAnimationFrame(tick);
      } else {
        resolve();
      }
    };
    tick();
  });
}
