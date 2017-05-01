import React from 'react'
import { router } from 'base'
import { getDisplayName } from './utils/utils'
import { Scroller } from 'base/scroller'

export default function withScroll(WrappedComponent) {
  return class WithScroll extends React.Component {
    constructor(props) {
      super(props)
      this.autoPause = props.autoPause ? true : false
      this.active = true
      this.displayName = `WithScroll(${getDisplayName(WrappedComponent)})`
      this.tl = new TimelineMax({ paused: true })
      this.parallaxTl = new TimelineMax({ paused: true })
      this.key = router.route || 'default'
      if (props.raf) this.key == 'default'
      this.didAppear = false
    }

    componentDidMount() {
      Scroller.registerComponent(this, this.key)
      this.setAnimations()
    }

    componentWillUnmount() {
      Scroller.unregisterComponent(this, this.key)
    }

    reset(perc) {
      this.refs.wrappedComponent.reset && this.refs.wrappedComponent.reset(perc)
      this.tl.progress(perc)
      this.parallaxTl.progress(perc)
    }

    sync() {
      this.refs.wrappedComponent.sync && this.refs.wrappedComponent.sync()
      this.height = this.refs.component.offsetHeight + window.innerHeight
      this.offset = Scroller.getOffset(this.refs.component) - window.innerHeight
    }

    setAnimations() {
      if (this.props.parallax)
        this.defineParallaxAnimation()
    }

    defineParallaxAnimation() {
      this.parallaxTl.fromTo(this.refs.component, 1, {
        y: this.props.parallax[0] || this.props.parallax
      }, {
        y: this.props.parallax[1] || -this.props.parallax
      }, 0)
    }

    raf(y) {
      // Call decorated component raf method in case we want
      // to do specific animations inside
      this.refs.wrappedComponent.raf && this.refs.wrappedComponent.raf(y)

      if (!this.props.parallax && !this.props.mask && !this.props.overflow && !this.props.raf) return
      const perc = Scroller.getPerc(this.offset, this.height, true)

      const percV = Scroller.getViewportPerc(this.offset)
      this.tl.progress( perc )
      this.parallaxTl.progress( percV )

      if (perc >= -.2 && !this.didAppear) {
        this.didAppear = true
        this.refs.wrappedComponent.didAppear && this.refs.wrappedComponent.didAppear()
      }

    }

    render() {
      return (
        <div ref="component" className={`component with-scroll wrapped-component ${this.props.className || ''}`}>
          <WrappedComponent
            ref="wrappedComponent"
            projectKey={this.key}
            tl={this.tl}
            {...this.props}
          />
        </div>
      )
    }
  }
}
