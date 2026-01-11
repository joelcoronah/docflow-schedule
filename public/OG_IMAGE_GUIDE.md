# Open Graph Image Guide

## Required Images for Social Sharing

To properly share your DocFlow application on social media, you need to create and add the following images to the `/public` folder:

### 1. Open Graph Image (Required)
- **Filename**: `og-image.png`
- **Size**: 1200 x 630 pixels
- **Format**: PNG or JPG
- **Purpose**: Used when sharing on Facebook, LinkedIn, WhatsApp, etc.
- **Content**: Should include:
  - DocFlow logo
  - App name: "DocFlow"
  - Tagline: "Medical Practice Management System"
  - Clean, professional design with medical theme

### 2. Favicon Files

#### Standard Favicon
- **Filename**: `favicon.ico`
- **Size**: 32x32, 16x16 (multi-size)
- **Format**: ICO
- ✅ Already exists

#### PNG Favicons
- **Filenames**:
  - `favicon-16x16.png` (16x16)
  - `favicon-32x32.png` (32x32)
- **Format**: PNG with transparent background

### 3. Apple Touch Icon
- **Filename**: `apple-touch-icon.png`
- **Size**: 180 x 180 pixels
- **Format**: PNG
- **Purpose**: iOS home screen icon

### 4. Android Chrome Icons (PWA)
- **Filenames**:
  - `android-chrome-192x192.png` (192x192)
  - `android-chrome-512x512.png` (512x512)
- **Format**: PNG
- **Purpose**: Progressive Web App icons for Android

### 5. Screenshots (Optional - for PWA)
Create a `/public/screenshots` folder with:
- `dashboard.png` (1280x720) - Screenshot of main dashboard
- `calendar.png` (1280x720) - Screenshot of calendar view

## Design Guidelines

### Color Scheme
- Primary: `#0ea5e9` (Sky Blue)
- Background: `#ffffff` (White)
- Text: `#1e293b` (Slate)

### Logo/Icon Style
- Medical cross or calendar icon
- Clean, modern, minimalist design
- High contrast for visibility

## Quick Image Generation Tools

### Online Tools:
1. **Canva** - canva.com (Free templates available)
2. **Figma** - figma.com (Professional design tool)
3. **Real Favicon Generator** - realfavicongenerator.net (Auto-generates all favicon sizes)

### Command Line (ImageMagick):
```bash
# Convert a high-res logo to various sizes
convert logo.png -resize 1200x630 og-image.png
convert logo.png -resize 180x180 apple-touch-icon.png
convert logo.png -resize 192x192 android-chrome-192x192.png
convert logo.png -resize 512x512 android-chrome-512x512.png
convert logo.png -resize 32x32 favicon-32x32.png
convert logo.png -resize 16x16 favicon-16x16.png
```

## Testing Your Social Sharing

After adding images, test on:

1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **Open Graph Check**: https://www.opengraph.xyz/

## Current Status

- ✅ Meta tags configured in `index.html`
- ✅ Manifest.json created
- ✅ Robots.txt configured
- ✅ Sitemap.xml created
- ⚠️  OG image needs to be created (`og-image.png`)
- ⚠️  Favicon variants need to be created
- ⚠️  Apple touch icon needs to be created
- ⚠️  Android chrome icons need to be created

## Update URLs

Before deploying, update the following URLs in `index.html`:
- Replace `https://docflow.app/` with your actual domain
- Replace `https://docflow.app/og-image.png` with your actual OG image URL
