import ReactDOM from 'react-dom'
import React from 'react'
import {i18n, Localize, Link, router} from 'base'
import 'gsap'
import './styles.styl'
import { Scroller } from 'base/scroller'

class Page extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      content: 'div',
      params: {}
    }
  }

  componentDidMount() {
    this.el = ReactDOM.findDOMNode(this)
  }

  componentWillUnmout() {
    this.el = null
  }

  setContent(view, params, path) {
    params = params || {}

    this.setState({
      content: view,
      params: params
    })

  }

  get content() {
    return this.state.content
  }

  render() {
    return (
      <div className="page-wrapper">
        <this.state.content ref="page" {...this.state.params} />
      </div>
    )
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      content: 'div'
    }

  }

  componentDidMount() {
    this.el = ReactDOM.findDOMNode(this)
    this.currentIndex = 0
    this.pages = [
      this.refs.p0,
      this.refs.p1
    ]

  }

  componentWillUnmount() {
    this.el = null
    this.current = null
    this.next = null
  }

  get currentPage() {
    return this.pages[this.currentIndex]
  }

  get nextPage() {
    return this.pages[(this.currentIndex + 1) % this.pages.length]
  }

  getComponent(loader, params, route, el) {
    loader(this, params, route, el)
  }

  /**
   * Set content page
   * @param {React.Component} view
   * @param {Object} [params] URL Parameters
   */
  setPage(view, params, route, el) {
    this.currentRoute = this.nextRoute || route
    this.nextRoute = route

    var current = this.currentPage
    var next = this.nextPage

    //----o New content
    if (current.content != view) {

      next.setContent(view, params)

      if (this.currentRoute == this.nextRoute) {
        next.refs.page.animateIn(this.currentRoute, this.nextRoute)
      } else {
        TweenMax.set(next.el, {display: 'block'})
        current.refs.page
          .animateOut(this.currentRoute, this.nextRoute)
          .then(() => {
            TweenMax.set(current.el, {display: 'none'})
            next.refs.page.animateIn(this.currentRoute, this.nextRoute)
          })
      }

      //----o Swap
      this.currentIndex = (this.currentIndex + 1) % this.pages.length

    } else {

      if (params.module !== void 0) {
        current.refs.page.refs[el].animateIn()
      }

    }

  }

  render() {
    this.pages = []
    return (
      <div className="component app">
        <Page ref="p0"/>
        <Page ref="p1"/>
      </div>
    )
  }
}
