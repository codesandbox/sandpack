import { commonFiles } from "../common";

export const ANGULAR_TEMPLATE = {
  files: {
    "/src/app/app.component.css": commonFiles["/styles.css"],
    "/src/app/app.component.html": {
      code: `<div>
<h1>{{ helloWorld }}</h1>
</div>     
`,
    },
    "/src/app/app.component.ts": {
      code: `import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  helloWorld = "Hello world";
}           
`,
    },
    "/src/app/app.module.ts": {
      code: `import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
      
import { AppComponent } from "./app.component";
      
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}       
`,
    },
    "/src/index.html": {
      code: `<!doctype html>
<html lang="en">
      
<head>
  <meta charset="utf-8">
  <title>Angular</title>
  <base href="/">
      
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
</head>
      
<body>
   <app-root></app-root>
</body>
      
</html>
`,
    },
    "/src/main.ts": {
      code: `import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
      
import { AppModule } from "./app/app.module";      

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.log(err));
      
`,
    },
    "/src/polyfills.ts": {
      code: `import "core-js/proposals/reflect-metadata";   
      import "zone.js/dist/zone";
`,
    },
    "/package.json": {
      code: JSON.stringify({
        dependencies: {
          "@angular/core": "^11.2.0",
          "@angular/platform-browser": "^11.2.0",
          "@angular/platform-browser-dynamic": "^11.2.0",
          "@angular/common": "^11.2.0",
          "@angular/compiler": "^11.2.0",
          "zone.js": "0.11.3",
          "core-js": "3.8.3",
          rxjs: "6.6.3",
        },
        main: "/src/main.ts",
      }),
    },
  },
  main: "/src/app/app.component.ts",
  environment: "angular-cli",
};
