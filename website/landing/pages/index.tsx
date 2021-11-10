import type { NextPage } from "next";
import Head from "next/head";
import { Sandpack } from "@codesandbox/sandpack-react";

import { Api } from "../components/Api";
import { Banner } from "../components/Banner";
import { Community } from "../components/Community";
import { Features } from "../components/Features";
import { Footer } from "../components/Footer";
import { Hero } from "../components/Hero";
import { Intro } from "../components/Intro";
import { Showcase } from "../components/Showcase";
import { Users } from "../components/Users";
import { content } from "../content/global";
import { styled } from "../stitches.config";

const Container = styled("section", {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  minHeight: "100vh",
});

const Main = styled("main", {
  flex: 1,
});

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title>{content.pageTitle}</title>
        <meta content={content.pageDescription} name="description" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <Sandpack />

      {/* <Main>
        <Hero />
        <Intro />
        <Features />
        <Api />
        <Showcase />
        <Users />
        <Banner />
        <Community />
      </Main>
      <Footer /> */}
    </Container>
  );
};

export default Home;
