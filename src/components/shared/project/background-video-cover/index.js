import React from 'react'
import { router } from 'base'
import { Cache } from 'base/cache'
import { Scroller } from 'base/scroller'
import Queue from 'base/queue'
import './styles.styl'
import sniffer from 'sniffer'

import videoPlayerSignal from 'actions/video-player-signal'
import loaderCompleteSignal from 'actions/loader-complete'
import videoBackgroundSignal from 'actions/video-background-signal'
import navSignal from 'actions/nav-signal'


export default class BackgroundVideoCover extends React.Component {
  constructor(props) {
    super(props)
    this.key = router.route

    this.state = {
      src: ''
    }

    this.current = 0

  }

  componentDidMount() {
    Scroller.addListener('beforeSet', this.onRouteChange)

    videoBackgroundSignal.add(this.onVideoChange)
    videoPlayerSignal.add(this.onPlayerToggle)
    loaderCompleteSignal.add(this.updateSource)

    this.updateSource()

    if (!sniffer.isDevice) {

      this.refs.video.addEventListener('loadeddata', this.onVideoLoaded);

      this.videos = [
        this.refs.video,
        this.refs.videoNav
      ]
    } else {
      this.videos = [
        this.refs.gif,
        this.refs.gifNav
      ]
    }

  }

  componentDidUpdate() {
    if (sniffer.isDevice) return
    this.refs.video.play()
  }

  componentWillUnmount() {
    Scroller.removeListener('beforeSet', this.onRouteChange)

    videoBackgroundSignal.remove(this.onVideoChange)
    videoPlayerSignal.remove(this.onPlayerToggle)
    loaderCompleteSignal.remove(this.updateSource)
    if (!sniffer.isDevice) {
      this.refs.video.removeEventListener('loadeddata', this.onVideoLoaded)
    }
  }

  updateSource = () => {
    if (sniffer.isDevice) {
      if ( Cache.get(this.key) ) {
        this.refs.gif.src = Cache.get(this.key).src
      } else {
        this.refs.gif.src = Cache.get('ferdinand-berthoud') && Cache.get('ferdinand-berthoud').src
      }
    } else {
      this.refs.video.src = Cache.get(this.key) || Cache.get('ferdinand-berthoud')
    }
  }

  get currentVideo() {
    return this.videos[this.current]
  }

  get nextVideo() {
    return this.videos[(this.current + 1) % this.videos.length]
  }

  transitionTo(video, instant = false) {
    if (sniffer.isDevice) {
      if (video.src == this.currentSrc) return
      this.currentSrc = video.src
      TweenMax.set(this.nextVideo, {zIndex: 2, opacity: 1})
      this.nextVideo.src = video.src || ''
      TweenMax.set(this.currentVideo, {zIndex: 1, opacity: 1})
      this.current = (this.current + 1) % this.videos.length
    } else {
      if (video == this.currentSrc) return
      this.currentSrc = video
      TweenMax.set(this.nextVideo, {zIndex: 2, opacity: 1})
      this.nextVideo.src = video || ''
      this.nextVideo.play()
      TweenMax.set(this.currentVideo, {zIndex: 1, opacity: 1})
      this.currentVideo.pause()
      this.current = (this.current + 1) % this.videos.length
    }
  }

  onPlayerToggle = (key, action) => {
    if (key !== this.key || sniffer.isDevice) return
    action == 'open' ? this.refs.video.pause() : this.refs.video.play()
  }

  onVideoLoaded = () => {
    this.refs.video.play()
  }

  onVideoChange = (video, instant) => {
    this.transitionTo(video, instant)
  }

  onRouteChange = (nextKey) => {
    if (sniffer.isDevice) {
      if (this.key != nextKey) {
        if (this.key == 'home') this.key = 'ferdinand-berthoud'
        this.transitionTo(Cache.get(this.key), true)
      }
      return
    }

    if (this.key != nextKey) {
      this.transitionTo(Cache.get(this.key), true)
      this.refs.video.pause()
    } else {
      if (Cache.get(this.key)) this.refs.video.play()
    }
  }

  renderCover() {
    if (sniffer.isDevice) {
      return (
        <div className="video-wrapper">
          <img ref="gifNav" className="gif-cover" />
          <img ref="gif" className="gif-cover" />
        </div>
      )
    } else {
      return (
        <div className="video-wrapper">
          <video ref="videoNav" width="100%" height="100%" loop muted>
            Your browser does not support the video tag.
          </video>
          <video ref="video" width="100%" height="100%" loop muted>
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }
  }

  render() {

    const background = {
      backgroundColor: this.props.theme.primary
    }

    return (
        <div className="component background-video-cover">
          <div className="video-pattern" />
          { this.renderCover() }
        </div>
    )
  }
}
