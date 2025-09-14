import ImageKit from "imagekit";

// Initialize ImageKit only if all required environment variables are present
let imagekit = null;

if (process.env.IMAGEKIT_PUBLIC_KEY && process.env.IMAGEKIT_PRIVATE_KEY && process.env.IMAGEKIT_URL_ENDPOINT) {
    try {
        imagekit = new ImageKit({
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
        console.log('ImageKit initialized successfully');
    } catch (error) {
        console.error('ImageKit initialization failed:', error.message);
    }
} else {
    console.log('ImageKit configuration not found, skipping initialization');
}

export default imagekit;
