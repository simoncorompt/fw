import React from 'react'
import { router } from 'base'
import './styles.styl'

import videoPlayerSignal from 'actions/video-player-signal'
import navSignal from 'actions/nav-signal'
import aboutSignal from 'actions/about-signal'
import menuColorSignal from 'actions/menu-color-signal'

export default class AboutMenu extends React.Component {
  constructor(props) {
    super(props)
    this.prevRoute = 'home'

    this.state = {
      open: false,
      hidden: false,
      theme: 'light'
    }
  }

  componentDidMount() {
    navSignal.add(this.toggle)
    videoPlayerSignal.add(this.onPlayerToggle)
    menuColorSignal.add(this.changeColor)
    router.once('change', this.checkState)
    this.createTimeline()
  }

  componentDidUpdate() {
    this.toggleLabel()
    this.togglePage()

    this.state.hidden ? this.hide() : this.show()
  }

  componentWillUnmout() {
    navSignal.remove(this.toggle)
    menuColorSignal.remove(this.changeColor)
    videoPlayerSignal.remove(this.onPlayerToggle)
  }

  createTimeline() {
    this.tl = new TimelineMax({ paused: true })
      .fromTo(this.refs.content, .8, {
        y: '0%'
      }, {
        y: '-100%',
        ease: Expo.easeInOut
      }, 0)
  }

  checkState = () => {
    this.setState({ coldStart: true, open: router.route == 'about' })
  }

  onClick = () => {
    if (Scroller.scrollToActive) return
    this.prevRoute = router.route == 'about' ? this.prevRoute : router.route

    if (this.state.open) Scroller.play()
    else Scroller.pause()

    this.setState({ coldStart: false, open: !this.state.open })
  }

  onPlayerToggle = (key, action) => {
    TweenMax.to(this.refs.component, .8, {
      opacity: action === 'open' ? 0 : 1,
      ease: Power3.easeInOut
    })
  }

  changeColor = (color) => {
    if (color == 'dark')
      this.setState({theme: 'dark'})
    else
      this.setState({theme: 'light'})

  }

  mouseEnter = () => {
    // if (!this.state.open) this.tl.play()
    // else this.tl.reverse()
  }

  mouseLeave = () => {
    // if (!this.state.open) this.tl.reverse()
    // else this.tl.play()
  }

  toggleLabel = () => {
    if (this.state.open) this.tl.play()
    else this.tl.reverse()
  }

  togglePage() {

    if (this.state.coldStart) return

    if (this.state.open) {
      aboutSignal.dispatch(router.route, 'open')
      router.goto(router.getRoute('about'))
    } else {
      aboutSignal.dispatch(router.route, 'close')
      router.goto(router.getRoute(this.prevRoute))
    }

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

  render() {
    return (
        <div ref="component" className={`component about-menu ${this.state.theme}`}>
          <span className="project-number">00</span>
          <a
            className="about-link"
            onClick={this.onClick}
            onMouseEnter={this.mouseEnter}
            onMouseLeave={this.mouseLeave}
          >
            <div ref="content" className="about-link-content">
              <span className="about">About</span>
              <span className="close">Close</span>
            </div>
          </a>
        </div>
    )
  }
}
