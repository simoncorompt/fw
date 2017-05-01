import React from 'react'
import { router } from 'base'
import { Scroller } from 'base/scroller'
import './styles.styl'


import videoPlayerSignal from 'actions/video-player-signal'
import navSignal from 'actions/nav-signal'
import aboutSignal from 'actions/about-signal'

export default class Logo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      hidden: false
    }
  }

  componentDidMount() {
    this.defineTimeline()
    aboutSignal.add(this.onPlayerToggle)
    navSignal.add(this.toggle)
    videoPlayerSignal.add(this.onPlayerToggle)
  }

  componentDidUpdate() {
    this.state.hidden ? this.hide() : this.show()
  }

  componentWillUnmount() {
    aboutSignal.remove(this.onPlayerToggle)
    navSignal.remove(this.toggle)
    videoPlayerSignal.remove(this.onPlayerToggle)
  }

  defineTimeline() {
    this.tlIn = new TimelineMax({paused: true})

      .fromTo(this.refs.topLine, .6, {
        x: 0
      }, {
        x: 24,
        ease: Expo.easeIn
      }, 0)
      .set(this.refs.topLine, {x: -24}, .6)
      .to(this.refs.topLine, .6, {
        x: 0,
        ease: Expo.easeOut
      }, .6)


      .fromTo(this.refs.midLine, .5, {
        x: 0
      }, {
        x: 24,
        ease: Expo.easeIn
      }, 0)
      .set(this.refs.midLine, {x: -24}, .5)
      .to(this.refs.midLine, .5, {
        x: 0,
        ease: Expo.easeOut
      }, .5)

      .fromTo(this.refs.bottomLine, .4, {
        x: 0
      }, {
        x: 24,
        ease: Expo.easeIn
      }, 0)
      .set(this.refs.bottomLine, {x: -24}, .4)
      .to(this.refs.bottomLine, .4, {
        x: 0,
        ease: Expo.easeOut
      }, .4)

  }

  onBurgerClick = () => {
    navSignal.dispatch()
  }

  hide() {
    TweenMax.set(this.refs.component, {display: 'none', delay: .8})
  }

  show() {
    TweenMax.set(this.refs.component, {display: 'flex', delay: .8})
  }

  toggle = () => {
    this.setState({ hidden: !this.state.hidden })
  }

  onPlayerToggle = (key, action) => {
    TweenMax.to(this.refs.component, .8, {
      pointerEvents: action === 'open' ? 'none' : 'auto',
      opacity: action === 'open' ? 0 : 1,
      ease: Power3.easeInOut
    })
  }

  onMouseEnter = () => {
    this.tlIn.play()
  }

  onMouseLeave = () => {
    this.tlIn.reverse()
  }

  onLogoClick = () => {
    Scroller.scrollTo(-4 * window.innerHeight, .5, true)
  }

  render() {
    return (
      <div ref="component" className="component logo">
        <div className="button" onClick={this.onBurgerClick}>
          <div
            className="burger"
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
          >
            <div ref="topLine" className="top line" />
            <div ref="midLine" className="middle line" />
            <div ref="bottomLine" className="bottom line" />
          </div>
        </div>
        <div className="logo-wrapper" onClick={this.onLogoClick}>
          <img className="logo" src={`${config.path}assets/img/thehidden.svg`} />
        </div>
      </div>
    )
  }
}
