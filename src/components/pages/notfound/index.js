import React from 'react'
import _ from '_'
import {Localize, Link, i18n, i18nComponent, Asset, assets} from 'base'
import values from 'values'
import config from 'config'
import './styles.styl'

@i18nComponent
export default class Notfound extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

    console.log(values)
  }

  componentDidUpdate() {
  }

  animateIn(current, next) {

  }

  animateOut(current, next, callback) {
    return Promise.resolve()
  }


  render() {

    return (
        <div className="component not-found">
        </div>
    )
  }
}
