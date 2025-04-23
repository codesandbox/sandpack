import path from "path";

import type {
  BundlerSandbox,
  Sandbox,
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

    const sandbox: BundlerSandbox | StaticSandbox = {
      environment: data.template === "static" ? "static" : "bundler",
      template: data.template,
      main: data.entry,
      files: data.modules.reduce((acc, module) => {
        acc[getModulePath(module).join("/")] = {
          code: module.code,
        };

        return acc;
      }, {}),
    };

    res.status(200).json(sandbox);
  } catch (error) {
    console.error("Error starting sandbox:", error);
    res.status(500).json({ error: "Failed to start sandbox" });
  }
});

// POST endpoint for creating and starting a sandbox
app.post("/api/sandboxes/:id", async (req, res) => {
  try {
    const templateId = req.params.id;

    const sandbox = await sdk.sandbox.create({ template: templateId });
    const data = await sdk.sandbox.start(sandbox.id);

    res.status(200).json(data);
  } catch (error) {
    console.error("Error creating/starting sandbox:", error);
    res.status(500).json({ error: "Failed to create or start sandbox" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Serving static files from: ${publicPath}`);
});
