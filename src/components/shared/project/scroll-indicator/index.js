import React from 'react'
import { i18n } from 'base'
import { Scroller } from 'base/scroller'
import autobind from 'autobind'
import sniffer from 'sniffer'
import './styles.styl'

import withScroll from 'components/hocs/withScroll'
import navSignal from 'actions/nav-signal'

class ScrollIndicator extends React.Component {
  constructor(props) {
    super(props)
    this.nextProjectData = i18n.localize('data', null, this.props.nextProject.route, null)

    this.state = {
      hidden: false
    }
  }

  componentDidMount() {
    navSignal.add(this.toggle)
    this.defineTimeline()
  }

  componentDidUpdate() {
    this.state.hidden ? this.hide() : this.show()
  }

  componentWillUnmount() {
    navSignal.remove(this.toggle)
  }

  reset(perc) {
    this.tl.progress(perc)
  }

  sync() {
    this.maskHeight = 4 * window.innerHeight
    this.indicatorHeight = Scroller.height - this.maskHeight * 2

    this.mobileOffset = 3 * window.innerHeight
    this.mobileHeight = window.innerHeight
  }

  defineTimeline() {
    this.tl = new TimelineMax({paused: true})
      .fromTo(this.refs.scrollBar, 1, {
        height: "0%"
      }, {
        height: "100%",
        ease: Power1.easeInOut
      }, 0)

    this.mobileTl = new TimelineMax({paused: true})
      .fromTo(this.refs.mobileBar, 1, {
        width: "0%"
      }, {
        width: "100%",
        ease: Power1.easeInOut
      }, 0)
  }

  hide() {
    TweenMax.set(this.refs.wrapper, {display: 'none', delay: .8})
  }

  show() {
    TweenMax.set(this.refs.wrapper, {display: 'flex', delay: .8})
  }

  toggle = () => {
    this.setState({ hidden: !this.state.hidden })
  }

  raf(y) {
    if (this.transitioning) return

    const perc = Scroller.getPerc(this.maskHeight, this.indicatorHeight)
    this.tl.progress(perc)

    if (!sniffer.isDevice) return

    const mobilePerc = Scroller.getPerc(this.mobileOffset, this.mobileHeight)
    this.mobileTl.progress(mobilePerc)
  }

  render() {

    const style = {
      backgroundColor: this.nextProjectData.theme.primary
    }

    return (
      <div ref="wrapper" className="component scroll-indicator">
        <div
          ref="scrollBar"
          className="scroll-bar"
          style={style}
        />
        <div ref="mobileBar" className="mobile-bar" />
      </div>
    )
  }
}

export default withScroll(ScrollIndicator)
