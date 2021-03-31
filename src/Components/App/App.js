import './App.css';
import React from 'react';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResults: [],
			playlistName: 'New Playlist',
			playlistTracks: [],
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
	}

	addTrack(track) {
		if (this.state.playlistTracks.find((savedTrack) => savedTrack.id === track.id)) {
			return;
		}
		const newPlaylist = this.state.playlistTracks;
		newPlaylist.push(track);

		//removing the added file from the search results
		const newSearchresults = this.state.searchResults.filter((savedTrack) => savedTrack !== track);

		this.setState({ playlistTracks: newPlaylist, searchResults: newSearchresults });
	}

	removeTrack(track) {
		const tracks = this.state.playlistTracks.filter((savedTrack) => savedTrack !== track);

		//Adding the removed file to the search results
		const newSearchresults = this.state.searchResults;
		newSearchresults.unshift(track);

		this.setState({ playlistTracks: tracks, searchResults: newSearchresults });
	}

	updatePlaylistName(name) {
		this.setState({ playlistName: name });
	}

	savePlaylist() {
		const trackURIs = this.state.playlistTracks.map((track) => track.uri);
		Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() =>
			this.setState({ playlistName: 'New Playlist', playlistTracks: [] })
		);
	}

	search(term) {
		Spotify.search(term).then((results) => {
			this.setState({ searchResults: results });
		});
	}

	render() {
		return (
			<div>
				<h1>
					Ja<span className='highlight'>mm456m</span>ing
				</h1>
				<div className='App'>
					<SearchBar onSearch={this.search} />
					<div className='App-playlist'>
						<SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
						<Playlist
							playlistName={this.state.playlistName}
							playlistTracks={this.state.playlistTracks}
							onRemove={this.removeTrack}
							onChangeName={this.updatePlaylistName}
							onSave={this.savePlaylist}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default App;
