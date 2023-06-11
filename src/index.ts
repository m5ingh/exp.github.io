import { createDbWorker } from "sql.js-httpvfs";

const workerUrl = new URL(
  "sql.js-httpvfs/dist/sqlite.worker.js",
  import.meta.url
);
const wasmUrl = new URL("sql.js-httpvfs/dist/sql-wasm.wasm", import.meta.url);

async function load() {
  let maxBytesToRead = 10 * 1024 * 1024;
  const config = {
    from: "inline",
    config: {
      serverMode: "full",
      url: "/example.sqlite3",
      requestChunkSize: 4096,
    },
  };

  const worker = await createDbWorker(
    [config],
    workerUrl.toString(),
    wasmUrl.toString(),
    maxBytesToRead
  );

  const userQuery = prompt("Enter Certificate ID");

  if (userQuery) {
    const result = await worker.db.exec(`select * from interncert where certId=${userQuery}`); // may edit to "const result = await (worker.db as any).exec(`select * from interncert where certID=${userQuery}`);"
    for ( const element of result){
    console.log(element);
    }
    document.body.textContent = JSON.stringify(result);
  }
}

load();
