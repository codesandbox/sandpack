import React from "react";

import * as icons from ".";

export default {
  title: "components/Icons",
};

export const all: React.FC = () => {
  return (
    <div style={{ color: "black" }}>
      {Object.keys(icons).map((iconName) => {
        const Component = icons[iconName];

        return <Component key={iconName} />;
      })}
    </div>
  );
};
