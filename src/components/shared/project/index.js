import React from 'react'
import { router, i18n } from 'base'
import { Scroller } from 'base/scroller'
import './styles.styl'

import withScroll from 'components/hocs/withScroll'
import changeRouteSignal from 'actions/change-route-signal'

// --------------------------> Components

import BackgroundVideoCover from 'components/shared/project/background-video-cover'
import VideoPlayerFullscreen from 'components/shared/project/video-player-fullscreen'
import SideLayer from 'components/shared/project/side-layer'
import GridLines from 'components/shared/project/grid-lines'
import ProjectContent from 'components/shared/project/project-content'
import ScrollIndicator from 'components/shared/project/scroll-indicator'

import navSignal from 'actions/nav-signal'
import aboutSignal from 'actions/about-signal'
import videoPlayerSignal from 'actions/video-player-signal'

export default class Project extends React.Component {
  constructor(props) {
    super(props)
    this.key = router.route
    this.index = this.props.projectIndex
    this.projects = this.props.projectsList
    this.active = true
    this.state = {
      hidden: false
    }
  }

  componentDidMount() {
    this.content = this.refs.projectContent.refs.wrappedComponent.refs.content
    Scroller.registerComponent(this, this.key)
    navSignal.add(this.toggle)
    videoPlayerSignal.add(this.toggleContent)
  }

  componentDidUpdate(prevProps, prevState) {
    this.state.hidden ? this.hide() : this.show()
  }

  componentWillUnmount() {
    videoPlayerSignal.remove(this.toggleContent)

    Scroller.unregisterComponent(this, this.key)
    navSignal.remove(this.toggle)
  }

  onAboutToggle = (key, action) => {
    if (action === 'open') {
      TweenMax.to(this.refs.component, 2, {x: '100%', delay: 0, ease: Expo.easeInOut})
    } else {
      TweenMax.to(this.refs.component, 2, {x: '0%', delay: 0, ease: Expo.easeInOut})
    }
  }

  updateScroller(prev, current) {

    // if (prev === 'about') {
    //
    //   Scroller
    //     .set({
    //       offset: 'start',
    //       key: this.key,
    //       el: this.content,
    //       magnetize: true,
    //       noReset: false,
    //       projectData: {
    //         previous: -1,
    //         current: this.index,
    //         next: this.nextIndex
    //       }
    //     })
    //
    //
    // } else {
    //
    // }

    let offset = (
      prev == current
      || this.getIndexByName(prev) == this.previousIndex
    ) ? 'start' : 'end'


    if (prev == 'home' && current == 'chanel') offset = 'start'
    else if (prev == 'home' && current == 'r9') offset = 'end'

    Scroller
      .set({
        offset: prev === 'about' ? 'start' : offset,
        key: this.key,
        el: this.content,
        magnetize: current !== 'about',
        projectData: {
          previous: prev === 'about' ? -1 : this.previousIndex,
          current: this.index,
          next: this.nextIndex
        }
      })

    if (prev === 'about') {
      const y = -3 * window.innerHeight
      Scroller.scrollTo(y, 0)
    }
  }

  getIndexByName(name) {
    return this.projects.map(project => project.route).indexOf(name)
  }

  get nextIndex() {
    return this.index < this.projects.length - 1 ? this.index + 1 : 0
  }

  get previousIndex() {
    return this.index > 0 ? this.index - 1 : this.projects.length - 1
  }

  get nextProject() {
    return this.projects[this.nextIndex]
  }

  goTo = (direction) => {
    const index = direction === 'next' ? this.nextIndex : this.previousIndex
    const route = this.projects[index].route
    const url = router.getRoute(route)
    if (route == router.route) return
    changeRouteSignal.dispatch(url)
    router.goto(url)
  }

  hide() {
    TweenMax.set([
      this.refs.videoPlayer,
      this.refs.scrollIndicator,
      this.refs.container
    ], {display: 'none', delay: .8})
  }

  show() {
    TweenMax.set([
      this.refs.videoPlayer,
      this.refs.scrollIndicator,
      this.refs.container
    ], {display: 'block', delay: .8})
  }

  toggle = () => {
    this.setState({ hidden: !this.state.hidden })
  }

  toggleContent = (key, action, sources) => {
    TweenMax.set(this.refs.container, {pointerEvents: action == 'open' ? 'none' : 'auto'})
  }

  raf = (y) => {

    if (Scroller.canRoute && Scroller.direction == 1 && Scroller.currentY <= -Scroller.height + 1)
      this.goTo('next')

    if (Scroller.canRoute && Scroller.direction == -1 && -Scroller.currentY <= 1)
      this.goTo('prev')

    TweenMax.set(this.content, {y: y})
  }

  render() {
    return (
        <div ref="component" className={`component project-structure ${this.props.className || ''}`}>
          <BackgroundVideoCover theme={this.props.theme} {...this.props.backgroundVideoCover} />
          <VideoPlayerFullscreen ref="videoPlayer" theme={this.props.theme} />
          <ScrollIndicator
            ref="scrollIndicator"
            nextProject={this.nextProject}
            transitionDone={this.goTo}
          />
          <div ref="container" className="container-fluid">
            <SideLayer />
            <GridLines {...this.props.grid} />
            <ProjectContent ref="projectContent" {...this.props}>
              {this.props.children}
            </ProjectContent>
          </div>
        </div>
    )
  }
}
