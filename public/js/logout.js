export default (e, state) => {
	state.accessToken = undefined;

	/* no-cache directive is necessary otherwise cookie may not be deleted if
	request returns a 304 status as it happens with Vercel server */
	fetch('/logout', {
		method: 'GET',
		headers: {
			'Cache-Control': 'no-cache'
		}
	})
	.then(response => response.json())
	.then(json => console.log(json));
}
