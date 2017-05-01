import React from 'react'
import _ from '_'
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'base'
import LazyLoad from 'lazyload'
import config from 'config'
import './styles.styl'

@i18nComponent
export default class Lazyload extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

    var lazyLoad = new LazyLoad({elements: document.querySelectorAll('.lazyLoad')});

  }

  componentDidUpdate() {
  }

  animateIn(current, next) {
    console.log("Animate In", current, next)
  }

  animateOut(current, next, callback) {
    console.log("Animate In", current, next)
  }

  render() {

    return (
        <div className="component lazyload">

          <button className="dispose">Dispose</button>
          <button className="reset">Reset</button>
          <section className="wrapper">

            <div className="lazyLoad" data-src={`${window.location.href}/assets/img/test.jpg`}></div>

            <div className="lazyLoad" data-src="https://player.vimeo.com/video/130924869" data-type="iframe"></div>

            <div className="lazyLoad" data-src={`${window.location.href}/assets/img/test.jpg`}>

            </div>

            <div className="lazyLoad" data-src={`${window.location.href}/assets/img/loading.gif`}>

            </div>


          </section>
        </div>
    )
  }
}
