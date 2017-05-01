import React from 'react'
import { Scroller } from 'base/scroller'
import './styles.styl'

import SongPlayer from 'components/shared/components/song-player'

export default class AudioPlayer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div
        ref="audioPlayer"
        className="component audio-player"
      >
        <div className="wrapper">
          <div className="row">
            <div className="col-md-5">
              <h3 className="title">THE TEAM<sup>03</sup></h3>
              <ul className="team">
                {this.props.team.map((p, i) => {
                  return <li>{p.title} : <b>{p.name}</b></li>
                })}
              </ul>
            </div>
            <div className="col-md-7">
              <h3 className="title">TITLE OF THE SONG<sup>04</sup></h3>
              <SongPlayer {...this.props.player} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}
