import React from 'react'
import { router, i18n } from 'base'
import { getDisplayName } from './utils/utils'
import { Scroller } from 'base/scroller'

export default function asProjectPage(WrappedComponent) {
  return class AsProjectPage extends React.Component {
    constructor(props) {
      super(props)
      this.displayName = `AsProjectPage(${getDisplayName(WrappedComponent)})`
      this.projects = i18n.localize('projects', null, 'main', null)
      this.key = router.route == 'home' ? 'ferdinand-berthoud' : router.route
      this.data = i18n.localize('data', null, this.key, null)
      this.index = this.projects.map(project => project.route).indexOf(this.data.key)
      this.active = true
    }

    componentDidMount() {
      Scroller.registerComponent(this, this.key)
    }

    componentWillUnmount() {
      Scroller.unregisterComponent(this, this.key)
    }

    animateIn(current, next) {
      const project = this.refs.wrappedComponent.refs.project
      project.updateScroller && project.updateScroller(current, next)
      this.refs.wrappedComponent.animateIn && this.refs.wrappedComponent.animateIn(current, next)
    }

    animateOut(current, next, callback) {
      return new Promise(resolve => {
        if ( this.refs.wrappedComponent.animateOut )
          this.refs.wrappedComponent
            .animateOut(current, next, callback)
            .then(resolve)
        else
          resolve()
      })
    }


    render() {
      return (
        <div ref="component" className={`component page-component wrapped-component ${this.props.className || ''}`}>
          <WrappedComponent
            ref="wrappedComponent"
            index={this.index}
            projects={this.projects}
            data={this.data}
            {...this.props}
          />
        </div>
      )
    }
  }
}
