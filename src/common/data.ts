import { readFile } from "fs/promises";
import { existsSync, readFileSync } from "fs";
import { load as loadYaml } from "js-yaml";
import { parse as loadCsv } from "csv-parse/sync";
import * as path from "node:path";

export interface TestCase<TI, TE> {
  id?: number;
  name?: string;
  input: TI;
  expected?: TE;
}

export function getDataDir(): string {
  return path.resolve(__dirname, "..", "data");
}

export async function readDataFileAsync(fileName: string, prefix?: string): Promise<string> {
  let targetPath = prefix ? path.join(getDataDir(), prefix, fileName) : path.join(getDataDir(), fileName);
  if (!existsSync(targetPath) && prefix) {
    targetPath = path.join(getDataDir(), fileName);
  }
  return await readFile(targetPath, { encoding: "utf8", flag: "r" });
}

export function readDataFile(fileName: string, prefix?: string): string {
  let targetPath = prefix ? path.join(getDataDir(), prefix, fileName) : path.join(getDataDir(), fileName);
  if (!existsSync(targetPath) && prefix) {
    targetPath = path.join(getDataDir(), fileName);
  }
  return readFileSync(targetPath, { encoding: "utf8", flag: "r" });
}

export async function readYamlDataAsync(fileName: string, prefix?: string) {
  return await loadYaml(await readDataFileAsync(fileName, prefix));
}

export function readYamlData(fileName: string, prefix?: string) {
  return loadYaml(readDataFile(fileName, prefix));
}

export async function readObjectListFromYamlAsync<T>(fileName: string, prefix?: string): Promise<T[]> {
  const data = await readYamlDataAsync(fileName, prefix);
  return data as T[];
}

export function readObjectListFromYaml<T>(fileName: string, prefix?: string): T[] {
  return readYamlData(fileName, prefix) as T[];
}

export async function readObjectFromYamlAsync<T>(fileName: string): Promise<T> {
  const data = await readYamlData(fileName);
  return data as T;
}

export function readObjectFromYaml<T>(fileName: string, prefix?: string): T {
  return readYamlData(fileName, prefix) as T;
}

export async function readTestCasesFromYamlAsync<T extends TestCase<any, any>>(
  fileName: string,
  prefix?: string,
): Promise<T[]> {
  return readObjectListFromYaml<T>(fileName, prefix);
}

export function readTestCasesFromYaml<T extends TestCase<any, any>>(fileName: string, prefix?: string): T[] {
  return readObjectListFromYaml<T>(fileName, prefix);
}

export function readCsvData(
  fileName: string,
  prefix?: string,
  delimiter: string = ",",
  autoCast: boolean = true,
): any[] {
  return loadCsv(readDataFile(fileName, prefix), {
    columns: true,
    skip_empty_lines: true,
    delimiter: delimiter,
    ltrim: true,
    cast: autoCast,
    castDate: autoCast,
  });
}

export function readObjectListFromCsv<T>(fileName: string, prefix?: string, delimiter: string = ","): T[] {
  return readCsvData(fileName, prefix, delimiter) as T[];
}
