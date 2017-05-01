import React from 'react'
import { Scroller } from 'base/scroller'
import autobind from 'autobind'
import './styles.styl'

import { ImageWithScroll } from 'components/shared/components/image'


//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

import Lazyload from 'components/shared/components/lazyload'

//---------------------------------------------------- ( Compinents )
import Controls from './controls'

export default class Slider extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentSlide: 0,
      mobile: false
    }

    this.sliding = false

  }

  componentDidMount() {
    this.defineTimelines()
    window.addEventListener('resize', this.onResize)
    this.onResize()
    Scroller.addListener('beforeSet', this.onRouteChange)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.mobile) this.sliding = false
    this.didAppear()
    this.transitionBetweenSlides(prevState.currentSlide, this.state.currentSlide)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
    Scroller.removeListener('beforeSet', this.onRouteChange)
  }

  defineTimelines() {

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
    const slidesPromises = this.props.slides.map((slide, id) => {
      if (id != 0) {
        const lazyImg = this.refs[`lazyload-slide-${id}`]
        if (!lazyImg.hasLoaded) lazyImg.didAppear()
      }
    })

    Promise.all(slidesPromises).then(() => this.refs[`lazyload-slide-${0}`].didAppear())

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
    return (
      <div className={`component slider ${this.state.mobile ? 'mobile' : ''}`}>
        <div className="slider-wrapper">
          <div className="slides-wrapper">
            {this.props.slides.map((slide, id) => {

              return (
                <div
                  ref={`slide-${id}`}
                  className={`slide ${this.state.currentSlide == id ? 'current' : ''}`}
                >
                  <div className="mask">
                    <Lazyload ref={`lazyload-slide-${id}`} type="cover" {...this.props} cover={this.props.slides[id]} />
                  </div>
                </div>
              )
            })}
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

const SliderWithScroll = withScroll(Slider)

export { SliderWithScroll }
