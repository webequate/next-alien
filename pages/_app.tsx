import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import Layout from "@/components/Layout";
import UseScrollToTop from "../hooks/useScrollToTop";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import { GoogleTagManager, GoogleAnalytics } from "@next/third-parties/google";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
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
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} />
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID as string} />
    </>
  );
}

export default MyApp;
