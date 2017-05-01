import React from 'react'
import _ from '_'
import config from 'config'
import './styles.styl'

export default class Line extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const clearStyle = { backgroundColor: this.props.clear }
    const darkStyle = { backgroundColor: this.props.dark }

    return (
      <div className={`component line column col-xs-3 col-md-3`}>
        {this.props.border == 'right' ? (
          <div className="right-lines">
            <div className="line dark" style={darkStyle} />
            <div className="line clear" style={clearStyle} />
          </div>
        ) : null}
      </div>
    )
  }
}
