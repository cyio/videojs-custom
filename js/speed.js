// 思路：实时下载速度 = (区间尾值 - 区间尾值) / 绝对时间间隔
// 区间尾值，仅计算当前播放时刻所在区间
// 问题：
// - 有可能 buffer end 连接起来？
// - progress 执行频率是怎样？
let isInCompute = false
export function instantSpeed(video) {
  const currentBuffer = {
    start: -1, // buffer 开始
    duration: 0, // buffer 差
    speed: 0,
    currentBufferIndex: -1
  }
  const bitrate = 1800  // 理论码率

  // 展示速度值到播放器上
  let tId = null
  function _log(speed) {
    const el = document.querySelector('.sticky')
    el.innerText = Number.parseInt(speed) + ' KB/s'
    if (speed !== 0) {
      if (tId) {
        clearTimeout(tId)
        return
      }
      tId = setTimeout(() => {
        // if (!isInCompute) {
        el.innerText = Number.parseInt(0) + ' KB/s'
        tId = null
        // }
      }, 800)
    }
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
    // console.log('conpute speed')
    const { buffered } = video
    const { currentBufferIndex } = currentBuffer
    if (buffered.length && currentBufferIndex >= 0) {
      console.log('end', buffered.end(currentBufferIndex), +Date.now())
      const downEnd = buffered.end(currentBufferIndex) 
      currentBuffer.duration = downEnd - currentBuffer.start
      currentBuffer.unixDuration = +Date.now() - currentBuffer.startUnix
      // 节流
      // if (currentBuffer.duration <= 0.5 || currentBuffer.unixDuration < 100) return
      if (currentBuffer.duration <= 0.5 || currentBuffer.unixDuration < 200) return
      // 计算公式
      currentBuffer.speed = currentBuffer.duration * (bitrate / 8) / (currentBuffer.unixDuration / 1000)
      const isTooLarge = currentBuffer.speed > navigator.connection.downlink / 8 * 1024 * 1.5
      if (!isTooLarge) return // 存在极端值的原因是什么？如何验证
      _log(currentBuffer.speed)
      if (currentBuffer.speed > 800) {
        // debugger
      }
      console.log(Number.parseInt(currentBuffer.speed) + ' kb/s', 'in buffer', currentBuffer)
    } else {
      _log(0)
    }
  }

  function markStart() {
    isInCompute = true
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
      isInCompute = false
      currentBuffer.start = -1
    } 
  }

  // 事件监听
  video.addEventListener('pause', () => {
    // 等待几秒，重置为 0，避免误导用户
    // setTimeout(() => {
    // // 忽略跳转产生的短暂 pause
    // if (currentBuffer.start && video.paused) {
    // _log(0)
    // }
    // }, 3000)
  });
  video.addEventListener('loadstart', () => {
    // 初始设置
    _log(0)
  });
  // fetching event
  video.addEventListener('progress', () => {
    console.log('progress event', +Date.now())
    // 存在开始标记时，计算结果，否则进行标记
    if (isInCompute) {
      computeSpeed()
      isInCompute = false
      currentBuffer.start = -1
    } else {
      markStart()
    }
  })
  video.addEventListener('seeking', () => {
    // 跳转后，buffer 位置可能发生变化，需要重新计算
    if (currentBuffer.start) {
      currentBuffer.start = -1
      isInCompute = false
      _log(0)
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
