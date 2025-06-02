import { Html, Head, Main, NextScript } from "next/document";
import { ToastContainer } from "react-fox-toast";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="antialiased">
        <ToastContainer position="top-center" />

        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
