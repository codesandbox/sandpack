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

const UserLink = styled("a", {
  display: "block",
  maxWidth: "75%",
  margin: "0 auto",
  position: "relative",

  "@bp1": {
    maxWidth: "100%",
  },
});

export const Users: React.FC = () => {
  const content = config.users;

  // The icons are loaded with next/image which tends to blink
  // when first rendered. Because it doesn't support an `onLoad`
  // callback, a workaround is to wait until the list is in view
  // and then do an opacity transition.
  const { ref: listRef, inView } = useInView({
    threshold: 1,
    triggerOnce: true,
  });

  return (
    <SectionWrapper>
      <SectionContainer
        css={{
          "@bp1": {
            paddingBottom: "200px",
          },
        }}
      >
        <SectionHeader>
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
            gap: "48px",
            justifyContent: "center",
            opacity: inView ? 1 : 0,
            transition: "opacity .5s cubic-bezier(0.770, 0.000, 0.175, 1.000)",

            "@bp1": {
              gap: "100px",
            },

            "@bp2": {
              flexDirection: "row",
              flexFlow: "row wrap",
            },
          }}
        >
          {content.list.map((u) => {
            const { url, height, width } = u.logo;

            return (
              <ListItem key={u.name}>
                <UserLink
                  href={u.socialUrl}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <Image alt={u.name} height={height} src={url} width={width} />
                </UserLink>
              </ListItem>
            );
          })}
        </List>
      </SectionContainer>
    </SectionWrapper>
  );
};
