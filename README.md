# StreamPlay 🎥

A modern video streaming platform built with Next.js, Firebase, and Google Cloud Platform.

## Overview

StreamPlay is a full-stack video streaming application that allows users to:
- Upload and stream videos seamlessly
- Authenticate using Google Sign-In
- Browse video content with thumbnails
- Watch videos in a dedicated player

## Architecture

### Frontend (sp-web-client)
- Built with **Next.js 13** using the new App Router
- TypeScript for type safety
- Client-side authentication with Firebase Auth
- File structure:
  ```
  sp-web-client/
  ├── app/
  │   ├── page.tsx          # Home page with video grid
  │   ├── watch/            # Video player page
  │   └── firebase/         # Firebase configuration & helpers
  ```

### Backend (sp-api-service)
- Firebase Cloud Functions
- TypeScript-based serverless architecture
- Google Cloud Storage for video storage
- Secure video processing pipeline

## Technical Stack

- **Frontend Framework**: Next.js 13
- **Authentication**: Firebase Auth
- **Backend**: Firebase Cloud Functions
- **Storage**: Google Cloud Storage
- **Language**: TypeScript
- **Deployment**: Vercel (Frontend), Firebase (Backend)

## Features

### Video Streaming
- Direct streaming from Google Cloud Storage
- Adaptive video player with controls
- Custom video thumbnails

### Authentication
- Secure Google Sign-In integration
- Protected routes and API endpoints
- User session management

### Video Management
- Upload functionality
- Video metadata storage
- Thumbnail generation

