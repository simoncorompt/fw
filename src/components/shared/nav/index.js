import React from 'react'
import _ from '_'
import { i18n, router } from 'base'
import { Scroller } from 'base/scroller'
import { Cache } from 'base/cache'
import Queue from 'base/queue'
import './styles.styl'

import videoBackgroundSignal from 'actions/video-background-signal'
import navSignal from 'actions/nav-signal'

export default class Nav extends React.Component {
  constructor(props) {
    super(props)
    this.active = true
    this.projects = i18n.localize('projects', null, 'main', null)

    this.state = {
      open: false,
      index: 0
    }

  }

  componentDidMount() {
    navSignal.add(this.toggle)
    this.createTimelines()

    this.queue = new Queue()
  }

  componentDidUpdate(prevProps, prevState) {

    if (prevState.open != this.state.open)
      this.state.open ? this.animateIn() : this.animateOut()
  }

  componentWillUnmount() {
    navSignal.remove(this.toggle)
  }

  createTimelines() {

    this.tlClose = new TimelineMax({ paused: true })
      .fromTo(this.refs.closeLineLeft, .6, {
        x: '0%'
      }, {
        x: '100%',
        ease: Expo.easeIn
      }, 0)
      .set(this.refs.closeLineLeft, {x: '-100%'}, .6)
      .to(this.refs.closeLineLeft, .6, {
        x: '0%',
        ease: Expo.easeOut
      }, .6)
      .fromTo(this.refs.closeLineRight, .8, {
        x: '0%'
      }, {
        x: '100%',
        ease: Expo.easeIn
      }, 0)
      .set(this.refs.closeLineRight, {x: '-100%'}, .8)
      .to(this.refs.closeLineRight, .8, {
        x: '0%',
        ease: Expo.easeOut
      }, .8)

    this.tlIn = new TimelineMax({ paused: true })
      .add(() => {
        this.tlClose.reversed(false)
        this.tlClose.progress(1)
      }, 0)
      .add(() => this.tlClose.reverse(0), 1)
      .fromTo(this.refs.layer, .8, {
        x: '-100%'
      }, {
        x: '0%',
        ease: Expo.easeIn
      }, 0)
      .fromTo([
        this.refs.linkWrapper,
        this.refs.close
      ], .8, {
        opacity: 0
      }, {
        opacity: 1,
        ease: Expo.easeInOut
      }, 1)
      .to(this.refs.layer, .8, {
        x: '100%',
        ease: Expo.easeOut
      }, 1)
      .set(this.refs.linkWrapper, {
        pointerEvents: 'auto'
      }, 1.8)
      .set(this.refs.component, {
        background: 'rgba(0, 0, 0, .2)'
      }, .8)

    this.tlOut = new TimelineMax({ paused: true })
      .fromTo(this.refs.layer, .8, {
        x: '-100%'
      }, {
        x: '0%',
        ease: Expo.easeIn
      })
      .set([
        this.refs.linkWrapper,
        this.refs.close
      ], {
        opacity: 0
      }, .9)
      .to(this.refs.layer, .8, {
        x: '100%',
        ease: Expo.easeOut
      }, 1)
      .set(this.refs.linkWrapper, {
        pointerEvents: 'none'
      }, 0)
      .set(this.refs.component, {
        background: 'transparent'
      }, .8)
      .set(this.refs.component, {display: 'none'})
  }

  animateIn() {
    this.setState({ index: Scroller.projectData.current })
    this.animating = false
    Scroller.pause()
    TweenMax.set(this.refs.component, {display: 'block'})
    this.tlIn.play(0)
  }

  animateOut() {
    this.animating = true
    Scroller.play()
    this.tlOut.play(0)
  }

  close = () => {
    if (this.animating) return
    navSignal.dispatch()
    const video = Cache.get(router.route)
    videoBackgroundSignal.dispatch(video)
  }

  toggle = () => {
    this.setState({ open: !this.state.open })
  }

  onMouseLeave = (e) => {
    const targetIndex = e.currentTarget.getAttribute('data-i')

    TweenMax.to(this.refs[`link-line-${targetIndex}`], .3, {
      width: 0,
      ease: Expo.easeInOut
    })
  }

  onMouseEnter = (e) => {
    if (this.animating) return
    const targetIndex = e.currentTarget.getAttribute('data-i')
    const video = Cache.get(this.projects[targetIndex].route)
    videoBackgroundSignal.dispatch(video)

    TweenMax.to(this.refs[`link-line-${targetIndex}`], .3, {
      width: 32,
      ease: Expo.easeInOut
    })
  }

  onClick = (e) => {

    e.preventDefault()

    const targetIndex = e.currentTarget.getAttribute('data-i')
    const project = this.projects[targetIndex].route

    if (project == router.route) {
      this.close()
      return
    }

    this.setState({ index: targetIndex })

    this.animateOut()
    navSignal.dispatch()

    _.delay(() => {
      Scroller.fromNav = true
      router.goto(router.getRoute(this.projects[targetIndex].route))
      Scroller.scrollTo(-4 * window.innerHeight, 0)
    }, 900)
  }

  onCloseMouseEnter = () => {
    this.tlClose.play()
  }

  onCloseMouseLeave = () => {
    this.tlClose.reverse()
  }

  raf(y) {
    const perc = Scroller.getPerc(0, window.innerHeight * 5)
  }

  render() {
    const project = i18n.localize('data', null, this.projects[this.state.index].route, null)

    const layerStyle = {
      backgroundColor: project.theme.primary
    }

    return (
      <div ref="component" className="component nav">
        <div ref="layer" className="layer" style={layerStyle} />

        <div
          ref="close"
          className="close"
          onClick={this.close}
          onMouseEnter={this.onCloseMouseEnter}
          onMouseLeave={this.onCloseMouseLeave}
        >
          <div className="line left">
            <div ref="closeLineLeft" className="border" />
          </div>
          <div className="line right">
            <div ref="closeLineRight" className="border" />
          </div>
        </div>

        <div ref="linkWrapper" className="link-wrapper">
          <ul className="link-list">
            { this.projects.map((project, i) => {
              return (
                <li
                  onMouseEnter={this.onMouseEnter}
                  onMouseLeave={this.onMouseLeave}
                  onClick={this.onClick}
                  data-i={i}
                >
                  <span ref={`link-line-${i}`} className="link-line" /><span className="number">0{i + 1}</span>{project.route}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}
