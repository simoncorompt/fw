import React from 'react'
import { i18n, router } from 'base'
import { Scroller } from 'base/scroller'
import autobind from 'autobind'
import './styles.styl'
import 'blast-text'

import withScroll from 'components/hocs/withScroll'

export default class TransitionLayer extends React.Component {
  constructor(props) {
    super(props)
    this.projects = i18n.localize('projects', null, 'main', null)
    this.quotes = i18n.localize('quotes', null, 'main', null)

    this.state = {
      current: '',
      next: ''
    }
  }

  componentDidMount() {
    this.defineTimeline()
    Scroller.on('set', this.onPageChange)
  }

  componentWillUnmount() {
    Scroller.removeListener('set', this.onPageChange)
  }

  reset(perc) {
    this.tlEnd.progress(perc)
    this.tlStart.progress(perc)
  }

  sync() {
    this.layerHeight = 2.8 * window.innerHeight
    this.startOffset = .2 * window.innerHeight
    this.endOffset = Scroller.height - 3 * window.innerHeight
  }

  defineTimeline() {
    this.tlEnd = new TimelineMax({paused: true})
      .fromTo(this.refs.layerEnd, 1, {
        x: '-100%'
      }, {
        x: '0%',
        ease: Linear.easeNone
      }, 0)
      .fromTo(this.refs.wrapperQuoteEnd, 1, {
        x: '100%'
      }, {
        x: '0%',
        ease: Linear.easeNone
      }, 0)
      .fromTo(this.refs.lineEnd, 1, {
        x: '-100%'
      }, {
        x: '0%',
        ease: Power3.easeIn
      }, 0)
      // .to(this.refs.lineEnd, .5, {
      //   x: '100%',
      //   ease: Linear.easeNone
      // }, .5)
    this.tlStart = new TimelineMax({paused: true})
      .fromTo(this.refs.layerStart, 1, {
        x: '0%'
      }, {
        x: '100%',
        ease: Linear.easeNone
      }, 0)
      .fromTo(this.refs.wrapperQuoteStart, 1, {
        x: '0%'
      }, {
        x: '-100%',
        ease: Linear.easeNone
      }, 0)
      .fromTo(this.refs.lineStart, 1, {
        x: '0%'
      }, {
        x: '100%',
        ease: Power3.easeOut
      }, 0)
  }

  onPageChange = (params) => {

    if (Scroller.projectData.previous == -1) {
      this.tlStart.progress(1)
      this.tlEnd.progress(0)
    }

    if (router.route == 'about') return

    this.setState({
      current: i18n.localize('data', null, this.projects[params.current].route, null),
      next: i18n.localize('data', null, this.projects[params.next].route, null)
    })
  }

  raf(y) {
    const startPerc = Scroller.getPerc(this.startOffset, this.layerHeight)
    const endPerc = Scroller.getPerc(this.endOffset, this.layerHeight)
    this.tlStart.progress(startPerc)
    this.tlEnd.progress(endPerc)
  }

  render() {

    const startStyle = {
      backgroundColor: this.state.current.theme ? this.state.current.theme.primary : 'black'
    }

    const endStyle = {
      backgroundColor: this.state.next.theme ? this.state.next.theme.primary : 'black'
    }

    const quoteEnd = this.state.next.quoteIndex ? this.quotes[this.state.next.quoteIndex] : this.quotes[0]
    const quoteStart = this.state.current.quoteIndex ? this.quotes[this.state.current.quoteIndex] : this.quotes[0]

    return (
      <div ref="component" className="component transition-layer">
        <div ref="layerStart" className="layer" style={startStyle}>
          <div ref="wrapperQuoteStart" className="wrapper-quote">
            <div className="line-wrapper">
              <span ref="lineStart" className="line" />
            </div>
          </div>
        </div>
        <div ref="layerEnd" className="layer" style={endStyle}>
          <div ref="wrapperQuoteEnd" className="wrapper-quote">
            <div className="line-wrapper">
              <span ref="lineEnd" className="line" />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const TransitionLayerWithScroll = withScroll(TransitionLayer)

export { TransitionLayerWithScroll }
