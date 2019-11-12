function instantSpeed(video) {
  const currentBuffer = {
    start: -1,
    duration: 0,
    speed: 0,
    currentBufferIndex: -1
  }
  const bitrate = 1800  // 理论码率

  function _log(speed) {
    const el = document.querySelector('.sticky')
    el.innerText = Number.parseInt(speed) + ' KB/s'
  }
  // 计算给定时间，是否存在于 buffered，不存在返回 -1
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
    const { currentBufferIndex } = currentBuffer
    if (buffered.length && currentBufferIndex >= 0) {
      console.log('end', buffered.end(currentBufferIndex), +Date.now())
      const downEnd = buffered.end(currentBufferIndex) 
      currentBuffer.duration = downEnd - currentBuffer.start
      currentBuffer.unixDuration = +Date.now() - currentBuffer.startUnix
      if (currentBuffer.unixDuration > 400) {
        currentBuffer.speed = currentBuffer.duration * (bitrate / 8) / (currentBuffer.unixDuration / 1000)
        const isTooLarge = currentBuffer.speed > navigator.connection.downlink / 8 * 1024 * 1.5
        if (!isTooLarge) {
          _log(currentBuffer.speed)
          if (currentBuffer.speed > 800) {
            debugger
          }
          console.log(Number.parseInt(currentBuffer.speed) + ' kb/s', 'in buffer', currentBuffer)
        }
      }
    } else {
      _log(0)
    }
    currentBuffer.start = -1
  }
  function markStart() {
    const { buffered, currentTime } = video
    currentBuffer.currentBufferIndex = searchInbuffered(currentTime)
    // 当前播放时间存在于 buffered，才能计算
    const { currentBufferIndex } = currentBuffer
    if (currentBufferIndex >= 0) {
      console.log('start', buffered.end(currentBufferIndex), +Date.now())
      currentBuffer.start = buffered.end(currentBufferIndex) 
      currentBuffer.startUnix = +Date.now()
    } else {
      _log(0)
      currentBuffer.start = -1
    } 
  }
  video.addEventListener('pause', () => {
    // 等待几秒，重置为 0，避免误导用户
    setTimeout(() => {
      // 忽略跳转产生的短暂 pause
      if (currentBuffer.start && video.paused) {
        _log(0)
      }
    }, 3000)
  });
  video.addEventListener('loadstart', () => {
    // 初始设置
    _log(0)
  });
  // fetching event
  video.addEventListener('progress', () => {
    // console.log('progress event', +Date.now())
    // 存在开始标记时，计算结果，否则进行标记
    if (currentBuffer.start > 0) {
      computeSpeed()
    } else {
      markStart()
    }
  })
  video.addEventListener('seeking', () => {
    // 跳转后，buffer 位置可能发生变化，需要重新计算
    if (currentBuffer.start) {
      currentBuffer.start = -1
    }
  })
  window.addEventListener('offline', () => {
    // 等待几秒，重置为 0，避免误导用户
    setTimeout(() => {
      if (currentBuffer.speed) {
        _log(0)
      }
    }, 5000)
  });
}
