import React from 'react'
import { i18n, router } from 'base'
import { Scroller } from 'base/scroller'
import './styles.styl'

export default class About extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  sync() {
    this.contentHeight = this.refs.contentContent.offsetHeight
    this.viewportHeight = window.innerHeight
  }

  componentWillUnmount() {

  }

  animateIn(current, next) {

  }

  animateOut(current, next, callback) {
    return Promise.resolve()
  }

  raf = (y) => {
    TweenMax.set(this.content, {y: y})
  }

  render() {
    return (
      <div ref="page" className="page about">
        ABOUsdfT
      </div>
    )
  }
}
