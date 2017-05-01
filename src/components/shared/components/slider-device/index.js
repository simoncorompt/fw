import React from 'react'
import { Scroller } from 'base/scroller'
import autobind from 'autobind'
import './styles.styl'

//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

import Lazyload from 'components/shared/components/lazyload'

//---------------------------------------------------- ( Components )
import Controls from 'components/shared/components/slider/controls'
import { ImageWithScroll } from 'components/shared/components/image'


export default class SliderDevice extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentSlide: 0
    }

    this.sliding = false

  }

  componentDidMount() {
    this.defineTimeline()
    Scroller.addListener('beforeSet', this.onRouteChange)
    this.onResize()
    window.addEventListener('resize', this.onResize)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.mobile) this.sliding = false
    this.didAppear()
    this.transitionBetweenSlides(prevState.currentSlide, this.state.currentSlide)  }

  componentWillUnmount() {
    Scroller.removeListener('beforeSet', this.onRouteChange)
    window.removeEventListener('resize', this.onResize)

  }

  defineTimeline() {
    this.prevTl = new TimelineMax({paused: true})
      .fromTo(this.refs.controls.refs.prevTop, .8, {
        x: '0%'
      }, {
        x: '-100%',
        ease: Expo.easeIn
      }, 0)
      .fromTo(this.refs.controls.refs.prevBottom, .8, {
        x: '0%'
      }, {
        x: '-100%',
        ease: Expo.easeIn
      }, 0)
      .set(this.refs.controls.refs.prevTop, {x: '100%'}, .8)
      .set(this.refs.controls.refs.prevBottom, {x: '100%'}, .8)
      .to(this.refs.controls.refs.prevTop, .8, {
        x: '0%',
        ease: Expo.easeOut
      }, .8)
      .to(this.refs.controls.refs.prevBottom, .8, {
        x: '0%',
        ease: Expo.easeOut
      }, .8)

    this.nextTl = new TimelineMax({paused: true})
      .fromTo(this.refs.controls.refs.nextTop, .8, {
        x: '0%'
      }, {
        x: '100%',
        ease: Expo.easeIn
      }, 0)
      .fromTo(this.refs.controls.refs.nextBottom, .8, {
        x: '0%'
      }, {
        x: '100%',
        ease: Expo.easeIn
      }, 0)
      .set(this.refs.controls.refs.nextTop, {x: '-100%'}, .8)
      .set(this.refs.controls.refs.nextBottom, {x: '-100%'}, .8)
      .to(this.refs.controls.refs.nextTop, .8, {
        x: '0%',
        ease: Expo.easeOut
      }, .8)
      .to(this.refs.controls.refs.nextBottom, .8, {
        x: '0%',
        ease: Expo.easeOut
      }, .8)

    this.loadTl = new TimelineMax({ paused: true })
      .fromTo(this.refs.layer, 10, {
        x: '-101%',
        z: 2
      }, {
        x: '-10%',
        ease: Expo.easeInOut
      }, 0)


    this.loadedTl = new TimelineMax({ paused: true })
      .fromTo(this.refs.device, 1.2, {
        z: 1,
        y: '40%',
        opacity: 0
      }, {
        y: '0%',
        opacity: 1,
        ease: Power3.easeOut
      }, 1.3)
      .fromTo(this.refs.imgWrapper, 1.2, {
        y: '40%',
        opacity: 0
      }, {
        y: '0%',
        opacity: 1,
        ease: Power3.easeOut
      }, 1.5)
      .to(this.refs.layer, 1, {
        x: '0%',
        ease: Expo.easeIn
      }, 0)
      .to(this.refs.layer, 1, {
        x: '101%',
        ease: Expo.easeOut
      }, 1)
  }

  get nextIndex() {
    return this.state.currentSlide < this.props.slides.length - 1 ? this.state.currentSlide + 1 : 0
  }

  get previousIndex() {
    return this.state.currentSlide > 0 ? this.state.currentSlide - 1 : this.props.slides.length - 1
  }

  transitionBetweenSlides(current, next) {
    this.sliding = true

    const currentSlide = this.refs[`slide-${current}`]
    const nextSlide = this.refs[`slide-${next}`]

    TweenMax.fromTo(currentSlide, 1, {
      x: '0%',
      visibility: 'visible'
    }, {
      x: this.state.direction == 'next' ? '-100%' : '100%',
      ease: Power3.easeInOut,
      onComplete: () => {
        TweenMax.set(currentSlide, {visibility: 'hidden'})
        this.sliding = false
      }

    })

    TweenMax.fromTo(nextSlide, 1, {
      x: this.state.direction == 'next' ? '100%' : '-100%',
      visibility: 'visible'
    }, {
      x: '0%',
      ease: Power3.easeInOut
    })
  }

  nextSlide = () => {
    if (this.sliding) return

    this.setState({
      currentSlide: this.nextIndex,
      direction: 'next'
    })
  }

  previousSlide = () => {
    if (this.sliding) return

    this.setState({
      currentSlide: this.previousIndex,
      direction: 'previous'
    })
  }

  onRouteChange = () => {
    this.sliding = false
  }

  didAppear() {
    if (this.state.mobile) return

    this.loadTl.play()

    const slidesPromises = this.props.slides.map((slide, id) => {
      return new Promise((resolve, reject) => {
        const img = this.refs[`lazyload-slide-${id}`]
        img.onload = resolve
        img.onerror = reject
        img.src = config.path + slide
      })
    })

    Promise.all(slidesPromises).then(() => {

      this.loadedTl.play()
    })

  }

  enterPrev = () => {
    this.prevTl.play()
  }

  leavePrev = () => {
    this.prevTl.reverse()
  }

  enterNext = () => {
    this.nextTl.play()
  }

  leaveNext = () => {
    this.nextTl.reverse()
  }

  onResize = () => {
    this.sliding = false

    if (window.innerWidth <= 768 && !this.state.mobile)
      this.setState({mobile: true})
    else if (window.innerWidth > 768 && this.state.mobile)
      this.setState({mobile: false})

  }


  render() {

    const layerStyle = {
      backgroundColor: this.props.theme.primary
    }

    return (
      <div className={`component slider-device ${this.state.mobile ? 'mobile' : ''}`}>
        <div className="slider-wrapper">

          <div className="slides-wrapper">

            <div className="device-wrapper">
              <div ref="device" className="ipad-device" />
            </div>

            <div ref="imgWrapper" className="img-wrapper">
              {this.props.slides.map((slide, id) => {
                return (
                  <div
                    ref={`slide-${id}`}
                    className={`slide ${this.state.currentSlide == id ? 'current' : ''}`}
                  >
                    <div className="mask">
                      <img ref={`lazyload-slide-${id}`} className="page" />
                    </div>
                  </div>
                )
              })}
            </div>

            <div ref="layer" className="layer" style={layerStyle} />

          </div>

          <Controls
            ref="controls"
            next={this.nextSlide}
            previous={this.previousSlide}
            enterPrev={this.enterPrev}
            leavePrev={this.leavePrev}
            enterNext={this.enterNext}
            leaveNext={this.leaveNext}
            color={this.props.theme.primary}
          />
        </div>

        <ImageWithScroll
          className="cover"
          theme={this.props.theme}
          img={this.props.cover}
          raf
          autoPause
        />
      </div>
    )
  }
}

const SliderDeviceWithScroll = withScroll(SliderDevice)

export { SliderDeviceWithScroll }
