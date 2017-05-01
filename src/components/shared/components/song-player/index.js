import React from 'react'
import { Scroller } from 'base/scroller'
import autobind from 'autobind'
import './styles.styl'

import changeRouteSignal from 'actions/change-route-signal'

export default class SongPlayer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      playing: false,
    }
  }

  componentDidMount() {
    this.refs.player.volume = .6
    this.refs.player.addEventListener('timeupdate', this.update)
    changeRouteSignal.add(this.routeChange)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.playing != this.state.playing)
      this.togglePlayer()
  }

  componentWillUnmount() {
    this.refs.player.removeEventListener('timeupdate', this.update)
    changeRouteSignal.remove(this.routeChange)
  }

  routeChange = () => {
    this.setState({ playing: false })
  }

  play = () => {
    this.refs.player.play()
  }

  pause = () => {
    this.refs.player.pause()
  }

  togglePlayer() {
    this.state.playing ? this.play() : this.pause()

    TweenMax.fromTo(this.refs.playIcon, .4, {
      opacity: this.state.playing ? 1 : 0,
      scale: this.state.playing ? 1 : .4,
    },{
      opacity: this.state.playing ? 0 : 1,
      scale: this.state.playing ? .4 : 1,
      ease: Power3.easeInOut
    })

    TweenMax.fromTo(this.refs.pauseIcon, .4, {
      opacity: this.state.playing ? 0 : 1,
      scale: this.state.playing ? .4 : 1
    },{
      opacity: this.state.playing ? 1 : 0,
      scale: this.state.playing ? 1 : .4,
      ease: Power3.easeInOut
    })
  }

  @autobind
  update(player) {
    const duration = this.refs.player.duration
    const time = this.refs.player.currentTime
    const fraction = time / duration
    const percent = Math.ceil(fraction * 100)

    TweenMax.to(this.refs.progress, 1, {width: `${percent}%`, ease: Power2.easeOut})
  }

  @autobind
  onClick() {
    this.setState({ playing: !this.state.playing })
  }

  render() {
    return (
      <div className="component song-player">
        <div
          ref="button"
          className="button"
          onClick={this.onClick}
        >
          <div className="circle outer" />
          <div className="circle middle" />
          <div className="circle inner">
            <img ref="pauseIcon" className="pause-icon" src={`${config.path}assets/img/pause-icon.svg`} alt="Pause" />
            <img ref="playIcon" className="play-icon" src={`${config.path}assets/img/play-icon.svg`} alt="Play" />
          </div>
        </div>

        <div className="play-bar">
          <div className="info">
            <span className="trackname">TOO DRUNK TO FUCK</span>
            <span className="trackname">Dead kennedys</span>
          </div>
          <div ref="progress" className="progress" />
        </div>

        <audio ref="player">
          <source src={`${config.path + this.props.source}`} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    )
  }
}
