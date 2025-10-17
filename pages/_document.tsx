import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

// This custom Document component is needed for both App Router and Pages Router support
// This specific format makes it more likely to be properly recognized during build
class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;