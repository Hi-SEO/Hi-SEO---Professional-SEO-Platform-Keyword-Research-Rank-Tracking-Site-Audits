import { readFileSync, writeFileSync } from "fs";

// Fix 1 - Dashboard greeting
let dashboard = readFileSync("src/pages/app/DashboardOverview.tsx", "utf8");

const lines = dashboard.split("\n");
const fixedLines = lines.map(line => {
  if (line.includes("getGreeting()") && line.includes("full_name")) {
    return '          {getGreeting()}, {profile?.full_name ? profile.full_name.split(" ")[0] : user?.email ? user.email.split("@")[0] : "there"} ??';
  }
  return line;
});

writeFileSync("src/pages/app/DashboardOverview.tsx", fixedLines.join("\n"), "utf8");
console.log("Dashboard greeting fixed");

// Fix 2 - Settings toggles
let settings = readFileSync("src/pages/app/Settings.tsx", "utf8");

const settingsLines = settings.split("\n");
const fixedSettings = settingsLines.map(line => {
  if (line.includes('onClick={() => item.onChange(!item.value)}')) {
    return '                  type="button" onClick={() => item.onChange(!item.value)}';
  }
  if (line.includes('"bg-primary" : "bg-muted"')) {
    return '                  className={"relative w-11 h-6 rounded-full transition-all duration-200 " + (item.value ? "bg-blue-500" : "bg-gray-300")}';
  }
  if (line.includes('"translate-x-6" : "translate-x-1"')) {
    return '                    className={"absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-200 " + (item.value ? "translate-x-5" : "translate-x-0")}';
  }
  return line;
});

writeFileSync("src/pages/app/Settings.tsx", fixedSettings.join("\n"), "utf8");
console.log("Settings toggles fixed");
