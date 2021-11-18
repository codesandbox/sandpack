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

const Home: NextPage = () => {
  const { global } = content;

  return (
    <Container>
      <Head>
        <title>{global.title}</title>
        <meta content={global.description} name="description" />
        <link href="/favicon.ico" rel="icon" />
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

export default Home;
