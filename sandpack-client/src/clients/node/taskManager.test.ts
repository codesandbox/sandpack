import { tokenize } from "./taskManager";

describe(tokenize, () => {
  it("parses environment variables", () => {
    const input = tokenize("FOO=1 tsc -p");
    const output = [
      { type: "EnvVar", value: { FOO: "1" } },
      { type: "Command", value: "tsc" },
      { type: "Argument", value: "-p" },
    ];

    expect(input).toEqual(output);
  });

  it("parses multiples envs environment variables", () => {
    const input = tokenize("FOO=1 BAZ=bla tsc -p");
    const output = [
      { type: "EnvVar", value: { FOO: "1", BAZ: "bla" } },
      { type: "Command", value: "tsc" },
      { type: "Argument", value: "-p" },
    ];

    expect(input).toEqual(output);
  });

  it("parses command and argument", () => {
    const input = tokenize("tsc -p");
    const output = [
      { type: "Command", value: "tsc" },
      { type: "Argument", value: "-p" },
    ];

    expect(input).toEqual(output);
  });

  it("parses two commands", () => {
    const input = tokenize("tsc && node");
    const output = [
      { type: "Command", value: "tsc" },
      { type: "AND" },
      { type: "Command", value: "node" },
    ];

    expect(input).toEqual(output);
  });

  it("parses two commands", () => {
    const input = tokenize("tsc -p . && node index.js");
    const output = [
      { type: "Command", value: "tsc" },
      { type: "Argument", value: "-p" },
      { type: "Command", value: "." },
      { type: "AND" },
      { type: "Command", value: "node" },
      { type: "Command", value: "index.js" },
    ];

    expect(input).toEqual(output);
  });

  it("parses multiple arguments", () => {
    const input = tokenize("tsc --foo -- --foo");
    const output = [
      { type: "Command", value: "tsc" },
      { type: "Argument", value: "--foo" },
      { type: "Argument", value: "--" },
      { type: "Argument", value: "--foo" },
    ];

    expect(input).toEqual(output);
  });

  it("parses pipe and string commands", () => {
    const input = tokenize(`echo "Hello World" | wc -w`);
    const output = [
      { type: "Command", value: "echo" },
      { type: "String", value: '"Hello World"' },
      { type: "PIPE" },
      { type: "Command", value: "wc" },
      { type: "Argument", value: "-w" },
    ];

    expect(input).toEqual(output);
  });

  it("parses escaped characters", () => {
    const input = tokenize(`echo "Hello | World" | wc -w`);
    const output = [
      { type: "Command", value: "echo" },
      { type: "String", value: '"Hello | World"' },
      { type: "PIPE" },
      { type: "Command", value: "wc" },
      { type: "Argument", value: "-w" },
    ];

    expect(input).toEqual(output);
  });

  it("parses escaped characters", () => {
    const input = tokenize(`echo "Hello | World" | wc -w`);
    const output = [
      { type: "Command", value: "echo" },
      { type: "String", value: '"Hello | World"' },
      { type: "PIPE" },
      { type: "Command", value: "wc" },
      { type: "Argument", value: "-w" },
    ];

    expect(input).toEqual(output);
  });

  it("parses or", () => {
    const input = tokenize(`echo "Hello | World" || wc -w`);
    const output = [
      { type: "Command", value: "echo" },
      { type: "String", value: '"Hello | World"' },
      { type: "OR" },
      { type: "Command", value: "wc" },
      { type: "Argument", value: "-w" },
    ];

    expect(input).toEqual(output);
  });
});
