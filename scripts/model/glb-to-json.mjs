#!/usr/bin/env node
/**
 * Wraps a .glb in a JSON file ({ format, glb: base64 }) for hosts that serve .json
 * but not .glb, and whose content-security policy blocks fetching data: URIs.
 * The preview build's StudioCanvas decodes it in memory (WrappedGlbLoader).
 *   node scripts/model/glb-to-json.mjs in.glb out.json
 */
import { readFileSync, writeFileSync } from "node:fs";

const [, , input, output] = process.argv;
const glb = readFileSync(input);
if (glb.toString("ascii", 0, 4) !== "glTF") throw new Error(`${input} is not a binary glTF file`);
writeFileSync(output, JSON.stringify({ format: "glb+base64", glb: glb.toString("base64") }));
console.log(`${output}: ${(readFileSync(output).length / 1048576).toFixed(2)} MB`);
