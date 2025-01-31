/**
 * @jest-environment jsdom
 */
import { act, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";

import { SandpackProvider } from "../../";

import { SandpackCodeEditor } from ".";

describe("read-only", () => {
  jest.useFakeTimers();

  it("should render the read-only flag", () => {
    render(
      <SandpackProvider>
        <SandpackCodeEditor readOnly />
      </SandpackProvider>
    );

    act(() => {
      jest.runAllTimers();
    });

    const readOnlyFlag = screen.getByTestId("read-only");
    expect(readOnlyFlag).toHaveTextContent("Read-only");
  });

  it("should not render the read-only flag, when showReadOnly is false", () => {
    render(
      <SandpackProvider>
        <SandpackCodeEditor showReadOnly={false} readOnly />
      </SandpackProvider>
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(screen.queryByTestId("read-only")).not.toBeInTheDocument();
  });
});
