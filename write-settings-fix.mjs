import { readFileSync, writeFileSync } from "fs";

let content = readFileSync("src/pages/app/Settings.tsx", "utf8");

content = content.replace(
  `<button
                  onClick={() => item.onChange(!item.value)}
                  className={\`relative w-11 h-6 rounded-full transition-colors \${
                    item.value ? "bg-primary" : "bg-muted"
                  }\`}
                >
                  <span
                    className={\`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform \${
                      item.value ? "translate-x-6" : "translate-x-1"
                    }\`}
                  />
                </button>`,
  `<button
                  type="button"
                  onClick={() => item.onChange(!item.value)}
                  className={"relative w-11 h-6 rounded-full transition-colors " + (item.value ? "bg-primary" : "bg-gray-300")}
                >
                  <span
                    className={"absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform " + (item.value ? "translate-x-6" : "translate-x-1")}
                  />
                </button>`
);

writeFileSync("src/pages/app/Settings.tsx", content, "utf8");
console.log("Settings toggles fixed");
