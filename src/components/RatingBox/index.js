import G from 'glamorous/preact';
import { Text } from 'boostly-ui';
import { Component } from 'preact';
import { colors, media } from '../../settings';


class RatingBox extends Component {
	render() {
		const { style = {} } = this.props;
		const combinedStyle = {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			width: 80,
			height: 80,
			backgroundColor: colors.lightBase,
			color: colors.textOnLight,
			borderColor: colors.darkBase,
			borderStyle: 'solid',
			borderWidth: 1,
			[media.phone]: {
				width: 60,
				height: 60
			},
			...style
		};
		const Box = G.div(combinedStyle);
		return (
			<Box>
				<Text>{this.props.children}</Text>
			</Box>
		);
	}
}
export default RatingBox;
