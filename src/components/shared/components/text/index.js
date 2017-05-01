import React from 'react'
import { Scroller } from 'base/scroller'
import './styles.styl'

//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

export default class Text extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    return (
      <div ref="text" className="component text">
        <p
          ref="content"
          className="content"
          dangerouslySetInnerHTML={{__html: this.props.children}}
        />
      </div>
    )
  }
}

const TextWithScroll = withScroll(Text)

export { TextWithScroll }
