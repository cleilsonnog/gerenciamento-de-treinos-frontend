import { defineConfig } from "orval";
import "dotenv/config";

export default defineConfig({
  rc: {
    input: {
      target: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
      filters: {
        mode: "exclude",
        tags: ["default"],
      },
    },
    output: {
      target: "lib/api/rc-generated/index.ts",
      client: "react-query",
      prettier: true,
      override: {
        mutator: {
          path: "./lib/api/custom-fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
  fetch: {
    input: `${process.env.NEXT_PUBLIC_API_URL}/swagger.json`,
    output: {
      target: "./app/_lib/api/fetch-generated/index.ts",
      client: "fetch",
      prettier: true,
      override: {
        mutator: {
          path: "./app/_lib/fetch.ts",
          name: "customFetch",
        },
      },
    },
  },
});
