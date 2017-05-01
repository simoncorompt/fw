import React from 'react'
import { router } from 'base'
import { Scroller } from 'base/scroller'
import config from 'config'
import './styles.styl'

import videoPlayerSignal from 'actions/video-player-signal'
import aboutSignal from 'actions/about-signal'

//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

//---------------------------------------------------- ( Components )
import Header from 'components/shared/project/project-content/header'
import Footer from 'components/shared/components/footer'

class ProjectContent extends React.Component {
  constructor(props) {
    super(props)
    this.key = router.route
  }

  componentDidMount() {
    this.onResize()
    //aboutSignal.add(this.onAboutToggle)
    videoPlayerSignal.add(this.onPlayerToggle)
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
  //  aboutSignal.remove(this.onAboutToggle)
    videoPlayerSignal.remove(this.onPlayerToggle)
    window.removeEventListener('resize', this.onResize)
  }

  sync() {
    this.spaceHeight = 4 * window.innerHeight
  }

  onAboutToggle = (key, action) => {
    if (action === 'open')
      TweenMax.to(this.refs.content, 1, {x: '100%', delay: 0, ease: Expo.easeInOut})
    else {
      TweenMax.set(this.refs.content, {x: '0%'})
    }
  }

  onPlayerToggle = (key, action) => {

    if (key !== this.key) return

    if (action === 'open')
      TweenMax.to(this.refs.content, 1, {x: '100%', ease: Power3.easeInOut})
    else {
      TweenMax.to(this.refs.content, 1.1, {x: '0%', ease: Power3.easeInOut})
    }
  }

  onResize = () => {

    _.delay(() => {
      TweenMax.set(this.refs.spacer, {
        paddingTop: 5 * window.innerHeight,
        paddingBottom: 4 * window.innerHeight
      })

      if (Scroller.el)
        Scroller.onResize()

    }, 100)

  }

  raf(y) {
    const offset = Scroller.height - this.spaceHeight
    const inverseY = Math.max(0, -y - offset)

    TweenMax.set(this.refs.spacer, {y: inverseY})
  }

  render() {
    return (
      <div ref="wrapper" className="component project-content row">
        <div ref="content" className="col-sm-10 col-sm-offset-2 col-md-8 col-md-offset-4 scrolling-content">
          <div ref="spacer" className="spacer">
            <Header index={this.props.projectIndex} theme={this.props.theme} {...this.props.header} />

            <div className="project-content-wrapper">
              {this.props.children}
            </div>
            <Footer
              player={this.props.blocks.footer.player}
              team={this.props.blocks.footer.team}
              theme={this.props.theme}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default withScroll(ProjectContent)
