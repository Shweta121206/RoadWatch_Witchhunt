# RoadWatch Dashboard

A React + Vite frontend dashboard for the RoadWatch project.

## Features

- Login screen with local mock authentication
- Dashboard overview with RoadWatch-style cards and map preview
- Analytics page with severity distribution and weekly timeline
- Pothole management page with case cards and severity filtering
- Trip management page with active and completed route cards
- Settings page and sidebar navigation

## Run locally

1. Open terminal in `c:\Users\shwsu\Downloads\WH\frontend`
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start development server:

   ```bash
   npm run dev
   ```

4. Open the app in your browser at the Vite URL shown in terminal.

## Login credentials

- Email: `admin@roadwatch.com`
- Password: `RoadWatch123`

PitSense Model Weight: https://drive.google.com/file/d/1BO9rNlzifsT9CAWSyAzXGe1b6kkU-xeb/view?usp=sharing

## Notes

This implementation uses mock data and local storage authentication for dashboard behavior. You can later connect it to your backend APIs for real pothole detection, verification, and analytics data.
