import React from 'react'
import { router } from 'base'
import { Scroller } from 'base/scroller'
import sniffer from 'sniffer'
import './styles.styl'

//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

import Lazyload from 'components/shared/components/lazyload'

import videoPlayerSignal from 'actions/video-player-signal'

export default class VideoPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.key = router.route
    this.state = {
      playing: false
    }
  }

  componentDidMount() {
    if (!sniffer.isDevice) {
      Scroller.addListener('beforeSet', this.onRouteChange)
      window.addEventListener('resize', this.onResize)
    } else {
      this.refs.mobilePlayer.addEventListener('play', this.hideButton)
      this.refs.mobilePlayer.addEventListener('pause', this.showButton)
      this.refs.mobilePlayer.load()
    }
  }

  componentWillUnmount() {
    if (!sniffer.isDevice) {
      Scroller.removeListener('beforeSet', this.onRouteChange)
      window.removeEventListener('resize', this.onResize)
    } else {
      this.refs.mobilePlayer.removeEventListener('play', this.hideButton)
      this.refs.mobilePlayer.removeEventListener('pause', this.showButton)
    }
  }

  togglePlayer() {

    const button = this.refs.playerButton

    const offsetToCenter = window.innerHeight / 2
            - button.getBoundingClientRect().top - (button.offsetHeight / 2)

    if (!sniffer.isDevice) {
      TweenMax.fromTo(this.refs.playIcon, .4, {
        opacity: this.state.playing ? 1 : 0,
        scale: this.state.playing ? 1 : .4,
      },{
        opacity: this.state.playing ? 0 : 1,
        scale: this.state.playing ? .4 : 1,
        ease: Power3.easeInOut,
        delay: this.state.playing ? 1 : .5
      })

      TweenMax.fromTo(this.refs.pauseIcon, .4, {
        opacity: this.state.playing ? 0 : 1,
        scale: this.state.playing ? .4 : 1
      },{
        opacity: this.state.playing ? 1 : 0,
        scale: this.state.playing ? 1 : .4,
        ease: Power3.easeInOut,
        delay: this.state.playing ? 1 : .5
      })
    }

    if (this.state.playing) {
      if (sniffer.isDevice) {
        this.openPlayer()
      } else {
        Scroller
          .pause()
          .scrollTo(Scroller.currentY + offsetToCenter)
          .then(() => this.openPlayer())
      }
    } else {
      if (sniffer.isDevice) {
        this.closePlayer()
      } else {
        Scroller.play()
        this.closePlayer()
      }

    }

  }

  onResize = () => {
    if (this.state.playing) {

      const button = this.refs.playerButton
      const offsetToCenter = window.innerHeight / 2
              - button.getBoundingClientRect().top - (button.offsetHeight / 2)

      Scroller.scrollTo(Scroller.currentY + offsetToCenter, 0)
    }
  }

  hideButton = () => {
    TweenMax.to(this.refs.playerButton, 1, {opacity: 0, ease: Expo.easeInOut})
  }

  showButton = () => {
    Scroller.onResize()
    TweenMax.to(this.refs.playerButton, 1, {opacity: 1, ease: Expo.easeInOut})
  }

  openPlayer() {
    if (sniffer.isDevice) {
      this.refs.mobilePlayer.play()
    } else {
      videoPlayerSignal.dispatch(this.key, 'open', this.props.sources)
      TweenMax.to(this.refs.playerButton, 1, {left: '-30%', scale: .8, ease: Power3.easeInOut})
    }

  }

  closePlayer() {
    if (sniffer.isDevice) {
      this.refs.mobilePlayer.pause()
    } else {
      videoPlayerSignal.dispatch(this.key, 'close', this.props.sources)
      TweenMax.to(this.refs.playerButton, 1, {left: '0%', scale: 1, ease: Power3.easeInOut})
    }
  }


  onPlay = (e) => {
    e.preventDefault()
    this.state.playing = !this.state.playing
    this.togglePlayer()
  }

  didAppear() {
    if (!sniffer.isDevice)
      this.refs.lazyload.didAppear && this.refs.lazyload.didAppear()
  }

  onRouteChange = () => {
    if (this.key != router.route)
      this.refs.lazyload.refs.video.pause()
    else
      this.refs.lazyload.refs.video.play()
  }

  renderCover() {
    if (sniffer.isDevice) {
      return (
        <video ref="mobilePlayer">
          <source src={config.path + this.props.sources.mp4} type="video/mp4" />
        </video>
      )

    } else {
      return <Lazyload ref="lazyload" type="video" {...this.props} sources={this.props.loop.sources}/>
    }
  }

  render() {

    const button = {
      background: this.props.theme.primary
    }

    return (
      <div
        ref="component"
        className={`component video-player ${this.props.className || ''}`}
      >
        <div
          ref="playerButton"
          className="play-button"
          onClick={this.onPlay}
        >
          <div className="translucent" style={button} />
          <div className="flat" style={button}>
            <img ref="playIcon" className="play-icon" src={`${config.path}assets/img/play-icon.svg`} />
            <img ref="pauseIcon" className="pause-icon" src={`${config.path}assets/img/pause-icon.svg`} alt="Pause" />
          </div>
        </div>

        <div className="video-wrapper">
          <div className="cover">
            { this.renderCover() }
          </div>
        </div>
      </div>
    )
  }
}

const VideoPlayerWithScroll = withScroll(VideoPlayer)

export { VideoPlayerWithScroll }
