
import ReactGA from "react-ga4";

export const initGA = () => {
  // Înlocuiește acest ID cu ID-ul tău real de Google Analytics
  ReactGA.initialize("G-XXXXXXXXXX");
};

export const logPageView = (path: string) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
