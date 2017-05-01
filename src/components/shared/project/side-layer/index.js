import React from 'react'
import { router } from 'base'
import { Scroller } from 'base/scroller'
import autobind from 'autobind'
import './styles.styl'

import withScroll from 'components/hocs/withScroll'

import videoPlayerSignal from 'actions/video-player-signal'
import aboutSignal from 'actions/about-signal'

class SideLayer extends React.Component {
  constructor(props) {
    super(props)
    this.key = router.route
  }

  componentDidMount() {
  //  aboutSignal.add(this.onAboutToggle)
    videoPlayerSignal.add(this.onPlayerToggle)
    this.defineTimeline()
  }

  componentWillUnmount() {
  //  aboutSignal.remove(this.onAboutToggle)
    videoPlayerSignal.remove(this.onPlayerToggle)
  }

  reset(perc) {
    if (Scroller.projectData.previous == -1) {
      perc = 0
    }
    this.tl.progress(perc)
  }

  sync() {
    this.layerHeight = 4 * window.innerHeight
    this.spaceHeight = 4 * window.innerHeight
  }

  defineTimeline() {
    this.tl = new TimelineMax({ paused: true })
    this.tl.fromTo(this.refs.layer, 1, {
      x: "100%"
    }, {
      x: "0%",
      ease: Power3.easeInOut
    })
  }

  onAboutToggle = (key, action) => {
    if (action === 'open')
      TweenMax.to(this.refs.layer, 1, {x: '100%', delay: 0, ease: Expo.easeInOut})
    else {
      TweenMax.set(this.refs.layer, {x: '0%'})
    }
  }

  @autobind
  onPlayerToggle(key, action) {
    if (key !== this.key && key !== 'about') return

    if (action === 'open')
      TweenMax.to(this.refs.layer, 1.1, {x: '100%', ease: Power3.easeInOut})
    else {
      if (key == 'about') return
      TweenMax.to(this.refs.layer, 1, {x: '0%', ease: Power3.easeInOut})
    }
  }

  raf(y) {
    const perc = Scroller.getPerc(this.spaceHeight, this.layerHeight)
    this.tl.progress(perc)
  }

  render() {
    return (
      <div className="component side-layer row">
        <div className="col-sm-10 col-sm-offset-2 col-md-8 col-md-offset-4">
          <div ref="layer" className="layer" />
        </div>
      </div>
    )
  }
}

export default withScroll(SideLayer)
