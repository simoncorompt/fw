import React from 'react'
import { Scroller } from 'base/scroller'
import './styles.styl'

export default class Footer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        ref="footer"
        className="component footer"
      >
        <div className="wrapper">
          <div className="row">
            <div className="col-md-12">
              <h3 className="title">TEAM<sup>03</sup></h3>
              <ul className="team">
                {this.props.team.map((p, i) => {
                  return <li className="col-md-4">{p.title} : <b>{p.name}</b></li>
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
