import login from './login.js';
import logout from './logout.js';
import callApi from './callApi.js';

const state = {
	endpoint: '/employees',
	accessToken: undefined
};

document.querySelector('#login').addEventListener('submit', (e) => {
	login(e, state);
});

document.getElementById('logout').addEventListener('click', (e) => {
	logout(e, state);
});

document.getElementById('api').addEventListener('click', (e) => {
	callApi(state);
});


