import * as React from "react";

import { SandpackProvider } from "../../contexts/sandpackContext";

import { CodeEditor } from "./index";

export default {
  title: "components/CodeMirror",
  component: CodeEditor,
};

export const HTML: React.FC = () => (
  <SandpackProvider>
    <CodeEditor
      code={`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>HTML 5 Boilerplate</title>
    <link rel="stylesheet" href="style.css">
  </head>
  <body>
  <script src="index.js"></script>
  </body>
</html>
`}
      fileType="html"
      id="html"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const JavaScript: React.FC = () => (
  <SandpackProvider>
    <CodeEditor
      code={`
function foo(params) {
  return params
}

const baz = (foo) => {
  return foo
}

const array = [];
const object = {};
const regex = new Regex(//);

const expr = 'Papayas';
switch (expr) {
  case 'Oranges':
    console.log('Oranges are $0.59 a pound.');
    break;
  case 'Mangoes':
  case 'Papayas':
    console.log('Mangoes and papayas are $2.79 a pound.');
    // expected output: "Mangoes and papayas are $2.79 a pound."
    break;
  default:
    console.log(\`Sorry, we are out of $\{expr}.\`);
}
`}
      fileType="js"
      id="js"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const JSX: React.FC = () => (
  <SandpackProvider>
    <CodeEditor
      code={`
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}

export default function App() {
  return (
    <div>
      <Greeting name="Divyesh" />
      <Greeting name="Sarah" />
      <Greeting name="Taylor" />
    </div>
  );
}      
`}
      fileType="jsx"
      id="jsx"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const CSS: React.FC = () => (
  <SandpackProvider>
    <CodeEditor
      code={`
body {
  background-color: lightblue;
}

h1 {
  color: white;
  text-align: center;
}

p {
  font-family: verdana;
  font-size: 20px;
}    
`}
      fileType="css"
      id="css"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const Less: React.FC = () => (
  <SandpackProvider>
    <CodeEditor
      code={`
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}  
`}
      fileType="less"
      id="less"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const Vue: React.FC = () => (
  <SandpackProvider>
    <CodeEditor
      code={`
<template>
  <div class="column is-12">
      <label class="label" for="email">Email</label>
      <p :class="{ 'control': true }">
          <input v-validate="'required|email'" :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" placeholder="Email">
          <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
      </p>
  </div>
</template>

<script>
export default {
  name: 'basic-example'
};
</script>
`}
      fileType="vue"
      id="vue"
      initMode="immediate"
      showLineNumbers={false}
    />
  </SandpackProvider>
);

export const ShowLineNumber: React.FC = () => (
  <SandpackProvider>
    <CodeEditor
      code={`
@width: 10px;
@height: @width + 10px;

#header {
  width: @width;
  height: @height;
}  
`}
      fileType="less"
      id="less"
      initMode="immediate"
      showLineNumbers
    />
  </SandpackProvider>
);

export const WrapContent: React.FC = () => (
  <SandpackProvider>
    <CodeEditor
      code={Array(20).fill("Lorem ipsum").join("")}
      id="wrap"
      initMode="immediate"
      showLineNumbers
      wrapContent
    />
  </SandpackProvider>
);

export const Decorators: React.FC = () => (
  <SandpackProvider>
    <style>
      {`.highlight, .widget {
        background: red;
      }`}
    </style>
    <CodeEditor
      code={`const people = [{
  id: 0,
  name: 'Creola Katherine Johnson',
  profession: 'mathematician',
}, {
  id: 1,
  name: 'Mario José Molina-Pasquel Henríquez',
  profession: 'chemist',
}];

export default function List() {
  const [text, setText] = useState("")
  const listItems = people.map(person =>
    <li>{person}</li>
  );
  return <ul>{listItems}</ul>;
}`}
      decorators={[
        { className: "highlight", line: 1 },
        { className: "highlight", line: 9 },
        {
          className: "widget",
          elementAttributes: { "data-id": "2" },
          line: 13,
          startColumn: 8,
          endColumn: 17,
        },
        {
          className: "widget",
          elementAttributes: { "data-id": "1" },
          line: 12,
          startColumn: 26,
          endColumn: 38,
        },
      ]}
      fileType="jsx"
      id="decorators"
      initMode="immediate"
    />
  </SandpackProvider>
);
