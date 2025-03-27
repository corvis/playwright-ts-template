import extendPlaywrightPerformance, {
  PerformanceOptions,
  PerformanceWorker,
  PlaywrightPerformance,
} from "playwright-performance";
import { test } from "@common/base";

const options: PerformanceOptions = {
  disableAppendToExistingFile: false,
  dropResultsFromFailedTest: false,
  analyzeByBrowser: false,
  performanceResultsDirectoryName: "performance-report",
  performanceResultsFileName: "results",
  suppressConsoleResults: false,
};

export const performanceTest = test.extend<PlaywrightPerformance, PerformanceOptions & PerformanceWorker>(
  extendPlaywrightPerformance(options),
);
