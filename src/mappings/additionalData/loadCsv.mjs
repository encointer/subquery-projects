import { readFileSync, writeFileSync } from "node:fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvRaw = readFileSync(
    path.resolve(
        __dirname,
        "./account-events-manually-annotated-early-blocks1.csv"
    )
);
console.log(csvRaw);
const rows = [];
parse(csvRaw)
    .on("data", (r) => rows.push(r))
    .on("close", () => {
        const data = rows.filter(row => !['0', '20'].includes(row[3])).slice(1).map((row) => ({
            timestamp: new Date(row[0]).getTime(),
            cindex: row[3],
            cid: row[4],
            receiver: row[6],
            amount: row[7],
            extrinsicId: row[9],
        }));
        writeFileSync('./manauallyEnteredData.ts', "export default " + JSON.stringify(data, null, 2) , 'utf-8');
    });
