import pako from 'pako';

export interface SaveFileData {
  alerted: { [key: string]: boolean };
  unlocked: { [key: string]: boolean };
  discovered: { [key: string]: boolean };
}

const returnPrefix = /^return /;
const stringKeys = /\["(.*?)"\]=/g;
const numberKeys = /\[(\d+)\]=/g;
const trailingCommas = /,}/g;
const numberKey = /"NOSTRING_(\d+)":/g;
const stringKey = /"([^"]*?)":/g;

function decompress(data: Uint8Array): string {
  return pako.inflateRaw(data, { to: "string" });
}

function rawToJSON(data: string) {
  return JSON.parse(data
    .replace(returnPrefix, "")
    .replace(stringKeys, "\"$1\":")
    .replace(numberKeys, "\"NOSTRING_$1\":")
    .replace(trailingCommas, "}"));
}

function FixJSONArrays(json: any): any {
  if (typeof json !== 'object' || json === null) {
    return json;
  }
  const keys = Object.keys(json);
  if (keys.length === 0) {
    return json;
  }
  if (!keys.every((key) => key.startsWith('NOSTRING_'))) {
    for (const key of keys) {
      json[key] = FixJSONArrays(json[key]);
    }
    return json;
  }
  const array: any[] = [];
  for (const key of keys) {
    // -1 cause lua is 1 indexed
    array[parseInt(key.slice(9)) - 1] = FixJSONArrays(json[key]);
  }
  return array;
}

export function processFile(buffer: Uint8Array) {
  const data = decompress(buffer);
  const json = rawToJSON(data);
  return FixJSONArrays(json);
}

export function parseMetaFile(content: string | ArrayBuffer): SaveFileData {
  try {
    // If content is a string, convert it to ArrayBuffer
    let buffer: Uint8Array;
    if (typeof content === 'string') {
      buffer = new TextEncoder().encode(content);
    } else {
      buffer = new Uint8Array(content);
    }

    // Process the file using balatro-save-loader functionality
    const data = processFile(buffer);
    
    return {
      alerted: data.alerted || {},
      unlocked: data.unlocked || {},
      discovered: data.discovered || {}
    };
  } catch (error) {
    console.error('Error parsing meta file:', error);
    throw new Error('Invalid meta.jkr file format');
  }
}

export function isJokerUnlocked(saveData: SaveFileData | null, jokerId: string): boolean {
  if (!saveData) return false;
  return !!saveData.unlocked[jokerId];
} 