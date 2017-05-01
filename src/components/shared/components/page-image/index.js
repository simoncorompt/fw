import React from 'react'
import { Scroller } from 'base/scroller'
import './styles.styl'

//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

import Image from 'components/shared/components/image'

export default class PageImage extends React.Component {
  constructor(props) {
    super(props)
  }

  didAppear() {
    this.refs.img.didAppear && this.refs.img.didAppear()
  }

  render() {
    return (
      <div className={`component page-image`}>
        <div className="row">
          <div className="col-xs-12 col-sm-11 content">
            <div className="align-wrapper">
              <Image
                ref="img"
                theme={this.props.theme}
                projectKey={this.props.projectKey}
                img={this.props.img}
                pageImage
              />
            </div>
            <div className="background-layer" />
          </div>
        </div>
        <div className="overflow-layer" />
      </div>
    )
  }
}

const PageImageWithScroll = withScroll(PageImage)

export { PageImageWithScroll }
