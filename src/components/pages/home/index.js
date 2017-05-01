import React from 'react'
import { i18n, router } from 'base'
import { Scroller } from 'base/scroller'
import './styles.styl'
import Title from 'components/shared/title'

export default class Home extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {

  }

  sync() {
    this.contentHeight = this.refs.contentContent.offsetHeight
    this.viewportHeight = window.innerHeight
  }

  componentWillUnmount() {

  }

  animateIn(current, next) {

  }

  animateOut(current, next, callback) {
    return Promise.resolve()
  }

  raf = (y) => {
    TweenMax.set(this.content, {y: y})
  }

  render() {
    return (
      <div ref="page" className="page home">
        <Title />
        <div className="wrapper">
          <h2 className="title">THISSS IS THE F*CKING HOMEPAGE</h2>
          <a onClick={() => router.goto('/about')}>aaa</a>
          <p>Lorem ipsum dolor sifefihddte eu. Pellentesque tempor, nisl vitae bibendum dapibus, augue risus vestibulum est, non viverra enim sem quis nisi. Sed vitae gravida tortor, sed bibendum est. Mauris a placerat diam. Maecenas in ligula libero. Nunc aliquet ante id ex bibendum commodo. Maecenas nec tempus urna.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec lectus sed est pretium consectetur vitae et arcu. Nam eget interdum metus. Integer congue eget quam ac molestie. Quisque efficitur porta metus sed fringilla. Nunc a lacus sodales, venenatis justo at, aliquet lacus. Vestibulum hendrerit varius lectus, ac imperdiet dolor auctor ac. Nulla vehicula nulla non orci viverra feugiat. Fusce interdum magna quis nisi interdum luctus. Quisque rhoncus vehicula mauris, a vestibulum esfsdfsnim vulputate eu.z Pellentesque tempor, nisl vitae bibendum dapibus, augue risus vestibulum est, non viverra enim sem quis nisi. Sed vitae gravida tortor, sed bibendum est. Mauris a placerat diam. Maecenas in ligula libero. Nunc aliquet ante id ex bibendum commodo. Maecenas nec tempus urna.</p>
          <p>Lorem ipsum doslor sit amet, consectetur adipiscing elit. Nullam nec lectus sed est pretium consectetur vitae et arcu. Nam eget interdum metus. Integer congue eget quam ac molestie. Quisque efficitur porta metus sed fringilla. Nunc a lacus sodales, venenatis justo at, aliquet lacus. Vestibulum hendrerit varius lectus, ac imperdiet dolor auctor ac. Nulla vehicula nulla non orci viverra feugiat. Fusce interdum magna quis nisi interdum luctus. Quisque rhoncus vehicula mauris, a vestibulum enim vulputate eu. Pellentesque tempor, nisl vitae bibendum dapibus, augue risus vestibulum est, non viverra enim sem quis nisi. Sed vitae gravida tortor, sed bibendum est. Mauris a placerat diam. Maecenas in ligula libero. Nunc aliquet ante id ex bibendum commodo. Maecenas nec tempus urna.</p>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec lectus sed est pretium consectetur vitae et arcu. Nam eget interdum metus. Integer congue eget quam ac molestie. Quisque efficitur porta metus sed fringilla. Nunc a lacus sodales, venenatis justo at, aliquet lacus. Vestibulum hendrerit varius lectus, ac imperdiet dolor auctor ac. Nulla vehicula nulla non orci viverra feugiat. Fusce interdum magna quis nisi interdum luctus. Quisque rhoncus vehicula mauris, a vestibulum enim vulputate eu. Pellentesque tempor, nisl vitae bibendum dapibus, augue risus vestibulum est, non viverra enim sem quis nisi. Sed vitae gravida tortor, sed bibendum est. Mauris a placerat diam. Maecenas in ligula libero. Nunc aliquet ante id ex bibendum commodo. Maecenas nec tempus urna.</p>
        </div>
      </div>
    )
  }
}
