import { Component } from 'preact';
import RatingBox from '../../components/RatingBox';
import G, { A } from 'glamorous/preact';
import { media, colors } from '../../settings';
import { Textarea, Button, Text } from 'boostly-ui';
import Query from 'query-string';
import React from 'create-react-class';
import { route } from 'preact-router';
import Media from 'react-media';

const renderBoxes = (screenWidth, onClick) => {
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
                                    <RatingBox
                                        onClick={() => onClick(i)}
                                    >
                                        {i + 1}
                                    </RatingBox>
                                ))}
                        </Row>
                        <Row>
                            {Array(5)
                                .fill()
                                .map((_, i) => i + 5)
                                .map(i => (
                                    <RatingBox
                                        onClick={() => onClick(i)}
                                    >
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
                                <RatingBox
                                    onClick={() => onClick(i)}
                                >
                                    {i + 1}
                                </RatingBox>
                            ))}
                    </Row>
                )}
        </Media>
    );
};

class Home extends Component {
    handleBoxClick(queryParams) {
        return boxIndex => {
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
        const queryParams = Query.parse(window.location.search);
        const onClick = this.handleBoxClick(queryParams);
        const SmallContainer = G(Container)({ maxWidth: 400 });
        if (this.state.reviewMetadata) {
            return (
                <SmallContainer>
                    <Button
                        onClick={() => {
                            window.location.href = this.state.reviewMetadata.url;
                        }}>
                        Review us on Google
                    </Button>
                </SmallContainer>
            );
        } else if (this.state.showFeedback) {
            const FeedbackContainer = G(Container)({
                height: 256,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
            });
            return (
                <FeedbackContainer>
                    <Text>We'd love to have your feedback</Text>
                    <Textarea height={128} />
                    <Button>Submit</Button>
                </FeedbackContainer>
            );
        }
        return (
            <Container>
                <Text>How would you rate us?</Text>
                {renderBoxes(window.screen.width, onClick)}
            </Container>
        );
    }
}

export default Home;
