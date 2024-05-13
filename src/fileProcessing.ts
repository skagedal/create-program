/**
 * @fileoverview General file processing utilities.
 */

import * as fs from 'fs/promises'

/**
 * Read lines from a file and return them as an array of strings.
 * @param path Path to the file to read.
 * @returns An array of strings. If the file does not exist, an empty array is returned. Other errors are thrown.
 */
export async function readLinesFromFile(path: string): Promise<string[]> {
  try {
    const gitIgnore = await fs.readFile(path, 'utf8');
    return gitIgnore.split('\n');
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return [];
    } else {
      throw error;
    }
  }
}

/**
 * Write lines to a file.
 * @param path Path to the file to write.
 * @param lines An array of strings to write to the file.
 */
export async function writeLinesToFile(path: string, lines: string[]) {
  await fs.writeFile(path, lines.join('\n'));
}
