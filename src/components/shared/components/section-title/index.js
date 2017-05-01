import React from 'react'
import { Scroller } from 'base/scroller'
import './styles.styl'

//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

export default class SectionTitle extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <h4 className="component section-title">
        {this.props.children}
      </h4>
    )
  }
}

const SectionTitleWithScroll = withScroll(SectionTitle)

export { SectionTitleWithScroll }
