// Force CommonJS format for Next.js compatibility
const NextDocument = require('next/document');
const Html = NextDocument.Html;
const Head = NextDocument.Head;
const Main = NextDocument.Main;
const NextScript = NextDocument.NextScript;

function Document() {
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

module.exports = Document;
