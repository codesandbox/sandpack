import { Octokit } from "@octokit/rest";
import fetch from "node-fetch";

import createCurrentSizes from "./createCurrentSizes.js";

const octokit = new Octokit({
  auth: process.env.GH_TOKEN,
});

function format(bytes) {
  var sizes = ["bytes", "kb", "mb"];
  if (bytes === 0) return "0 byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

const amount = (deps) => deps.reduce((acc, curr) => acc + curr.gzip, 0);

const ratio = (base, current) => {
  if (current === base) return `✅ ${format(0)}`;

  let diff = current - base;
  let ratioAmount = (((base - current) / base) * -1).toFixed(2);

  if (current > base) return `⚠️ +${format(diff)} (+${ratioAmount}%)`;

  ratioAmount = (((base - current) / base) * 100).toFixed(2);
  diff = base - current;

  if (current < base) return `🎉 -${format(diff)} (-${ratioAmount}%)`;

  return diff;
};

const findComment = async (parameters) => {
  for await (const { data: comments } of octokit.paginate.iterator(
    octokit.rest.issues.listComments,
    parameters
  )) {
    const comment = comments.find((comment) =>
      comment.body.includes("Size changes")
    );
    if (comment) return comment;
  }
};

/**
 * Main func
 */
(async () => {
  const currentSizes = await createCurrentSizes();

  const loadBaseFile = async () => {
    const data = await fetch(
      "https://raw.githubusercontent.com/codesandbox/sandpack/main/scripts/sizebot/sizebot.json"
    );
    return await data.json();
  };
  const baseSizes = await loadBaseFile();

  const content = Object.entries(currentSizes).map(([name, currentDeps]) => {
    const baseDeps = baseSizes[name];

    const removedFiles = baseDeps
      .map((base) => {
        const fileStillExist = currentDeps.find((e) => e.name === base.name);
        if (fileStillExist) return undefined;

        const fileName = base.name.replace(`./${name}/dist/esm/`, "");
        return `| \`${fileName}\` | ${format(
          base.gzip
        )} | File removed | ⚠️ | \n`;
      })
      .filter(Boolean);

    const tableContent = currentDeps.map((item) => {
      const baseFile = baseDeps.find((p) => p.name === item.name);
      const fileName = item.name.replace(`./${name}/dist/esm/`, "");

      if (!baseFile) {
        return `| \`${fileName}\` | New file | ${format(item.gzip)} | ⚠️ | \n`;
      }

      const baseSize = baseFile.gzip;
      const currentFormat = format(item.gzip);
      const baseFormat = format(baseSize);
      const ratioFormat = ratio(baseSize, item.gzip);

      return `| \`${fileName}\` | ${baseFormat} | ${currentFormat} |  ${ratioFormat} | \n`;
    });

    const baseAmount = amount(baseDeps);
    const currentAmount = amount(currentDeps);

    return `### ${name}
| Total base | Total current | +/- |
| - | - | - |
| ${format(baseAmount)} | ${format(currentAmount)} | ${ratio(
      baseAmount,
      currentAmount
    )} |

<details>
 <summary>Details</summary>

| Dependency name / file | Base | Current | +/- |
| - | - | - | - |
${removedFiles.join("")}${tableContent.join("")} \n\n
</details>

`;
  });

  /**
   * Creating comment
   */
  const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");
  const issue_number =
    process.env.GITHUB_REF.split("refs/pull/")[1].split("/")[0];

  const comment = await findComment({ owner, repo, issue_number });

  if (comment) {
    await octokit.rest.issues.updateComment({
      owner,
      repo,
      comment_id: comment.id,
      body: `## Size changes

  ${content.join("")}`,
    });
  } else {
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number,
      body: `## Size changes

  ${content.join("")}`,
    });
  }
})();
