import fs from "node:fs";
import { Buffer } from "node:buffer";
import dotenv from 'dotenv';

dotenv.config();
function base64_encode(file) {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer.from(bitmap).toString("base64");
}


const params = new URLSearchParams();
params.append("image", base64_encode("elitista.jpg"));
params.append("title", "Reading post!");
const token = process.env.IMGUR_TOKEN;

const resp = await fetch(`https://api.imgur.com/3/image`, {
    method: "POST",
    headers: {
        "Authorization": `Bearer ${token}`,
    },
    body: params,
});

const data = await resp.json();

console.log(data);
