/* Minimal ZIP reader for the Letterboxd export. Reads the central directory,
   then inflates only the entries `want(path)` accepts. `inflateRaw` is
   injected: DecompressionStream("deflate-raw") in browsers, zlib in Node. */

export async function readZip(bytes, want, inflateRaw) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  // End of central directory record: scan backwards for its signature.
  let eocd = -1;
  for (let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--) {
    if (dv.getUint32(i, true) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error("Not a ZIP file");
  const entries = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const dec = new TextDecoder("utf-8");
  const out = {};
  for (let n = 0; n < entries; n++) {
    if (dv.getUint32(p, true) !== 0x02014b50) throw new Error("Corrupt ZIP directory");
    const method = dv.getUint16(p + 10, true);
    const compSize = dv.getUint32(p + 20, true);
    const nameLen = dv.getUint16(p + 28, true);
    const extraLen = dv.getUint16(p + 30, true);
    const commentLen = dv.getUint16(p + 32, true);
    const localOff = dv.getUint32(p + 42, true);
    const name = dec.decode(u8.subarray(p + 46, p + 46 + nameLen));
    p += 46 + nameLen + extraLen + commentLen;
    if (name.endsWith("/") || !want(name)) continue;
    const lNameLen = dv.getUint16(localOff + 26, true);
    const lExtraLen = dv.getUint16(localOff + 28, true);
    const start = localOff + 30 + lNameLen + lExtraLen;
    const data = u8.subarray(start, start + compSize);
    let raw;
    if (method === 0) raw = data;
    else if (method === 8) raw = await inflateRaw(data);
    else throw new Error(`Unsupported compression in ${name}`);
    out[name] = dec.decode(raw);
  }
  return out;
}

export async function browserInflateRaw(data) {
  const ds = new DecompressionStream("deflate-raw");
  const stream = new Blob([data]).stream().pipeThrough(ds);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}
