function instantSpeed(video) {
  const clip = {
    start: -1,
    duration: 0,
    speed: 0,
    currentBufferIndex: -1
  }
  const bitrate = 1800

  function _log(speed) {
    const el = document.querySelector('.sticky')
    el.innerText = Number.parseInt(speed) + ' kb/s'
  }
  function searchInbuffered(time) {
    const { buffered } = video
    for (let i = 0; i < buffered.length; i++) {
      const start = buffered.start(i) 
      const end = buffered.end(i) 
      if (time >= start && time <= end) {
        return i
      }
    }
    return -1
  }
  function computeSpeed() {
    const { buffered, currentTime } = video
    const { currentBufferIndex } = clip
    if (buffered.length && currentBufferIndex >= 0) {
      console.log('end', buffered.end(currentBufferIndex), +Date.now())
      const downEnd = buffered.end(currentBufferIndex) 
      clip.duration = downEnd - clip.start
      clip.unixDuration = +Date.now() - clip.startUnix
      if (clip.unixDuration > 400) {
        clip.speed = clip.duration * (bitrate / 8) / (clip.unixDuration / 1000)
        const isTooLarge = clip.speed > navigator.connection.downlink / 8 * 1024 * 1.5
        if (!isTooLarge) {
          _log(clip.speed)
          if (clip.speed > 800) {
            debugger
          }
          console.log(Number.parseInt(clip.speed) + ' kb/s', 'in buffer', clip)
        }
      }
    } else {
      _log(0)
    }
    clip.start = -1
  }
  function markStart() {
    const { buffered, currentTime } = video
    clip.currentBufferIndex = searchInbuffered(currentTime)
    // 当前播放时间存在于 buffered，才能计算
    const { currentBufferIndex } = clip
    if (currentBufferIndex >= 0) {
      console.log('start', buffered.end(currentBufferIndex), +Date.now())
      clip.start = buffered.end(currentBufferIndex) 
      clip.startUnix = +Date.now()
    } else {
      _log(0)
      clip.start = -1
    } 
  }
  video.addEventListener('pause', () => {
    setTimeout(() => {
      // 忽略跳转产生的短暂 pause
      if (clip.start && video.paused) {
        _log(0)
      }
    }, 3000)
  });
  video.addEventListener('loadstart', () => {
    _log(0)
  });
  // fetching event
  video.addEventListener('progress', () => {
    // console.log('progress event', +Date.now())
    if (clip.start > 0) {
      computeSpeed()
    } else {
      markStart()
    }
  })
  video.addEventListener('seeking', () => {
    if (clip.start) {
      clip.start = -1
    }
  })
  window.addEventListener('offline', () => {
    setTimeout(() => {
      if (clip.speed) {
        _log(0)
      }
    }, 5000)
  });
}
