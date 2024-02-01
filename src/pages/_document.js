import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="shortcut icon" href="/icon.svg" />
        <title>Rahoot !</title>
      </Head>
      <body className="bg-secondary">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
