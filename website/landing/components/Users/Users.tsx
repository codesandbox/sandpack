import Image from "next/image";
import { useInView } from "react-intersection-observer";

import { styled } from "../../stitches.config";
import config from "../../website.config.json";
import {
  List,
  ListItem,
  SectionContainer,
  SectionHeader,
  SectionTitle,
  SectionWrapper,
} from "../common";
import { useBreakpoint } from "../common/useBreakpoint";

const UserLink = styled("a", {
  display: "block",
  maxWidth: "75%",
  margin: "0 auto",
  position: "relative",
  opacity: 0,
  transitionProperty: "opacity",
  transitionTimingFunction: "cubic-bezier(0.770, 0.000, 0.175, 1.000)",

  "@bp1": {
    maxWidth: "100%",
  },

  variants: {
    visible: {
      true: {
        opacity: 1,
      },
      false: {
        opacity: 0,
      },
    },
  },
});

export const Users: React.FC = () => {
  const content = config.users;
  const shouldAnimate = useBreakpoint("bp2");

  // The icons are loaded with next/image which tends to blink
  // when first rendered. Because it doesn't support an `onLoad`
  // callback, a workaround is to wait until the list is in view
  // and then do an opacity transition.
  const { ref: listRef, inView } = useInView({
    threshold: [0, 1],
    triggerOnce: !shouldAnimate,
  });

  return (
    <SectionWrapper>
      <SectionContainer
        css={{
          maxWidth: "1600px",
          "@bp1": {
            paddingBottom: "200px",
          },
        }}
      >
        <SectionHeader
          css={{
            padding: "20px 0 100px",

            "@bp2": {
              padding: "200px 0 100px",
            },
          }}
        >
          <SectionTitle
            as="h4"
            dangerouslySetInnerHTML={{ __html: content.title }}
            size="small"
          />
        </SectionHeader>
        <List
          ref={listRef}
          css={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",

            margin: "0 auto",
            marginTop: "-50px",

            "@bp2": {
              flexDirection: "row",
              flexFlow: "row wrap",
              width: "75%",
            },
          }}
        >
          {content.list.map((user, userIndex) => {
            const { url, height, width } = user.logo;

            return (
              <ListItem
                key={user.name}
                css={{
                  flex: "none",
                  margin: "20px",
                  "@bp2": {
                    margin: "50px",
                  },
                }}
              >
                <UserLink
                  css={{
                    transitionDelay: inView
                      ? "0s"
                      : `calc(0.1s * ${userIndex})`,
                    transitionDuration: `calc(0.2s * ${
                      inView ? userIndex : 1
                    })`,
                  }}
                  href={user.socialUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                  visible={!shouldAnimate || inView}
                >
                  <Image
                    alt={user.name}
                    height={height}
                    src={url}
                    width={width}
                  />
                </UserLink>
              </ListItem>
            );
          })}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
