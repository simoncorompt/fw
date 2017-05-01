import React from 'react'
import { Scroller } from 'base/scroller'
import './styles.styl'

import autobind from 'autobind'


import withScroll from 'components/hocs/withScroll'

class RevealLayer extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.defineTimeline()
  }

  reset(perc) {
    this.props.tl.progress(perc)
  }

  sync() {
    this.layerHeight = 2 * window.innerHeight
  }

  defineTimeline() {
    this.props.tl.fromTo(this.refs.layer, 1, {
      x: "0%"
    }, {
      x: "100%",
      ease: Linear.easeNone
    }, .2)
  }

  raf(y) {
    const perc = Scroller.getPerc(0, this.layerHeight)
    this.props.tl.progress(perc)
  }

  render() {

    const style = {
      backgroundColor: this.props.theme.primary
    }

    return (
      <div ref="wrapper" className="component reveal-layer">
        <div ref="layer" className="layer" style={style} />
      </div>
    )
  }
}

export default withScroll(RevealLayer)
