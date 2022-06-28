import "../styles/globals.css";
import NextProgress from "next-progress";
import { store } from "../redux/store";
import { Provider } from "react-redux";
import NextNProgress from "nextjs-progressbar";
import { SnackbarProvider } from "notistack";

function MyApp({ Component, pageProps }) {
  return (
    <>
      {" "}
      <NextNProgress color="#ff930f" height={3} />
      <SnackbarProvider maxSnack={3} >
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </SnackbarProvider>
    </>
  );
}

export default MyApp;
