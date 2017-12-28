import { Component } from 'preact';
import RatingBox from '../../components/RatingBox';
import G from 'glamorous/preact';
import { Textarea, Button, Text } from 'boostly-ui';
import Query from 'query-string';
import Media from 'react-media';
import { media } from '../../settings';
import { reviewApi, env } from '../../config';

const postFeedback = (orderId, rating, feedbackText) => {
  const body = JSON.stringify(
    {
      orderId,
      rating,
      feedbackText,
    },
    null,
    2
  );
  const headers = new Headers({
    'Content-Type': 'application/json',
  });
  fetch(reviewApi, {
    method: 'POST',
    headers,
    body,
  })
    .then(val => {
      console.log(val);
    })
    .catch(err => {
      console.log(err);
      if (env === 'development') {
        console.log(err);
      }
    });
};

const renderBoxes = onClick => {
  const Col = G.div({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
              {Array(6)
                .fill()
                .map((_, i) => (
                  <RatingBox onClick={() => onClick(i)}>
                    {i}
                  </RatingBox>
                ))}
            </Row>
            <Row>
              {Array(5)
                .fill()
                .map((_, i) => i + 6)
                .map(i => (
                  <RatingBox onClick={() => onClick(i)}>
                    {i}
                  </RatingBox>
                ))}
            </Row>
          </Col>
        ) : (
          <Row>
            {Array(11)
              .fill()
              .map((_, i) => (
                <RatingBox onClick={() => onClick(i)}>
                  {i}
                </RatingBox>
              ))}
          </Row>
        )
      }
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
        rating: boxIndex,
      });
      const isGoodReview = boxIndex >= 9;
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

  handleExternalReview({ reviewType, placeId, pageName }) {
    const defaultAction = () => {
      this.setState({
        showFeedback: true,
      });
    };
    const actionSelector = {
      google: () => {
        const url = `https://search.google.com/local/writereview?placeid=${placeId}`;
        this.setState({
          reviewMetadata: {
            url,
            reviewType: 'Google',
          },
        });
      },
      yelp: () => {
        const url = `https://www.yelp.com/writeareview/biz/${placeId}`;
        this.setState({
          reviewMetadata: {
            url,
            reviewType: 'Yelp',
          },
        });
      },
      facebook: () => {
        const url = `https://www.facebook.com/${pageName}/reviews/`;
        this.setState({
          reviewMetadata: {
            url,
            reviewType: 'Facebook',
          },
        });
      },
    };
    const selectedAction = actionSelector[reviewType] || defaultAction;
    return selectedAction();
  }

  renderLegend() {
    const Container = G.div({
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      padding: '0px 5px',
    });
    return (
      <Container>
        <Text>Least Likely</Text>
        <Text>Most Likely</Text>
      </Container>
    );
  }

  render() {
    const Container = G.div({
      maxWidth: '880px',
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
    if (this.state.completedFeedback) {
      const CenterText = G(Text)({
        textAlign: 'center'
      })
      return (
        <CenterText>
                    Thanks for your feedback. Please explain why you gave that
                    rating.
        </CenterText>
      );
    } else if (this.state.reviewMetadata) {
      const { orderId } =
                typeof window !== 'undefined'
                  ? Query.parse(window.location.search)
                  : {};
      const { rating } = this.state;
      postFeedback(orderId, rating, '');
      if (typeof window !== 'undefined') {
        window.location.href = this.state.reviewMetadata.url;
      }
      return <div />;
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
        const { orderId } =
                    typeof window !== 'undefined'
                      ? Query.parse(window.location.search)
                      : {};
        const { rating, feedbackText } = this.state;
        postFeedback(orderId, rating, feedbackText);
        this.setState({
          feedbackText: '',
          completedFeedback: true,
        });
      };
      const onChange = event => {
        this.state.feedbackText = event.target.value;
      };
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
    const CenterText = G(Text)({
      textAlign: 'center',
    });
    return (
      <Container>
        <CenterText>
                    How likely are you to recommend us to a friend or colleague?
        </CenterText>
        {renderBoxes(onClick)}
        {this.renderLegend()}
      </Container>
    );
  }
}

export default Home;
