export default (manifest, params) => new Promise((resolve, reject) => {
  const queue = new createjs.LoadQueue();

  if (params.progress) queue.addEventListener('progress', params.progress);

  queue.addEventListener('complete', () => resolve(queue));
  queue.addEventListener('error', reject);

  queue.loadManifest(manifest);
});
