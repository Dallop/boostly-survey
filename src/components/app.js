import { h, Component } from 'preact';
import { Router } from 'preact-router';
import { Div } from 'glamorous/preact';

import Home from '../routes/home';
import Profile from '../routes/profile';
import Google from '../routes/google';
// import Home from 'async!../routes/home';
// import Profile from 'async!../routes/profile';
// import Google from 'async!../routes/google';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
	handleRoute = e => {
		this.currentUrl = e.url;
	};

	render() {
		return (
			<Div
				display="flex"
				justifyContent="center"
				alignItems="center"
				id="app"
			>
				<Router onChange={this.handleRoute}>
					<Home path="/" />
					<Google path="/google_review" />
					<Profile path="/profile/" user="me" />
					<Profile path="/profile/:user" />
				</Router>
			</Div>
		);
	}
}
