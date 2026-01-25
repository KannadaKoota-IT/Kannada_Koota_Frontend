import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>Kannada Koota</title>
        <meta name="description" content="Kannada Koota - Cultural Club Website" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/png" href="/fav-icon.png"/>
        <link rel="manifest" href="/manifest.json" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Kannada:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Baloo+Tamma+2:wght@600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libertinus+Math&display=swap"
          rel="stylesheet"
        />
        <meta name="google-site-verification" content="your-verification-code" />
        <meta name="theme-color" content="#fbbf24" />
        <meta name="msapplication-TileColor" content="#000000" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
