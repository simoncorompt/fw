import React from 'react'
import { Scroller } from 'base/scroller'
import autobind from 'autobind'
import './styles.styl'
import sniffer from 'sniffer'


//---------------------------------------------------- ( HOCs )
import withScroll from 'components/hocs/withScroll'

class Header extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.onResize()
    this.defineTimeline()
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize)
  }

  reset(perc) {
    this.props.tl.progress(perc)
    if (perc === 1) TweenMax.set(this.refs.col, {y: 8 * window.innerHeight})
  }

  sync() {
    this.textHeight = 4 * window.innerHeight
    this.spaceHeight = 4 * window.innerHeight
  }

  defineTimeline() {
    this.props.tl
      .fromTo(this.refs.mask, 1, {
        x: '100%'
      }, {
        x: '0%',
        ease: Power3.easeInOut
      }, 0)
      .fromTo(this.refs.wrapper, 1, {
          x: '-100%'
        }, {
          x: '0%',
          ease: Power3.easeInOut
      }, 0)
  }

  onResize = () => {

    _.delay(() => {
      TweenMax.set(this.refs.component, {
        height: 4 * window.innerHeight
      })

      TweenMax.set([this.refs.wrapper, this.refs.whiteWrapper], {
        height: window.innerHeight
      })

      if (this.textPerc >= 1) TweenMax.set(this.refs.col, {y: 8 * window.innerHeight})
      else TweenMax.set(this.refs.col, {y: 0})

      if (Scroller.el)
        Scroller.onResize()

    }, 100)

  }

  raf(y) {
    this.perc = Scroller.getPerc(this.spaceHeight, this.textHeight)
    this.textPerc = Scroller.getPerc(0, this.textHeight + this.spaceHeight)
    this.props.tl.progress(this.perc)

    if (this.textPerc < 1)
      TweenMax.set(this.refs.col, {y: -y})

  }

  render() {

    const style = {
      color: this.props.theme.primary
    }

    return (
      <div ref="component" className="component header row">
        <div ref="col" className="col col-xs-12 col-sm-12">
          <div ref="whiteWrapper" className="wrapper">
            <span className="project-name">
              <span className="project-number">0{this.props.index + 1}</span> {this.props.brand}
            </span>
            <h2 className="title" dangerouslySetInnerHTML={{__html: this.props.title}} />
          </div>
          <div ref="mask" className="mask">
            <div ref="wrapper" className="wrapper">
              <span className="project-name" style={style}>
                <span className="project-number" style={style}>0{this.props.index + 1}</span> {this.props.brand}
              </span>
              <h2 className="title" style={style} dangerouslySetInnerHTML={{__html: this.props.title}} />
            </div>

          </div>

        </div>

      </div>
    )
  }
}

export default withScroll(Header)
