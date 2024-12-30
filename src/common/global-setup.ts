import { FullConfig } from "playwright/test";
import { generateRandomString } from "@common/utils";
import { v4 as uuidv4 } from "uuid";

export default function globalSetup(config: FullConfig) {
  process.env._TR_TEST_RUN_SHORT_ID = generateRandomString(8);
  process.env._TR_TEST_RUN_UUID = uuidv4();
}
