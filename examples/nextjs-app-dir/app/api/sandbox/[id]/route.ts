import { CodeSandbox } from "@codesandbox/sdk";

const apiKey = process.env.CSB_API_TOKEN as string;

export const GET = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  const templateId = params.id;
  const sdk = new CodeSandbox(apiKey, {});

  const data = await sdk.sandbox.start(templateId);

  return new Response(JSON.stringify(data), { status: 200 });
};
