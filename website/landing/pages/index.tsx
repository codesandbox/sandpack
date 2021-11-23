import type { NextPage } from "next";
import Head from "next/head";

import { AdvancedUsage } from "../components/AdvancedUsage";
import { Banner } from "../components/Banner";
import { Community } from "../components/Community";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Intro } from "../components/Intro";
// import { Showcase } from "../components/Showcase";
import { Users } from "../components/Users";
import { styled } from "../stitches.config";
import content from "../website.config.json";

const DEFAULT_HOST = "";

const Container = styled("section", {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100vh",
});

const Main = styled("main", {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  flex: 1,
});

interface HomeProps {
  host: string | undefined;
}
const Home: NextPage<HomeProps> = ({ host }) => {
  const { global, meta } = content;
  const HOST_URL = host
    ? `${host.includes("localhost") ? "http" : "https"}://${host}`
    : DEFAULT_HOST;

  return (
    <Container>
      <Head>
        <title>{global.title}</title>
        <meta content={global.description} name="description" />
        <link href="/favicon.ico" rel="icon" />

        {/* Open Graph */}
        {meta.map(({ name, value }) => {
          const content =
            {
              "og:url": HOST_URL,
              "og:image": `${HOST_URL}/${value}`,
            }[name] || value;

          return <meta key={name} content={content} name={name} />;
        })}
      </Head>

      <Main>
        <Hero />
        <Intro />
        <Features />
        <AdvancedUsage />
        {/* <Showcase />*/}
        <Users />
        <Banner />
        <Community />
      </Main>
      <Footer />
    </Container>
  );
};

Home.getInitialProps = async (context) => {
  const { req } = context;
  const host = req?.headers.host;

  return { host };
};

export default Home;
