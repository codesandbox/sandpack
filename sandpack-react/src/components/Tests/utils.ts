import cleanSet from "clean-set";

import type { Describe } from "./Describes";
import type { Spec } from "./Specs";
import type { SuiteResults, TestResults } from "./Summary";
import type { Test } from "./Tests";

export const getFailingTests = (block: Describe | Spec): Test[] =>
  getTests(block).filter((t) => t.status === "fail");

export const getTests = (block: Describe | Spec): Test[] =>
  Object.values(block.tests).concat(
    ...Object.values(block.describes).map(getTests)
  );

export const getAllTestResults = (specs: Spec[]): TestResults =>
  specs.map(getSpecTestResults).reduce(
    (acc, stats) => {
      return {
        pass: acc.pass + stats.pass,
        fail: acc.fail + stats.fail,
        skip: acc.skip + stats.skip,
        total: acc.total + stats.total,
      };
    },
    { pass: 0, skip: 0, fail: 0, total: 0 }
  );

export const getSpecTestResults = (spec: Spec): TestResults =>
  getTests(spec).reduce(
    (acc, test) => {
      return {
        pass: test.status === "pass" ? acc.pass + 1 : acc.pass,
        fail: test.status === "fail" ? acc.fail + 1 : acc.fail,
        skip:
          test.status === "idle" || test.status === "running"
            ? acc.skip + 1
            : acc.skip,
        total: acc.total + 1,
      };
    },
    { pass: 0, fail: 0, skip: 0, total: 0 }
  );

export const getAllSuiteResults = (specs: Spec[]): SuiteResults =>
  specs
    .filter(
      (spec) =>
        Object.values(spec.describes).length > 0 ||
        Object.values(spec.tests).length > 0
    )
    .map(getSpecTestResults)
    .reduce(
      (acc, stats) => {
        return {
          pass: acc.pass + (stats.fail === 0 ? 1 : 0),
          fail: acc.fail + (stats.fail > 0 ? 1 : 0),
          total: acc.total + 1,
        };
      },
      { pass: 0, fail: 0, total: 0 }
    );

export const getDuration = (specs: Spec[]): number =>
  flatMap(specs, getTests).reduce((acc, test) => acc + (test.duration || 0), 0);

export const isEmpty = (block: Spec | Describe): boolean =>
  Object.values(block.describes).length === 0 &&
  Object.values(block.tests).length === 0;

export const splitTail = <A>(as: A[]): [A[], A | undefined] => {
  const lastIndex = as.length - 1;
  const head = as.slice(0, lastIndex);
  const tail = as[lastIndex];
  return [head, tail];
};

export const flatMap = <A, B>(as: A[], f: (a: A) => B[]): B[] =>
  as.map(f).reduce((acc, next) => acc.concat(next), []);

export const set =
  (path: string[], value: unknown) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  <A extends Record<string, any>>(object: A): A =>
    cleanSet(object, path, value);

export class ReactStringReplacer {
  private _source: React.ReactNode[];

  constructor(source: string) {
    this._source = [source];
  }

  // Note: this algorithm assumes the regex is wrapped in a matching group so it can collect the odd indexes (matches)
  public replace = (
    regex: RegExp,
    mapper: (match: string, index: number) => React.ReactNode
  ): ReactStringReplacer => {
    this._source = flatMap(this._source, (node) => {
      if (typeof node === "string") {
        return node
          .split(regex)
          .reduce<React.ReactNode[]>((acc, match, index) => {
            if (index % 2 === 0) {
              return acc.concat(match);
            } else {
              const element = mapper(match, index);
              return acc.concat(element);
            }
          }, []);
      } else {
        return [node];
      }
    });

    return this;
  };

  public match = (
    regex: RegExp,
    mapper: (matches: string[], index: number) => React.ReactNode
  ): ReactStringReplacer => {
    this._source = this._source.map((node, index) => {
      if (typeof node === "string") {
        const matches = node.split(regex);

        // No matches so just return the node
        if (matches.length < 2) {
          return node;
        } else {
          return mapper(matches, index);
        }
      } else {
        return [node];
      }
    });

    return this;
  };

  public get = (): React.ReactNode => this._source;
}
