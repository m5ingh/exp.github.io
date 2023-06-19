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

  const searchInput = document.getElementById("searchInput");
  const searchButton = document.getElementById("searchButton");
  const resultContainer = document.getElementById("resultContainer");

  searchButton.addEventListener("click", async () => {
    const userQuery = searchInput.value;

    if (userQuery) {
      const result = await worker.db.exec(
        `SELECT * FROM interncert WHERE certId = ${userQuery}`
      );

      resultContainer.textContent = "";

    if (result.length === 0) {
      resultContainer.textContent = "No certificate found.";
    } else {
      result.forEach((resultSet, index) => {
        const resultString = resultSet.values
          .map((row) => {
            return row
              .map((value, columnIndex) => {
                const column = resultSet.columns[columnIndex];
                return `${column}: ${value}`;
              })
              .join("\n");
          })
          .join("\n\n");

        resultContainer.textContent += resultString;
        resultContainer.textContent += "\n\n";
      });
    }
  }
 });
}

load();
