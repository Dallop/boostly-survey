import G from 'glamorous/preact';
import { Text } from 'boostly-ui';
import { colors, media } from '../../settings';

const RatingBox = props => {
	const { style = {} } = props;
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
        ':hover': {
            backgroundColor: colors.darkBase
        },
		...style
	};
	const Box = G.div(combinedStyle);
	return (
		<Box onClick={props.onClick}>
			<Text>{props.children}</Text>
		</Box>
	);

};

export default RatingBox;
