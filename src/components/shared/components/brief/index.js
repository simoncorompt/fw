import React from 'react'
import { Scroller } from 'base/scroller'
import './styles.styl'

//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

export default class Brief extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.defineTimeline()
  }

  defineTimeline() {
    // this.props.tl
    //   .fromTo(this.refs.title, 1, {
    //     y: 0
    //   }, {
    //     y: -30
    //   }, 0)
  }

  render() {
    return (
      <div ref="brief" className="component brief">
        <h3 ref="title" className="title">BRIEF <sup>01</sup></h3>
        <p
          ref="content"
          className="content"
          dangerouslySetInnerHTML={{__html: this.props.children}}
        />
      </div>
    )
  }
}

const BriefWithScroll = withScroll(Brief)

export { BriefWithScroll }
