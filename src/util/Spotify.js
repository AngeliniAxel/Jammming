const clientID = '7f7fe195f74e464b9d568581d47aee05';
const redirectUri = 'http://localhost:3000/';

let accessToken;

const Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken;
		}

		//Check for access token match
		const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

		if (accessTokenMatch && expiresInMatch) {
			accessToken = accessTokenMatch[1];
			let expiresIn = Number(expiresInMatch[1]);

			//Clear the parameters, allowing us to grab a new access token when it expires
			window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			const accessUri = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
			window.location = accessUri;
		}
	},

	search(term) {
		const token = Spotify.getAccessToken();
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
			.then((response) => response.json())
			.then((jsonResponse) => {
				if (!jsonResponse.tracks) {
					return [];
				}
				return jsonResponse.tracks.items.map((track) => ({
					id: track.id,
					name: track.name,
					artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri,
				}));
			});
	},

	savePlaylist(name, trackUris) {
		if (!name || !trackUris.length) {
			console.log(name + trackUris);
			return;
		}
		const token = Spotify.getAccessToken();
		const headers = { Authorization: `Bearer ${token}` };
		let userId;

		return fetch('https://api.spotify.com/v1/me', { headers: headers })
			.then((response) => response.json())
			.then((jsonResponse) => {
				userId = jsonResponse.id;
				return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
					headers: headers,
					method: 'POST',
					body: JSON.stringify({ name: name }),
				})
					.then((response) => response.json())
					.then((jsonResponse) => {
						const playlistId = jsonResponse.id;
						return fetch(
							`https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
							{ headers: headers, method: 'POST', body: JSON.stringify({ uris: trackUris }) }
						);
					});
			});
	},
};

export default Spotify;
