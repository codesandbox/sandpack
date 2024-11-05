import { findStartScriptPackageJson } from "./client.utils";

describe(findStartScriptPackageJson, () => {
  it("should parse a regular command", () => {
    expect(
      findStartScriptPackageJson(JSON.stringify({ scripts: { start: "node" } }))
    ).toEqual(["node", [], { env: {} }]);
  });

  it("should parse a regular command with arguments", () => {
    expect(
      findStartScriptPackageJson(
        JSON.stringify({ scripts: { start: "node dev --foo" } })
      )
    ).toEqual(["node", ["dev", "--foo"], { env: {} }]);
  });

  it("should get dev script first", () => {
    expect(
      findStartScriptPackageJson(
        JSON.stringify({
          scripts: { start: "node start --foo", dev: "node dev --foo" },
        })
      )
    ).toEqual(["node", ["dev", "--foo"], { env: {} }]);
  });

  it("should parse env vars", () => {
    expect(
      findStartScriptPackageJson(
        JSON.stringify({
          scripts: { start: "NODE=1 ANOTHER=2 node start --foo" },
        })
      )
    ).toEqual([
      "node",
      ["start", "--foo"],
      { env: { NODE: "1", ANOTHER: "2" } },
    ]);
  });

  it("should parse a single env var", () => {
    expect(
      findStartScriptPackageJson(
        JSON.stringify({
          scripts: { start: "NODE=1 node start --foo" },
        })
      )
    ).toEqual(["node", ["start", "--foo"], { env: { NODE: "1" } }]);
  });

  it("should parse a single env var and a single commmand", () => {
    expect(
      findStartScriptPackageJson(
        JSON.stringify({
          scripts: { start: "NODE=1 node" },
        })
      )
    ).toEqual(["node", [], { env: { NODE: "1" } }]);
  });
});
