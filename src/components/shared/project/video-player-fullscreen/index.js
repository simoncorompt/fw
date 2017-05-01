import React from 'react'
import { router } from 'base'
import autobind from 'autobind'
import './styles.styl'

import videoPlayerSignal from 'actions/video-player-signal'

export default class VideoPlayerFullscreen extends React.Component {
  constructor(props) {
    super(props)
    this.key = router.route
  }

  componentDidMount() {
    videoPlayerSignal.add(this.setVideo, this)
    this.refs.video.addEventListener('loadeddata', this.onVideoLoaded);
    this.refs.video.addEventListener('timeupdate', this.onTimeUpdate);
  }

  componentWillUnmount() {
    videoPlayerSignal.remove(this.setVideo, this)
    this.refs.video.removeEventListener('loadeddata', this.onVideoLoaded)
    this.refs.video.removeEventListener('timeupdate', this.onTimeUpdate)
  }

  showPlayer() {
    TweenMax.to(this.refs.component, .8, {autoAlpha: 1})
  }

  hidePlayer() {
    TweenMax.to(this.refs.component, .8, {autoAlpha: 0})
  }

  setVideo(key, action, sources) {
    // If the signal is dispatched from other route
    if (key !== this.key) return

    if (action === 'open') {
      const videoSources = Object.keys(sources).map(source => {
        this.refs[source].src = `${config.path + sources[source]}`
        return this.refs[source]
      })

      this.showPlayer()
      this.refs.video.load()
    } else {
      this.refs.video.pause()
      this.hidePlayer()
    }
  }

  onTimeUpdate = () => {
    const perc = (this.refs.video.currentTime / this.refs.video.duration) * 100

    TweenMax.to(this.refs.progressBar, .6, {
      width: `${perc}%`,
      ease: Power3.easeOut
    })
  }

  onBarClick = (e) => {
    const offset = e.pageX - this.refs.progressWrapper.offsetLeft
    const time = offset / this.refs.progressWrapper.offsetWidth * this.refs.video.duration
    this.refs.video.currentTime = time
  }

  onMouseEnter = () => {
    TweenMax.to(this.refs.progressWrapper, .4, {height: 8, ease: Expo.easeOut})
  }

  onMouseLeave = () => {
    TweenMax.to(this.refs.progressWrapper, .4, {height: 4, ease: Expo.easeOut})
  }

  onVideoLoaded = () => {
    this.refs.volume = .6
    this.refs.video.play()
  }

  render() {
    const progressBar = {
      background: this.props.theme.primary
    }

    return (
        <div ref="component" className="component video-player-fullscreen">

          <video ref="video" width="100%" height="100%" loop>
            <source ref="webm" type="video/webm" />
            <source ref="mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <div
            ref="progressWrapper"
            className="progress-bar-wrapper"
            onClick={this.onBarClick}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            <div ref="progressBar" className="progress-bar" style={progressBar} />
          </div>

          <div className="gradient" />
        </div>
    )
  }
}
