import path from "path";

import type {
  BundlerSandbox,
  SandboxFiles,
  StaticSandbox,
  VMSandbox,
} from "@codesandbox/sandpack-react";
import { CodeSandbox } from "@codesandbox/sdk";
import dotenv from "dotenv";
import express from "express";

// Load environment variables
dotenv.config();

const app = express();
const port = 3001;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
const publicPath = path.join(__dirname, "public");
app.use(express.static(publicPath));

const apiKey = JSON.parse(process.env.CSB_API_KEY) as string;
const globalApiKey = JSON.parse(process.env.CSB_GLOBAL_API_KEY) as string;

const sdk = new CodeSandbox(apiKey, {});

// TODO: Deliver the actual built files
app.get("/", async (req, res) => {
  res.send("Hello from CodeSandbox API!");
});

// GET endpoint for starting a sandbox from a template
app.get("/api/sandboxes/:id", async (req, res) => {
  try {
    const sandboxId = req.params.id;
    const { data } = await fetch(
      "https://codesandbox.io/api/v1/sandboxes/" + sandboxId,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${globalApiKey}`,
          "Content-Type": "application/json",
        },
      }
    ).then((res) => res.json());

    if (data.v2) {
      const session = await sdk.sandbox.start(sandboxId);
      const sandbox: VMSandbox = {
        environment: "vm",
        session,
        sandboxId,
      };

      res.status(200).json(sandbox);
      return;
    }

    const getModulePath = (moduleOrDirectory) => {
      const parentDir = moduleOrDirectory.directory_shortid
        ? data.directories.find(
            (dir) => dir.shortid === moduleOrDirectory.directory_shortid
          )
        : null;
      return parentDir
        ? getModulePath(parentDir).concat(moduleOrDirectory.title)
        : [moduleOrDirectory.title];
    };

    const entry = data.entry;
    const files = data.modules.reduce((acc: SandboxFiles, module) => {
      acc[getModulePath(module).join("/")] = {
        code: module.code,
        metadata: { shortid: module.shortid },
      };

      return acc;
    }, {});

    const sandbox: BundlerSandbox | StaticSandbox =
      data.template === "static"
        ? {
            environment: "static",

            entry,
            files,
            sandboxId,
          }
        : {
            environment: "bundler",
            entry,
            files,
            bundler: data.template,
            sandboxId,
          };

    res.status(200).json(sandbox);
  } catch (error) {
    console.error("Error starting sandbox:", error);
    res.status(500).json({ error: "Failed to start sandbox" });
  }
});

// POST endpoint for updating/creating a file in a sandbox
app.post("/api/sandboxes/:id/fs", async (req, res) => {
  const sandboxId = req.params.id;
  const { shortid, content } = req.body;

  // Implementation details to be handled by you
  // Example: update file at 'path' with 'content' in sandbox 'sandboxId'

  await fetch(
    `https://codesandbox.io/api/v1/sandboxes/${sandboxId}/modules/${shortid}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${globalApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ module: { code: content } }),
    }
  );

  res
    .status(200)
    .json({ message: "File update endpoint hit", sandboxId, shortid, content });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Serving static files from: ${publicPath}`);
});
