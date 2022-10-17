
import ReactGA from 'react-ga4';
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
ReactGA.send({ hitType: "pageview", page: `${window.location.pathname}` });