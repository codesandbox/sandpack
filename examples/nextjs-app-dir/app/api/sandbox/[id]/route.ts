import { CodeSandbox } from "@codesandbox/sdk";

type Params = { params: { id: string } };

const apiKey = process.env.CSB_API_TOKEN as string;
const sdk = new CodeSandbox(apiKey, {});

export const GET = async (_req: Request, { params }: Params) => {
  const templateId = params.id;
  const data = await sdk.sandbox.start(templateId);

  return new Response(JSON.stringify(data), { status: 200 });
};

export const POST = async (_req: Request, { params }: Params) => {
  const templateId = params.id;

  const sandbox = await sdk.sandbox.create({ template: templateId });
  const data = await sdk.sandbox.start(sandbox.id);

  return new Response(JSON.stringify(data), { status: 200 });
};
