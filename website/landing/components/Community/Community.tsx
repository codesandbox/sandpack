import { styled } from "../../stitches.config";
import { Box, List, Text } from "../common";

const COMMUNITIES_ICONS = {
  twitter: () => (
    <svg fill="none" height="100%" viewBox="0 0 33 32" width="100%">
      <path
        d="M29.5 8.486c-.956.422-1.985.706-3.064.835a5.323 5.323 0 0 0 2.346-2.933 10.718 10.718 0 0 1-3.388 1.286A5.342 5.342 0 0 0 21.501 6c-2.946 0-5.335 2.374-5.335 5.301 0 .416.048.82.139 1.208A15.175 15.175 0 0 1 5.31 6.97a5.29 5.29 0 0 0 1.65 7.078 5.337 5.337 0 0 1-2.415-.663v.067c0 2.568 1.838 4.71 4.278 5.198a5.37 5.37 0 0 1-2.409.091 5.335 5.335 0 0 0 4.983 3.682 10.744 10.744 0 0 1-6.625 2.27c-.43 0-.855-.026-1.272-.075A15.165 15.165 0 0 0 11.677 27c9.811 0 15.177-8.078 15.177-15.084 0-.23-.005-.459-.016-.686A10.8 10.8 0 0 0 29.5 8.486Z"
        fill="currentColor"
      />
    </svg>
  ),
  discord: () => (
    <svg fill="none" height="100%" viewBox="0 0 33 32" width="100%">
      <path
        d="M25.51 8.658A21.3 21.3 0 0 0 20.218 7a.08.08 0 0 0-.085.041c-.229.41-.482.945-.66 1.366a19.616 19.616 0 0 0-5.943 0c-.178-.43-.44-.956-.67-1.366a.083.083 0 0 0-.084-.04 21.24 21.24 0 0 0-5.293 1.656.076.076 0 0 0-.034.03c-3.371 5.082-4.295 10.04-3.842 14.935a.09.09 0 0 0 .034.061 21.487 21.487 0 0 0 6.493 3.312c.033.01.07-.002.09-.03.5-.69.947-1.416 1.329-2.18a.083.083 0 0 0-.045-.116c-.707-.27-1.38-.6-2.028-.975a.085.085 0 0 1-.008-.14c.136-.103.272-.21.402-.318a.08.08 0 0 1 .084-.012c4.255 1.96 8.862 1.96 13.067 0a.08.08 0 0 1 .085.01c.13.109.266.217.404.32a.085.085 0 0 1-.007.14c-.648.382-1.322.705-2.03.974a.084.084 0 0 0-.044.117c.39.763.837 1.49 1.328 2.18.02.028.057.04.09.03a21.416 21.416 0 0 0 6.503-3.312.084.084 0 0 0 .034-.06c.542-5.66-.908-10.576-3.844-14.935a.066.066 0 0 0-.034-.031ZM12.188 20.642c-1.28 0-2.336-1.187-2.336-2.645 0-1.457 1.035-2.644 2.336-2.644 1.312 0 2.357 1.197 2.337 2.644 0 1.458-1.035 2.645-2.337 2.645Zm8.64 0c-1.281 0-2.337-1.187-2.337-2.645 0-1.457 1.035-2.644 2.337-2.644 1.311 0 2.357 1.197 2.336 2.644 0 1.458-1.025 2.645-2.336 2.645Z"
        fill="currentColor"
      />
    </svg>
  ),
  github: () => (
    <svg fill="none" height="100%" viewBox="0 0 33 32" width="100%">
      <path
        clipRule="evenodd"
        d="M15.546 3C7.774 3 1.5 9.192 1.5 16.863c0 6.099 4.027 11.274 9.645 13.123.75.092.937-.278.937-.647v-2.403c-3.933.832-4.776-1.848-4.776-1.848-.656-1.572-1.592-2.034-1.592-2.034-1.311-.831.094-.831.094-.831 1.404.092 2.153 1.386 2.153 1.386 1.218 2.125 3.278 1.479 4.12 1.109.094-.924.469-1.479.937-1.848-3.09-.37-6.368-1.572-6.368-6.84a5.47 5.47 0 0 1 1.405-3.696c-.187-.37-.656-1.756.094-3.697 0 0 1.217-.37 3.839 1.387 1.124-.278 2.341-.462 3.558-.462 1.218 0 2.435.184 3.559.462 2.715-1.756 3.839-1.387 3.839-1.387.75 1.941.28 3.327.094 3.697.936.924 1.404 2.218 1.404 3.697 0 5.36-3.277 6.469-6.367 6.839.468.462.936 1.293.936 2.587v3.79c0 .369.281.831.937.646 5.618-1.848 9.551-7.023 9.551-13.123C29.593 9.192 23.319 3 15.546 3Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  ),
};

const COMMUNITES_LIST: Array<{
  description: string;
  icon: () => JSX.Element;
  link: string;
  name: string;
}> = [
  {
    description:
      "Lorem Ipsum is simply dummy of the printing and typesetting industry. Lorem Ipsum has.",
    name: "Twitter",
    icon: COMMUNITIES_ICONS["twitter"],
    link: "",
  },
  {
    description:
      "Lorem Ipsum is simply dummy of the printing and typesetting industry. Lorem Ipsum has.",
    name: "Discord",
    icon: COMMUNITIES_ICONS["discord"],
    link: "",
  },
  {
    description:
      "Lorem Ipsum is simply dummy of the printing and typesetting industry. Lorem Ipsum has.",
    name: "Github",
    icon: COMMUNITIES_ICONS["github"],
    link: "",
  },
];

const Divider = styled("div", {
  border: "1px solid $darkTextPrimary",
  margin: "100px 0px",
  width: "50px",
});

const Title = styled("h3", {
  fontFamily: "$base",
  fontSize: "24px",
  fontWeight: "$semiBold",
  letterSpacing: "-0.05em",
  lineHeight: "100%",
  margin: "0",
  maxWidth: "45%",
  textAlign: "center",

  "@bp1": {
    fontSize: "36px",
    maxWidth: "35%",
  },

  "@bp2": {
    fontSize: "48px",
    maxWidth: "25%",
  }
});

const CommunityLink = styled("a", {
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  margin: "0 auto",
  width: "75%",

  "@bp1": {
    width: "50%",
  },

  "@bp2": {
    alignItems: "flex-start",
    width: "240px",
  }
});

export const Community: React.FC = () => {
  return (
    <Box
      css={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        paddingBottom: "200px",
      }}
    >
      <Divider />
      <Box
        css={{
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          gap: "200px",
          width: "100%",
        }}
      >
        <Title>Get involved in our community.</Title>
        <List
          css={{
            display: "flex",
            flexDirection: "column",
            gap: "120px",
            justifyContent: "center",

            "@bp2": {
              flexDirection: "row"
            }
          }}
        >
          {COMMUNITES_LIST.map((c) => (
            <li key={c.name}>
              <CommunityLink href={c.link} target="_blank">
                <Box
                  css={{
                    color: "$darkTextPrimary",
                    flexShrink: "0",
                    height: "32px",
                    width: "32px",
                  }}
                  aria-hidden
                >
                  {c.icon()}
                </Box>
                <Text
                  css={{
                    fontWeight: "$semiBold",
                    fontSize: "24px",
                    lineHeight: "29px",
                    margin: "16px 0 12px",
                    textAlign: "center",
                    letterSpacing: "-0.05em",
                  }}
                >
                  {c.name}
                </Text>
                <Text
                  css={{
                    color: "$darkTextSecondary",
                    fontSize: "16px",
                    lineHeight: "140%",
                    textAlign: "center",
                    letterSpacing: "-0.015em",

                    "@bp2": {
                      textAlign: "start"
                    }
                  }}
                >
                  {c.description}
                </Text>
              </CommunityLink>
            </li>
          ))}
        </List>
      </Box>
    </Box>
  );
};
