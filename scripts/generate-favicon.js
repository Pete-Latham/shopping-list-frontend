#!/usr/bin/env node

// Simple favicon generator using HTML Canvas API in Node.js
// This creates a PNG version of our shopping cart favicon

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple SVG data URL for our favicon
const createFaviconSVG = (size = 32) => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#646cff;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#61dafb;stop-opacity:1" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="48" fill="url(#bgGradient)" stroke="#ffffff" stroke-width="2"/>
      <text x="50" y="68" text-anchor="middle" font-size="52" fill="white" font-family="system-ui, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif">🛒</text>
    </svg>
  `)}`;
};

// Write a simple HTML file that generates the favicon
const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Favicon Generator</title>
</head>
<body>
    <canvas id="canvas" width="32" height="32"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        
        // Create favicon programmatically
        function drawFavicon() {
            // Clear canvas
            ctx.clearRect(0, 0, 32, 32);
            
            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 32, 32);
            gradient.addColorStop(0, '#646cff');
            gradient.addColorStop(1, '#61dafb');
            
            // Draw background circle
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(16, 16, 15, 0, 2 * Math.PI);
            ctx.fill();
            
            // Add border
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw shopping cart emoji
            ctx.fillStyle = '#ffffff';
            ctx.font = '16px system-ui, "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🛒', 16, 18);
        }
        
        drawFavicon();
        
        // Export as data URL (you can save this manually)
        const dataURL = canvas.toDataURL('image/png');
        console.log('Favicon data URL generated');
        
        // Create download link
        const link = document.createElement('a');
        link.download = 'favicon-32x32.png';
        link.href = dataURL;
        link.textContent = 'Download favicon-32x32.png';
        document.body.appendChild(link);
    </script>
</body>
</html>`;

// Write the HTML file
const outputPath = path.join(__dirname, '..', 'favicon-generator.html');
fs.writeFileSync(outputPath, htmlContent);

console.log(`
🛒 Favicon Generator Created!

To generate PNG favicons:
1. Open the generated 'favicon-generator.html' file in your browser
2. The favicon will be drawn on a canvas
3. Right-click the canvas and "Save image as..." to save as PNG
4. Or click the download link that appears

The HTML file has been saved to: ${outputPath}

For immediate use, the SVG favicon is already in place at public/favicon.svg
`);

// Also create the Apple touch icon SVG
const appleTouchIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#646cff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#61dafb;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background with rounded corners for iOS -->
  <rect x="10" y="10" width="160" height="160" rx="35" ry="35" fill="url(#bgGradient)" stroke="#ffffff" stroke-width="3"/>
  
  <!-- Shopping cart emoji -->
  <text x="90" y="120" text-anchor="middle" font-size="90" fill="white" font-family="system-ui, 'Segoe UI Emoji', 'Apple Color Emoji', sans-serif">🛒</text>
</svg>`;

const appleIconPath = path.join(__dirname, '..', 'public', 'apple-touch-icon.svg');
fs.writeFileSync(appleIconPath, appleTouchIconSVG);

console.log(`Apple touch icon created at: ${appleIconPath}`);
