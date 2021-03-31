import React from 'react';
import './Playlist.css';
import TrackList from '../TrackList/TrackList';

class Playlist extends React.Component {
	constructor(props) {
		super(props);
		this.handleChangeName = this.handleChangeName.bind(this);
	}

	handleChangeName(e) {
		this.props.onChangeName(e.target.value);
	}

	render() {
		return (
			<div className='Playlist'>
				<input defaultValue={this.props.playlistName} onChange={this.handleChangeName} />
				<TrackList
					tracks={this.props.playlistTracks}
					onRemove={this.props.onRemove}
					isRemoval={true}
				/>
				<button className='Playlist-save' onClick={this.props.onSave}>
					SAVE TO SPOTIFY
				</button>
			</div>
		);
	}
}

export default Playlist;
