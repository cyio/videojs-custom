// 卡顿缓冲时长
function myLog(video) {
  video._buffer_times = 0;

  // 视频卡顿
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
        console.log({
          // online: window.navigator.onLine,
          downlink: window.navigator.connection.downlink
          // duration: parseInt(video.duration),
          // currentTime: parseInt(video.currentTime),
        })
        console.log('waiting', new Date(video._waiting_time))
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

  // 断网不计算 buffer
  window.addEventListener('offline', () => video._waiting_time = null);

  // 加载延迟
  const logLatency = (video) => {
    if (video._loadstart_time && video._loadedmetadata_time && video._loadeddata_time) {
      const loadedmetadataCost = video._loadedmetadata_time - video._loadstart_time; // 元信息
      const loadeddataCost = video._loadeddata_time - video._loadstart_time; // 首真

      console.log('Latency', [loadedmetadataCost, loadeddataCost]);
    }
  };

  ['loadstart', 'loadedmetadata', 'loadeddata'].forEach((eventName) => {
    video.addEventListener(eventName, function callback() {
      const key = `_${eventName}_time`;
      video[key] = Date.now();

      // 在 loadeddata 时记录延迟
      if (eventName === 'loadeddata') {
        logLatency(video);
      }

      // 延迟只需记录一次，相关的监听器触发过后则可移除
      video.removeEventListener(eventName, callback);
    });
  });
}

function eventLog(video) {
  [
    'loadstart',
    'progress',
    'suspend',
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
      // console.log({ video })
      // console.log({ eventName, }, video.currentTime, Date.now())
      console.log({ eventName })
    });
  })
}
