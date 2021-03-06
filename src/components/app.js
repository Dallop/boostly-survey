// eslint-disable-next-line
import { h, Component } from 'preact';
import { Div } from 'glamorous/preact';

import Home from '../routes/home';

export default class App extends Component {

	/** Gets fired when the route changes.
	 *	@param {Object} event		"change" event from [preact-router](http://git.io/preact-router)
	 *	@param {string} event.url	The newly routed URL
	 */
    handleRoute (e) {
		this.currentUrl = e.url;
    }

	render() {
		return (
			<Div
				display="flex"
				justifyContent="center"
				alignItems="center"
				id="app"
			>
                <Home />
			</Div>
		);
	}
}
