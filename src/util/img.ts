import dotenv from 'dotenv';

dotenv.config();

async function uploadImage(file: string, title: string, description: string): Promise<string> {
    const params = new URLSearchParams();
    params.append("image", file);
    params.append("title", title);
    params.append("description", description);
    const token = process.env.IMGUR_TOKEN;

    const resp = await fetch(`https://api.imgur.com/3/image`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
        },
        body: params,
    });
    
    const { data } = await resp.json();

    return data.link;
}

export { uploadImage };


