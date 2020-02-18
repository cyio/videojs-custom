export function eventLog(video) {
  [
    'loadstart',
    // 'progress',
    // 'suspend',
    'abort',
    'error',
    'emptied', // 已载入时，调用`load()`方法重载时触发
    'stalled',
    'loadedmetadata',
    'loadeddata',
    'canplay',
    'canplaythrough',
    'playing',
    'waiting',
    'seeking',
    'seeked',
    'ended',
    'durationchange',
    // 'timeupdate',
    'play',
    'pause',
    'ratechange', // playbackrate
    'resize',
    'volumechange',
  ].forEach(eventName => {
    video.addEventListener(eventName, () => {
      // console.log({ video })
      const { currentTime, readyState } = video
      console.log({ eventName, }, currentTime, Date.now(), readyState)
      // console.log({ eventName })
    });
  })
}
