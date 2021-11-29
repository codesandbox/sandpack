import React from "react";

type Props = Record<"title" | "description" | "href" | "actionText", string> & {
  external?: boolean;
};

const IntroCard: React.FC<Props> = ({
  title,
  description,
  href,
  actionText,
  external,
}) => {
  return (
    <a
      className="intro-card"
      href={href}
      rel="noreferrer"
      target={external ? "_blank" : "_self"}
    >
      <h3 className="intro-card_title">{title}</h3>
      <p className="intro-card_desc">{description}</p>
      <div className="intro-card_link">
        {actionText} {external && "↗"}
      </div>
    </a>
  );
};

export { IntroCard };
