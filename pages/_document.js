// Use CommonJS require for Next.js Pages Router
const Document = require('next/document');
const Html = Document.Html;
const Head = Document.Head;
const Main = Document.Main;
const NextScript = Document.NextScript;

function MyDocument() {
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

// Use CommonJS exports
module.exports = MyDocument;
