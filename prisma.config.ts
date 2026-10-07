import { definePrismaConfig } from "prisma/config";

export default definePrismaConfig({
  orm: {
    adapter: "prisma-client-js",
    family: "prisma",
    target: "prisma-client-js",
    provider: "sqlite",
  },
  skills: {
    agents: ["claude", "cursor", "agents", "devin"],
  },
});