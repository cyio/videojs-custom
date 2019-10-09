// 卡顿缓冲时长
function myLog(video) {
  video._buffer_times = 0;

  const logBuffer = (video) => {
    video._buffer_times += 1;

    // 初次缓冲为正常缓冲，不上报
    if (video._buffer_times === 1) {
      return;
    }

    if (video._waiting_time && video._playing_time) {
      const bufferCost = video._playing_time - video._waiting_time;
      if (bufferCost > 4000) {
        console.log('Buffer', [(bufferCost / 1000).toFixed(1) + 's']);
      }
    }
  };

  // 暂停需要重置
  ['waiting', 'playing', 'ended'].forEach((eventName) => {
    video.addEventListener(eventName, () => {
      // console.log({ eventName })
      const key = `_${eventName}_time`;
      video[key] = Date.now();

      // 在 playing 时记录卡顿
      if (eventName === 'playing') {
        logBuffer(video);
      }

      // 播放结束重置卡顿计数器
      if (eventName === 'ended') {
        video._buffer_times = 0;
      }
    });
  });
}

function eventLog(video) {
  [
    'loadstart',
    // 'progress',
    // 'suspend',
    'abort',
    'error',
    'emptied',
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
    'ratechange',
    'resize',
    'volumechange',
  ].forEach(eventName => {
    video.addEventListener(eventName, () => {
      // console.log({ eventName, }, video.currentTime, Date.now())
    });
  })
}
