import ImageKit from "imagekit";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Check if environment variables are set
if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || 
    !process.env.IMAGEKIT_PRIVATE_KEY || 
    !process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT) {
    console.error("Missing ImageKit environment variables");
}

const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export async function POST(req) {
    try {
        const {userId} =  await auth();
        if (!userId) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const formData = await req.formData();
        const file = formData.get("file");
        const fileName = formData.get("fileName");

        if (!file || !fileName) {
            return NextResponse.json({error: "Missing file or fileName"}, {status: 400});
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9]/g, "_") || "upload";
        const uniqueFileName = `${userId}/${sanitizedFileName}_${timestamp}`;

        const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: uniqueFileName,
            folder: "/projects",
        });

        const thumbnailUrl = imagekit.url({
            src: uploadResponse.url,
            transformation: [
                {
                    width: 400,
                    height: 300,
                    cropMode: "maintain_ar",
                    quality: 80,
                }
            ]
        });

        const response = {
            url: uploadResponse.url,
            success: true,
            thumbnailUrl: thumbnailUrl,
            fileId: uploadResponse.fileId,
            width: uploadResponse.width,
            height: uploadResponse.height,
            size: uploadResponse.size,
            name: uploadResponse.name,
        };

        console.log("Returning success response");
        return NextResponse.json(response);

    } catch (error) {
        console.error("ImageKit upload error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}