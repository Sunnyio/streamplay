# StreamPlay 🎥

StreamPlay is a modern video streaming platform built with Next.js 13, Firebase, and Google Cloud Platform. It enables users to upload, process, and stream videos with a YouTube-like experience.

See it live at https://sp-web-client-558417751810.asia-south1.run.app/

## 🌟 Features

- **Video Upload & Processing**
  - Support upload for multiple video formats
  - Automatic video processing to 360p
  - Thumbnail support

- **Video Streaming**
  - Adaptive video playback
  - Video player controls
  - Duration display

- **Authentication**
  - Google Sign-In integration
  - Protected routes
  - User session management

- **Responsive Design**
  - Mobile-friendly interface
  - Grid layout for video listings
  - Smooth animations
  - Modern UI/UX

## 🏗️ Architecture

### Frontend (sp-web-client)
- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript
- **Styling**: CSS Modules + Tailwind CSS
- **Authentication**: Firebase Auth
- **State Management**: React Hooks

### Backend Services
1. **API Service (sp-api-service)**
   - Firebase Cloud Functions
   - Video metadata management
   - User authentication
   - Upload URL generation

2. **Video Processing Service**
   - Node.js Express server
   - FFmpeg for video processing
   - Google Cloud Run deployment
   - Pub/Sub integration

### Storage
- Raw videos: Google Cloud Storage
- Processed videos: Google Cloud Storage
- Thumbnails: Google Cloud Storage
- Metadata: Firestore
- User details: Firestore

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- Firebase CLI
- Google Cloud CLI
- FFmpeg (for video processing service)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/streamplay.git
cd streamplay
```

2. Install dependencies for all services
```bash
# Frontend
cd sp-web-client
npm install

# API Service
cd ../sp-api-service
npm install

# Video Processing Service
cd ../video-processing-service
npm install
```

3. Set up environment variables
```bash
# In sp-web-client/.env.local
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_THUMBNAIL_BUCKET=your_thumbnail_bucket_url
NEXT_PUBLIC_VIDEO_BUCKET=your_video_bucket_url
```

4. Start the development servers
```bash
# Frontend
cd sp-web-client
npm run dev

# API Service
cd sp-api-service
npm run serve

# Video Processing Service
cd video-processing-service
npm run dev
```

## 🛠️ Development

### Project Structure
```
streamplay/
├── sp-web-client/          # Frontend application
│   ├── app/                # Next.js 13 app directory
│   ├── components/         # Reusable components
│   └── firebase/          # Firebase configuration
├── sp-api-service/         # Firebase Cloud Functions
│   └── functions/         # API endpoints
└── video-processing-service/ # Video processing service
    └── src/               # Service source code
```

### Key Components
- `VideoGrid`: Displays video thumbnails in a responsive grid
- `VideoPlayer`: Custom video player with controls
- `UploadModal`: Handles video upload with progress
- `Navbar`: Navigation and authentication controls

## 📝 Environment Variables

Create a `.env.local` file in the sp-web-client directory:

```plaintext
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_THUMBNAIL_BUCKET=
NEXT_PUBLIC_VIDEO_BUCKET=
```


## 🔒 Security

- All API endpoints are protected with Firebase Auth
- Cloud Storage buckets have strict CORS policies
- Environment variables for sensitive data
- Input validation on all uploads

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Google Cloud Platform](https://cloud.google.com/)
- [FFmpeg](https://ffmpeg.org/)

