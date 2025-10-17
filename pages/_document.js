// Use CommonJS require for Next.js Pages Router
const Document = require('next/document');
const Html = Document.Html;
const Head = Document.Head;
const Main = Document.Main;
const NextScript = Document.NextScript;

// Create Document component as a class for CommonJS compatibility
class MyDocument extends Document {
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

// Use CommonJS exports
module.exports = MyDocument;
