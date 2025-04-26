
import ReactGA from "react-ga4";

export const initGA = () => {
  ReactGA.initialize("G-WK6NS9JSN6");
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
