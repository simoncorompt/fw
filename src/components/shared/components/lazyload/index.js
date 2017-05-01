import React from 'react'
import { Scroller } from 'base/scroller'
import './styles.styl'


export default class Lazyload extends React.Component {
  constructor(props) {
    super(props)
    this.hasLoaded = false
  }

  componentDidMount() {
    if (this.props.type == 'video')
      this.refs.video.addEventListener('loadeddata', this.onVideoLoaded)
    this.defineTimelines()
  }

  componentWillUnmount() {
    if (this.props.type == 'video')
      this.refs.video.removeEventListener('loadeddata', this.onVideoLoaded)
  }

  defineTimelines() {

    const type = this.props.type

    this.loadTl = new TimelineMax({ paused: true })
      .fromTo(this.refs.loadLayer, 10, {
        y: -2,
        x: '-101%',
        z: 1
      }, {
        x: '-10%',
        ease: Expo.easeInOut
      }, 0)

    this.loadedTl = new TimelineMax({ paused: true })
      .to(this.refs.loadLayer, !this.props.pageImage ? 1 : 1.8, {
        x: '0%',
        ease: Expo.easeIn
      }, 0)
      .fromTo(type == 'video' ? this.refs.video : this.refs.img, 1.6, {
        z: this.props.mask ? 300 : 200,
        autoAlpha: 0,
        x: type == 'video' ? '-50%' : '',
        y: type == 'video'? '-50%' : '',
      }, {
        z: this.props.mask ? 1 : 1,
        autoAlpha: 1,
        ease: Power3.easeOut
      }, !this.props.pageImage ? 1 : 1.8)
      .to(this.refs.loadLayer, !this.props.pageImage ? 1 : 1.8, {
        x: '101%',
        ease: Expo.easeOut
      }, !this.props.pageImage ? 1 : 1.8)
  }

  didAppear() {
    return new Promise(resolve => {
      this.load()
       .then(() => {
          this.hasLoaded = true
          this.loadedTl.play()
          resolve()
       })
    })
  }

  load() {
    switch (this.props.type) {
      case 'cover':
        return this.loadImg()
        break
      case 'img':
        return this.loadImg()
        break
      case 'video':
        return this.loadVideo()
        break
      default:
        return null
    }
  }

  loadImg() {
    return new Promise((resolve, reject) => {
      this.loadTl.play()

      if (this.props.type == 'img') {
        const img = this.refs.img

        img.onload = resolve
        img.onerror = reject
        img.src = config.path + this.props.img.source
      } else {
        const img = document.createElement('img')
        img.onload = resolve
        img.onerror = reject
        img.src = config.path + this.props.cover
      }

    })
  }

  loadVideo() {
    return new Promise((resolve, reject) => {
      this.videoLoadedResolve = resolve

      this.loadTl.play()
      const source = document.createElement('source')
      source.type = "video/mp4"
      source.src = config.path + this.props.sources.mp4
      this.refs.video.appendChild(source)
      // Prevent race condition
      _.delay(() => this.refs.video.load(), 500)

    })
  }

  onVideoLoaded = () => {
    this.videoLoadedResolve()
    this.loadedTl.play()
    this.refs.video.play()
  }

  renderImage() {

    const ratio = this.props.img.height / this.props.img.width * 100
    const padding = { paddingBottom: `${ratio}%` }

    return (
      <div ref="component" className="component lazyload-wrapper lazyload-img">
        <img ref="img" className="img" />
        { this.renderLoader() }
      </div>
    )
  }

  renderCover() {

    const cover = {
      background: `url(${config.path + this.props.cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center center'
    }

    return (
      <div ref="component" className="component lazyload-wrapper lazyload-cover">
        <div ref="img" className="img" style={cover} />
        { this.renderLoader() }
      </div>
    )
  }

  renderVideo() {
    return (
      <div ref="component" className="component lazyload-wrapper lazyload-video">
        <video ref="video" width="100%" height="100%" loop muted>
          Your browser does not support the video tag.
        </video>
        { this.renderLoader() }
      </div>
    )
  }

  renderLoader() {
    const loadLayer = { background: this.props.theme.primary }
    return <div ref="loadLayer" className="load-layer" style={loadLayer} />
  }

  render() {
    switch (this.props.type) {
      case 'cover':
        return this.renderCover()
        break
      case 'img':
        return this.renderImage()
        break
      case 'video':
        return this.renderVideo()
        break
      default:
        return null
    }
  }
}
