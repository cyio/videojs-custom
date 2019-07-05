// The events are from https://www.w3.org/TR/html5/semantics-embedded-content.html#media-elements-event-summary
import videojs from 'video.js'

const Plugin = videojs.getPlugin('plugin')
const EVENTS = [
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
  'timeupdate',
  'play',
  'pause',
  'ratechange',
  'resize',
  'volumechange',
]

class EventLogger extends Plugin {
  constructor(player) {
    super(player)

    this.on(player, EVENTS, this.logEvents)
  }

  logEvents(event) {
    videojs.log(event)
  }

  /**
   * This function stops the plugin on dispose
   */
  dispose() {
    super.dispose()
    videojs.log('the EventLogger plugin is being disposed')
  }
}

export default EventLogger
