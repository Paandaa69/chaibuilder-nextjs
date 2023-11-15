import { ChaibuilderBackend } from "@chaibuilder/sdk/server";

export const chaiBuilder = new ChaibuilderBackend(
  process.env.CHAIBUILDER_AUTH_SECRET || "",
  process.env.CHAIBUILDER_APP_KEY || "",
);
