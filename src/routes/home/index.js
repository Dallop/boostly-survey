import { Component } from 'preact';
import RatingBox from '../../components/RatingBox';
import G from 'glamorous/preact';
import { Textarea, Button, Text } from 'boostly-ui';
import Query from 'query-string';
import Media from 'react-media';

const postFeedback = (orderId, reviewScore, feedbackText) => {
    console.log(orderId, reviewScore, feedbackText)
}

const renderBoxes = onClick => {
    const Col = G.div({
        display: 'flex',
        flexDirection: 'column',
    });
    const Row = G.div({
        display: 'flex',
        flexDirection: 'row',
        margin: '40px 0px',
        [media.phone]: {
            margin: '20px 0px',
        },
    });
    return (
        <Media query="(max-width: 800px)">
            {matches =>
                matches ? (
                    <Col>
                        <Row>
                            {Array(5)
                                .fill()
                                .map((_, i) => (
                                    <RatingBox onClick={() => onClick(i)}>
                                        {i + 1}
                                    </RatingBox>
                                ))}
                        </Row>
                        <Row>
                            {Array(5)
                                .fill()
                                .map((_, i) => i + 5)
                                .map(i => (
                                    <RatingBox onClick={() => onClick(i)}>
                                        {i + 1}
                                    </RatingBox>
                                ))}
                        </Row>
                    </Col>
                ) : (
                    <Row>
                        {Array(10)
                            .fill()
                            .map((_, i) => (
                                <RatingBox onClick={() => onClick(i)}>
                                    {i + 1}
                                </RatingBox>
                            ))}
                    </Row>
                )}
        </Media>
    );
};

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            feebackText: '',
        };
    }

    handleBoxClick(queryParams) {
        return boxIndex => {
            this.setState({
                reviewScore: boxIndex + 1
            })
            const isGoodReview = boxIndex + 1 >= 9;
            const hasLeftReview = queryParams.hasLeftReview || false;
            if (isGoodReview && !hasLeftReview) {
                this.handleExternalReview(queryParams);
            } else {
                this.handleInternalFeedback(queryParams);
            }
        };
    }

    handleInternalFeedback() {
        this.setState({
            showFeedback: true,
        });
    }

    handleExternalReview({ reviewType, placeId }) {
        const defaultAction = () => {
            this.setState({
                reviewMetadata: {
                    url: 'https://trace.com',
                },
            });
        };
        const actionSelector = {
            google: () => {
                const url = `https://search.google.com/local/writereview?placeid=${placeId}`;
                this.setState({
                    reviewMetadata: {
                        url,
                    },
                });
            },
        };
        const selectedAction = actionSelector[reviewType] || defaultAction;
        return selectedAction();
    }

    render() {
        const Container = G.div({
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
        });
        let queryParams = {};
        if (typeof window !== 'undefined') {
            queryParams = Query.parse(window.location.search);
        }
        const SmallContainer = G(Container)({ maxWidth: 400 });
        if (this.state.completedFeedback) {
            return (
                <Text>Thank you for your feedback!</Text>
            )
        } else if (this.state.reviewMetadata) {
            return (
                <SmallContainer>
                    <Button
                        onClick={() => {
                            if (typeof window !== 'undefined') {
                                window.location.href = this.state.reviewMetadata.url;
                            }
                        }}>
                        Review us on Google
                    </Button>
                </SmallContainer>
            );
        } else if (this.state.showFeedback) {
            const FeedbackContainer = G(Container)({
                height: '80%',
                maxHeight: 300,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                maxWidth: 600,
            });
            const onClick = () => {
                //Need to get orderId from the URL, reviewScore from the state, and feedback text from the state
                const { orderId } = typeof window !== 'undefined'
                    ?  Query.parse(window.location.search)
                    : {}
                const { reviewScore, feedbackText } = this.state
                postFeedback(orderId, reviewScore, feedbackText)
                this.setState({
                    feedbackText: '',
                    completedFeedback: true
                })
            };
            const onChange = (event) => {
                this.state.feedbackText = event.target.value
            }
            return (
                <FeedbackContainer>
                    <Text>We'd love to have your feedback</Text>
                    <Textarea
                        value={this.state.feedbackText}
                        height={128}
                        onChange={onChange}
                    />
                    <Button onClick={onClick}>Submit</Button>
                </FeedbackContainer>
            );
        }
        const onClick = this.handleBoxClick(queryParams);
        return (
            <Container>
                <Text>How would you rate us?</Text>
                {renderBoxes(onClick)}
            </Container>
        );
    }
}

export default Home;
