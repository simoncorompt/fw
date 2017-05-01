import React from 'react'
import _ from '_'
import { router } from 'base'
import { Scroller } from 'base/scroller'
import sniffer from 'sniffer'
import './styles.styl'

//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

import Lazyload from 'components/shared/components/lazyload'

export default class VideoLoop extends React.Component {
  constructor(props) {
    super(props)
    this.key = router.route
  }

  componentDidMount() {
    Scroller.addListener('beforeSet', this.onRouteChange)
  }

  componentWillUnmount() {
    Scroller.removeListener('beforeSet', this.onRouteChange)
  }

  didAppear() {
    this.refs.lazyload.didAppear && this.refs.lazyload.didAppear()
  }

  onRouteChange = (nextKey) => {
    if (sniffer.isDevice) return

    if (this.key != nextKey)
      this.refs.lazyload.refs.video.pause()
    else
      this.refs.lazyload.refs.video.play()
  }

  renderLoop() {
    if (sniffer.isDevice) {
      return <Lazyload ref="lazyload" type="cover" {...this.props} cover={this.props.sources.gif} />
    } else {
      return <Lazyload ref="lazyload" {...this.props} type="video" />
    }
  }

  render() {
    return (
      <div className={`component video-loop ${this.props.className || ''} ${this.props.overflow ? 'overflow' : ''} ${this.props.sideOverflow ? 'side-overflow' : ''}`}>
        <div className="video-wrapper">
          { this.renderLoop() }
        </div>
      </div>
    )
  }
}

const VideoLoopWithScroll = withScroll(VideoLoop)

export { VideoLoopWithScroll }
