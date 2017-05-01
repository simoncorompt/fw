import React from 'react'
import _ from '_'
import { i18n, router } from 'base'
import { Scroller } from 'base/scroller'
import { Cache } from 'base/cache'
import './styles.styl'
import sniffer from 'sniffer'


import loaderCompleteSignal from 'actions/loader-complete'

export default class Loader extends React.Component {
  constructor(props) {
    super(props)
    this.active = true
    this.projects = i18n.localize('projects', null, 'main', null)
    this.state = {
      notFound: false
    }
  }

  componentDidMount() {
    Scroller.pause()
    TweenMax.to(this.refs.logo, 2, {opacity: 1, ease: Power3.easeInOut})
    TweenMax.to(this.refs.loader, 1.4, {x: '0%', ease: Expo.easeInOut})
    this.createTimeline()
    this.refs.video.addEventListener('loadeddata', this.onVideoLoaded)
  }

  componentWillUnmount() {
    this.refs.video.removeEventListener('loadeddata', this.onVideoLoaded)
  }

  createTimeline() {
    this.tl = new TimelineMax({ paused: true })
      .fromTo(this.refs.video, 1.8, {
        x: '-50%',
        y: '-50%',
        autoAlpha: 0
      }, {
        autoAlpha: 1,
        ease: Power3.easeInOut
      })

    this.tlScrollIndicator = new TimelineMax({ paused: true, repeat: -1})
      .fromTo(this.refs.line, .6, {
        width: 0,
        opacity: 1
      }, {
        width: 36,
        ease: Power3.easeOut
      })
      .fromTo(this.refs.layer, .5, {
        x: '-101%'
      }, {
        x: '0%',
        ease: Power3.easeIn
      }, .4)
      .set(this.refs.text, {opacity: 1}, .9)
      .to(this.refs.layer, .5, {
        x: '101%',
        ease: Power3.easeOut
      }, .9)
      .to(this.refs.line, .6, {
        opacity: 0,
        ease: Power3.easeOut
      }, 6)
      .to(this.refs.text, .6, {
        opacity: 0,
        ease: Power3.easeOut
      }, 6)

    this.tlLoaderDone = new TimelineMax({ paused: true })
      .fromTo(this.refs.lineQuote, 1, {
        x: '-100%'
      }, {
        x: '0%',
        ease: Power3.easeIn
      }, 0)
      .to(this.refs.lineQuote, 1, {
        x: '100%',
        ease: Power3.easeOut
      }, 1)
      .fromTo(this.refs.wrapperQuote, 1, {
        x: '100%'
      }, {
        x: '0%',
        ease: Power3.easeNone
      }, 0)
      .fromTo(this.refs.transitionLayer, 1, {
        x: '-100%'
      }, {
        x: '0%',
        ease: Power3.easeNone
      }, 0)
      .to(this.refs.transitionLayer, 1, {
        x: '100%',
        ease: Power3.easeNone
      }, 1)
      .to(this.refs.wrapperQuote, 1, {
        x: '-100%',
        ease: Power3.easeNone
      }, 1)
      .set(this.refs.loader, {display: 'none'}, 1)
      .set(this.refs.scrollIndicator, {display: 'none'}, 1)
      .set(this.refs.wrapper, {display: 'none'}, 1)
      .set(this.refs.component, {display: 'none'}, 2)
      .add(() => {
        Scroller.canRoute = true
        Scroller.loading = false
        Scroller.unregisterComponent(this, this.key)
        if (router.route != 'about')
          Scroller.disableEasingOnEnds = true
        Scroller.onResize()
      })
  }

  load() {
    return new Promise((resolve, reject) => {
      this.loadLoop().then(() => {
        if (router.route == '*') {
          this.setState({
            notFound: true
          })
        } else {
          this.preloadCovers().then(() => {
            this.key = router.route
            Scroller.registerComponent(this, router.route)
            Scroller.play()
            if (router.route != 'about')
              this.tlScrollIndicator.play()
          })
        }

      })
    })
  }

  loadLoop() {
    return new Promise((resolve, reject) => {
      this.videoLoadedResolve = resolve

      if (sniffer.isDevice) {
        this.refs.video.onload = () => {
          this.tl.eventCallback('onComplete', this.videoLoadedResolve)
          this.tl.play()
        }
        this.refs.video.src = `${config.path}assets/img/loader_loop.gif`
      } else {
        this.refs.video.load()
      }

    })
  }

  preloadCovers() {
    return new Promise((resolve, reject) => {

      let loadedItems = 0

      const promises = this.projects.map((project, i) => {
        const data = i18n.localize('data', null, project.route, null)

        const index = i

        if (sniffer.isDevice) {

          const cover = data.backgroundVideoCover.sources.gif

          const img = document.createElement('img')
          img.onload = () => {
            loadedItems++
            const perc = loadedItems / this.projects.length * 100
            Cache.save(project.route, img)

            TweenMax.to(this.refs.bar, 1.6, {
              height: `${perc}%`,
              ease: Expo.easeInOut,
              onComplete: () => {
                if (perc === 100) {
                  loaderCompleteSignal.dispatch()
                  if (router.route == 'about') {
                    Scroller.disableEasingOnEnds = false
                    this.tlLoaderDone.timeScale(1.5)
                    this.tlLoaderDone.play()
                  }
                  resolve()
                }
              }
            })
          }

          img.onerror = () => {
            console.log('error');
          }

          img.src = config.path + cover

        } else {
          const cover = data.backgroundVideoCover.sources.mp4

          const req = new XMLHttpRequest()

          req.open('GET', config.path + cover, true)
          req.responseType = 'blob'

          req.onload = (res) => {
             if (req.status === 200) {

                loadedItems++
                const perc = loadedItems / this.projects.length * 100
                const videoBlob = req.response
                const vid = URL.createObjectURL(videoBlob)

                Cache.save(project.route, vid)

                TweenMax.to(this.refs.bar, 1.6, {
                  height: `${perc}%`,
                  ease: Expo.easeInOut,
                  onComplete: () => {
                    if (perc === 100) {
                      loaderCompleteSignal.dispatch()
                      if (router.route == 'about') {
                        Scroller.disableEasingOnEnds = false
                        this.tlLoaderDone.timeScale(1.5)
                        this.tlLoaderDone.play()
                      }
                      resolve()
                    }
                  }
                })

             } else {
               console.log(req, 'error');
             }
          }

          req.onerror = reject
          req.send()
        }
      })
    })
  }

  onVideoLoaded = () => {
    this.tl.eventCallback('onComplete', this.videoLoadedResolve)
    this.tl.play()
    this.refs.video.play()
  }

  onLogoClick = () => {
    if (router.route == '*') {
      router.goto(router.getRoute('home'))
      window.location.reload()
    }
  }

  raf(y) {
    if (router.route == 'about') return
    const perc = Scroller.getPerc(0, window.innerHeight * 5)
    this.tlLoaderDone.progress(perc)
  }

  renderLoop() {
    if (sniffer.isDevice) {
      return (
        <img ref="video" className="gif-loop" />
      )
    } else {
      return (
        <video ref="video" width="100%" height="100%" loop muted>
          <source src={`${config.path}assets/img/loader_loop.mp4`} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )
    }
  }

  render() {
    return (
        <div ref="component" className="component loader">
          <div ref="loader" className={`loader ${this.state.notFound ? 'hidden' : ''}`}>
            <div ref="scrollIndicator" className="scroll-indicator">
              <span ref="line" className="line" />
              <div className="text">
                <span ref="text">Scroll</span>
                <div ref="layer" className="layer" />
              </div>
            </div>
            <div ref="bar" className="bar" />
          </div>
          <div ref="transitionLayer" className="transition-layer">
            <div ref="wrapperQuote" className="wrapper-quote">
              <div className="line-wrapper">
                <span ref="lineQuote" className="line" />
              </div>
            </div>
          </div>
          <div className={`not-found-wrapper ${this.state.notFound ? 'visible' : ''}`}>
            <h4>The page you're looking for does not exist...</h4>
          </div>
          <div ref="wrapper" className="video-wrapper">
            <div className="video-pattern" />
            <img
              ref="logo"
              onClick={this.onLogoClick}
              className={`logo ${this.state.notFound ? 'not-found' : ''}`}
              src={`${config.path}assets/img/thehidden.svg`}
            />
            { this.renderLoop() }
          </div>
        </div>
    )
  }
}
