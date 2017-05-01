import React from 'react'
import { Scroller } from 'base/scroller'
import './styles.styl'

//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

//---------------------------------------------------- ( Components )
import Lazyload from 'components/shared/components/lazyload'

export default class Image extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.defineTimelines()
  }

  defineTimelines() {
    if (this.props.mask) {
      this.props.tl
        .fromTo(this.refs.lazyload.refs.img, 1, {
          scale: 1.2,
          y: "0%"
        }, {
          y: "-20%"
        }, 0)
    }
  }

  didAppear() {
    if (!this.props.noPreload)
      this.refs.lazyload.didAppear()
  }

  render() {
    const ratio = this.props.img.height / this.props.img.width * 100
    const padding = {
      paddingBottom: `${ratio}%`,
      backgroundColor: this.props.noPreload ? 'transparent' : '#eeeeee'
    }

    return (
      <div ref="component" className={`component image ${this.props.img.type || ''}`}>
        <div className="img-wrapper" style={padding}>
          {
            this.props.noPreload ? (
              <img className="img no-preload" src={config.path + this.props.img.source} />
            ) : <Lazyload ref="lazyload" {...this.props} type="img" />
          }
        </div>
      </div>
    )
  }
}

const ImageWithScroll = withScroll(Image)

export { ImageWithScroll }
