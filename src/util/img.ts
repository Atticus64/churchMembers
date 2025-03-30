import fs from "node:fs";
import { Buffer } from "node:buffer";
import dotenv from 'dotenv';

dotenv.config();
export function base64_encode(file: string): string {
    // read binary data
    const bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    const buffer = Buffer.from(bitmap);
    return buffer.toString("base64");
}


async function uploadImage(data: string, title: string, description: string): Promise<string> {
    const params = new URLSearchParams();
    params.append("image", data);
    params.append("title", title);
    params.append("description", description);
    const token = process.env.IMGUR_TOKEN;

    try {
        const resp = await fetch(`https://api.imgur.com/3/image`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
            body: params,
        });
    
        const { data } = await resp.json();

        return data.link;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
}

export { uploadImage };


