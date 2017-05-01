import React from 'react'
import { router } from 'base'
import autobind from 'autobind'
import './styles.styl'

import videoPlayerSignal from 'actions/video-player-signal'

import Line from './line'

export default class GridLines extends React.Component {
  constructor(props) {
    super(props)
    this.key = router.route
  }

  componentDidMount() {
    videoPlayerSignal.add(this.onPlayerToggle)
  }

  componentWillUnmount() {
    videoPlayerSignal.remove(this.onPlayerToggle)
  }

  @autobind
  onPlayerToggle(key, action) {

    if (key !== this.key) return

    if (action === 'open')
      TweenMax.to(this.refs.component, .6, {opacity: 0})
    else
      TweenMax.to(this.refs.component, .6, {opacity: 1})
  }

  render() {
    return (
      <div ref="component" className="component grid-lines row">
          <Line border={'right'} {...this.props} />
          <Line border={'right'} {...this.props} />
          <Line border={'right'} {...this.props} />
          <Line border={'none'} {...this.props} />
      </div>
    )
  }
}
