import { readFileSync, writeFileSync } from "fs";

let content = readFileSync("src/pages/app/DashboardOverview.tsx", "utf8");

// Find and replace the greeting line
const oldGreeting = /\{getGreeting\(\)\},.*???/s;
const newGreeting = `{getGreeting()}, {profile?.full_name ? profile.full_name.split(" ")[0] : user?.email ? user.email.split("@")[0] : "there"} ??`;

content = content.replace(oldGreeting, newGreeting);

writeFileSync("src/pages/app/DashboardOverview.tsx", content, "utf8");
console.log("Done - check the file now");
