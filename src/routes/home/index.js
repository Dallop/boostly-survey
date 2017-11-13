import { Component } from 'preact';
import RatingBox from '../../components/RatingBox';
import G from 'glamorous/preact';
import { media } from '../../settings';

const renderBoxes = screenWidth => {
	const Col = G.div({
		display: 'flex',
		flexDirection: 'column'
	});
	const Row = G.div({
		display: 'flex',
		margin: '40px 0px',
		[media.phone]: {
			margin: '20px 0px'
		}
	});
	const biggerThanPhone = screenWidth >= 400;
	if (biggerThanPhone) {
		return Array(10)
			.fill()
			.map((_, i) => <RatingBox>{i + 1}</RatingBox>);
	}
	return (
		<Col>
			<Row>
				{Array(5)
					.fill()
					.map((_, i) => <RatingBox>{i + 1}</RatingBox>)}
			</Row>
			<Row>
				{Array(5)
					.fill()
					.map((_, i) => <RatingBox>{i + 6}</RatingBox>)}
			</Row>
		</Col>
	);

};

const Container = G.div({
	width: '100%',
	display: 'flex',
	justifyContent: 'center'
});

class Home extends Component {
	render() {
		return (
			<Container>
				{renderBoxes(window.screen.width)}
			</Container>
		);
	}
}

export default Home;
