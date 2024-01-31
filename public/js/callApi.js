import requestNewTokens from './requestNewTokens.js';

export default (state) => {
	const apiStatusElm = document.getElementById('api-status');

	apiStatusElm.innerHTML = '';
	console.log({state});


	if (!state.accessToken) {
		console.log('requesting new tokens...');
		requestNewTokens(state, apiStatusElm);
		return;
	}

	/* since we are adding custom headers in this request, browsers will send
	a preflight request to the server and we need to make sure the server that
	responds sets Access-Control-Allow-Headers: '*' in response otherwise preflight
	will fail and no request will be sent to endpoint. */
	// https://stackoverflow.com/questions/41253228/preflight-or-cors-error-on-every-request
	fetch(state.endpoint, {
		method: 'GET',
		//mode: "cors",
		headers: {
		'Authorization': 'Bearer ' +  state.accessToken,
		'Content-Type': 'application/json'
		}
	})
	.then((response) => response.json())
	.then((json) => {
		console.log(json);
		if (json.error) {
			apiStatusElm.innerHTML = `Error due to not having access token or using token that is expired. Fetching new tokens...`;
			// using delay so error can be seen
			window.setTimeout(() => {
				requestNewTokens(state, apiStatusElm);
			}, 1000);
		} else {
			apiStatusElm.innerHTML = `${JSON.stringify(json)}`;
		}
	}).catch(function(err) {
		console.error(` Err: ${err}`);
	});
}
