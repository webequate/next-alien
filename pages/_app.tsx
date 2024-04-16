import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import Script from "next/script";
import UseScrollToTop from "../hooks/useScrollToTop";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Tag Manager - add your GTM ID here */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtm.js?id=${process.env.GTM_ID}`}
      />
      {/* Optional: Noscript fallback for GTM */}
      <noscript>
        <iframe
          src={`https://www.googletagmanager.com/ns.html?id=${process.env.GTM_ID}`}
          height="0"
          width="0"
          style={{ display: "none", visibility: "hidden" }}
        ></iframe>
      </noscript>

      {/* Your existing application layout */}
      <ThemeProvider attribute="class" defaultTheme="dark">
        <AnimatePresence>
          <div className="mx-auto max-w-7xl sm:px-8 lg:px-16">
            <Layout>
              <Component {...pageProps} />
            </Layout>
            <UseScrollToTop />
          </div>
        </AnimatePresence>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
