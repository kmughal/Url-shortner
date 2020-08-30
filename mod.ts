import { serve } from "https://deno.land/std/http/server.ts";
import { MongoClient } from "https://deno.land/x/mongo@v0.11.1/mod.ts";

const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

interface UrlShortnerSchema {
    _id: { $oid: string };
    url: string;
    shortner: string;
}

const db = client.database("test");
const inst = db.collection<UrlShortnerSchema>("urlshortner");
const port = 3000;

const server = serve({ port });
console.log("staring server :", port);
for await (let request of server) {
    if (String(request.url).includes("/generate-url-shortner")) {
        const parts = new URL(`http://localhost:${port}${request.url}`);
        const shortner = parts.searchParams.get("shortner");
        const url = parts.searchParams.get("url");
        if (shortner && url) {
            const findByShortner = await inst.findOne({ shortner });

            if (!findByShortner) {
                const insertId = await inst.insertOne({
                    url, shortner
                });
                await request.respond({ body: `http://locahost:${port}/${shortner}`, status: 200 });
            } else {
                await request.respond({ status: 500, body: `${shortner} is already assigned pick something else.` })
            }
        }
        await request.respond({ status: 500, body: "invalid request" });
    }
    else {

        const parts = new URL(`http://localhost:${port}${request.url}`).pathname;
        if (parts) {
            const find = await inst.findOne({ shortner: parts.replace("/", "") });
            if (find) {
                const headers = new Headers({ 'location': find.url });
                await request.respond({ status: 302, headers });
            } else {
                 await request.respond({ status: 404 });
            }
        }
    }
}