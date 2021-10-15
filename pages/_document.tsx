import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from "next/document";
import { extractStyles } from "evergreen-ui";
import { siteMetadata } from "../constants";
import demoGif from "../assets/demo.gif";

interface MyDocumentProps {
  css: string;
  hydrationScript: JSX.Element;
}

export default class MyDocument extends Document<MyDocumentProps> {
  static async getInitialProps({ renderPage }: DocumentContext) {
    const page = renderPage();
    const { css, hydrationScript } = extractStyles();

    return {
      ...page,
      css,
      hydrationScript,
    };
  }

  render() {
    const { css, hydrationScript } = this.props;

    return (
      <Html lang="fr">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={siteMetadata.url} />
          <meta property="og:image" content={demoGif.src} />
          <style dangerouslySetInnerHTML={{ __html: css }} />
        </Head>

        <body>
          <Main />
          {hydrationScript}
          <NextScript />
        </body>
      </Html>
    );
  }
}
