export default (e, state) => {
	e.preventDefault();
	const data = new FormData(e.target);

	fetch(e.target.action, {
		method: e.target.getAttribute('method'),
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(Object.fromEntries(data))
	})
	.then((response) => response.json())
	.then((json) => {
		console.log(json);
		state.accessToken = json.accessToken;
		alert('This page now has access and refresh tokens! You can now access the API endpoint from this page even after reloading the page without need to login again.')
		e.target.reset();
	}).catch(function(error) {
		console.error(` Error: ${error}`);
	});
}
