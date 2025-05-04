import fs from 'node:fs';
import path from 'node:path';
import mime from 'mime-types';

// Required plugin information  
export const info = {
    id: 'random-image',
    name: 'Random Image Plugin',
    description: 'Serves random images from the public directory',
};

// Required init function, receives an Express router  
export async function init(router) {
    //local image file path /ST/public/xxxx
    const localImagePath= path.join('public', 'imgpool');

    // Helper function to get images from a directory  
    function getImagesFromDirectory(directoryPath) {
        if (!fs.existsSync(directoryPath)) {
            return [];
        }

        return fs.readdirSync(directoryPath)
            .filter(file => {
                const mimeType = mime.lookup(file);
                return mimeType && mimeType.startsWith('image/');
            });
    }

    // Route to serve a specific image  
    router.get('/img/:imagePath(*)', (req, res) => {
        try {
            const imagePath = req.params.imagePath;
            const fullPath = path.join(localImagePath, imagePath);

            if (!fs.existsSync(fullPath)) {
                console.error(`Image not found: ${fullPath}`);
                return res.status(404).send('Image not found');
            }

            const contentType = mime.lookup(fullPath) || 'image/png';
            const imageData = fs.readFileSync(fullPath);
            res.setHeader('Content-Type', contentType);
            return res.send(imageData);
        } catch (error) {
            console.error('Failed to serve image:', error);
            return res.status(500).send('Internal server error');
        }
    });

    // Route to serve a random image from a directory  
    router.get('/rd/:directoryPath(*)?', (req, res) => {
        try {
            // Get the directory path from the request parameters or use the root image directory  
            const directoryPath = req.params.directoryPath
                ? path.join(localImagePath, req.params.directoryPath)
                : path.join(localImagePath);

            // Check if the directory exists  
            if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
                console.error(`Directory not found: ${directoryPath}`);
                return res.status(404).send('Directory not found');
            }

            // Get all images in the directory  
            const images = getImagesFromDirectory(directoryPath);

            if (images.length === 0) {
                return res.status(404).send('No images found in directory');
            }

            // Select a random image  
            const randomImage = images[Math.floor(Math.random() * images.length)];
            const imagePath = path.join(directoryPath, randomImage);

            // Get the content type and read the file  
            const contentType = mime.lookup(imagePath) || 'image/png';
            const imageData = fs.readFileSync(imagePath);

            // Send the image  
            res.setHeader('Content-Type', contentType);
            return res.send(imageData);
        } catch (error) {
            console.error('Failed to serve random image:', error);
            return res.status(500).send('Internal server error');
        }
    });

    console.log('Random Image plugin initialized!');
}

// Optional cleanup function  
export function exit() {
    console.log('Random Image plugin shutting down...');
}
