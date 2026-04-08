import { readFileSync, writeFileSync } from "fs";

let content = readFileSync("src/pages/app/DashboardOverview.tsx", "utf8");

content = content.replace(
  `{getGreeting()}, {profile?.full_name?.split(" ")[0] || "there"} ??`,
  `{getGreeting()}, {profile?.full_name ? profile.full_name.split(" ")[0] : user?.email ? user.email.split("@")[0] : "there"} ??`
);

writeFileSync("src/pages/app/DashboardOverview.tsx", content, "utf8");
console.log("Dashboard greeting fixed");
