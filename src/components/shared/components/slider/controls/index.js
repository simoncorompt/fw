import React from 'react'
import './styles.styl'

export default class Controls extends React.Component {
  constructor(props) {
    super(props)
  }

  next = () => {
    this.props.next()
  }

  prev = () => {
    this.props.previous()
  }

  render() {
    return (
      <div className="component controls">
        <div
          className="button prev"
          style={{background: this.props.color}}
          onClick={this.prev}
          onMouseEnter={this.props.enterPrev}
          onMouseLeave={this.props.leavePrev}
        >
          <div className="arrow left">
            <div className="line-mask top">
              <div ref="prevTop" className="line top" />
            </div>
            <div className="line-mask bottom">
              <div ref="prevBottom" className="line bottom" />
            </div>
          </div>
        </div>
        <div
          className="button next"
          style={{background: this.props.color}}
          onClick={this.next}
          onMouseEnter={this.props.enterNext}
          onMouseLeave={this.props.leaveNext}
        >
          <div className="arrow right">
            <div className="line-mask top">
              <div ref="nextTop" className="line top" />
            </div>
            <div className="line-mask bottom">
              <div ref="nextBottom" className="line bottom" />
            </div>
          </div>
        </div>
      </div>
    )
  }

}
