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
        >
          <div className="arrow left">
            <div ref="prevTop" className="line top" />
            <div ref="prevBottom" className="line bottom" />
          </div>
        </div>
        <div
          className="button next"
          style={{background: this.props.color}}
          onClick={this.next}
        >
          <div className="arrow right">
            <div ref="nextTop" className="line top" />
            <div ref="nextBottom" className="line bottom" />
          </div>
        </div>
      </div>
    )
  }

}
