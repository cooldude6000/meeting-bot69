![MeetingBot - AI Meeting NoteTaker](https://meetingbot3.s3.us-east-1.amazonaws.com/FULL+STACK.png)

[Link to 30 hours long YouTube Tutorial](https://www.youtube.com/watch?v=5meG9KB1w0g)
PS: Youtube only allows videos of max duration of 12 hours. But since my video is 30 hours long, I uploaded it as 3 different parts. The link above is of the first part(2nd and 3rd parts of tutorial link in description of the above video)

## Upcoming Features

- [ ] Integrations
   - [ ] Notion Integration
   - [ ] Linear Integration
   - [ ] Salesforce Integration
   - [ ] Hubspot Integration
- [ ] For past meetings:
    - [ ] Users should be able to search through their meetings
    - [ ] Date based filtering (ex: march 17 to april 1)
    - [ ] Custom date ranges filtering (ex: last week, last month, last quarter)
    - [ ] Meeting duration filtering (ex: less than 30 mins)
    - [ ] Participant based filtering
- [ ] 100+ languages transcript translation (similar to what fireflies.ai does) (Users will be able to view their transcripts in over 100 languages. They can go to a dropdown menu and change their transcript language) - use Google Cloud Translation API

- [ ] Workspaces Creation
    - [ ] Users can create a workspace
    - [ ] Users can invite other people to their workspace
    - [ ] Role based access


## Contributing

Any contributions are very much appreciated. Take a feature from the above list (or hmu if you got any other feature in your mind that you'd like to implement) and then make a PR 🤛

# Overview

Hi 🐶, In this project, you'll build MeetingBot, a comprehensive open-source meeting intelligence platform that automatically joins your video calls on Zoom, Google Meet, and Microsoft Teams to provide AI-powered transcription, summaries, and actionable insights. The platform features real-time calendar sync that automatically schedules bots for upcoming meetings, while giving you full control over which meetings to record. You'll learn how to build a SaaS with AI integrations using OpenAI and Pinecone for conversational meeting intelligence, where users can chat with individual meetings or query across their entire meeting history. The application includes Stripe subscription management, Slack bot integration (we will be building a slack bot from scratch), project management tool synchronization (Asana, Jira, Trello), and features like custom bot personalization and automated action item detection. We'll use technologies such as Next.js 15, TypeScript, Tailwind CSS 4, Shadcn UI, Clerk auth, Prisma ORM, AWS Lambda, AWS S3, OpenAI API, Pinecone vector database, Stripe, Slack Bolt framework, etc and more to create a complete alternative to commercial solutions like Fireflies.ai and Otter.ai.

# Features

- 🤖 Automatic AI bot deployment to Zoom, Google Meet, and Microsoft Teams

- 📝 Meeting transcription with speaker identification and diarization

- 🧠 AI-generated meeting summaries and action items using OpenAI

- 📅 Real-time calendar sync with Google Calendar

- 💬 Chat with meeting conversational AI with RAG pipeline powered by Pinecone vector database

- 🔍 Semantic search across all meeting transcripts and summaries

- 🔗 One-click action item sync to Jira, Asana, and Trello project management tools

- 💬 Native Slack bot integration with @meetingbot commands using Slack Bolt framework

- 💳 Three-tier subscription system with Stripe payment processing and webhook handling

- 🔒 Secure user authentication and session management with Clerk

- 🎨 Modern responsive UI built with Next.js 15, Tailwind CSS 4, and Shadcn UI

- 📊 Comprehensive meeting dashboard with audio playback using React H5 Audio Player

- 📋 Complete meeting history with clickable past meeting navigation

- 📅 Upcoming meetings dashboard with toggle controls for bot attendance

- 💭 Individual meeting chat interface for meeting-specific conversations

- 🗨️ Global chat feature to query across all meetings simultaneously

- ⚙️ React Context hooks for efficient state management across components

- ☁️ AWS Lambda functions for automated bot scheduling

- 🛡️ Enterprise-grade security with proper webhook validation using Svix

- 🗄️ AWS S3 storage for audio files and user profile images

- 🎯 Custom bot personalization with name changes and profile image uploads

- 📧 Post-meeting automated email notifications using Resend integration

- 🗄️ Efficient database management with Prisma ORM

- 🔔 Real-time notifications using Sonner toast system

- 🌙 Dark theme support using Next Themes

# Technologies and Frameworks

- Next.js 15
- TypeScript
- Tailwind CSS 4
- Shadcn UI
- Clerk Auth
- Prisma ORM
- PostgreSQL
- AWS SDK
- AWS Lambda
- AWS S3
- AWS EventBridge Scheduler
- OpenAI API
- Pinecone Vector Database
- Stripe
- Slack Bolt Framework
- Resend
- Svix
- React H5 Audio Player
- Sonner
- Next Themes
- @tanstack/react-query
- and some others

# Installation & Setup

Follow these steps to get MeetingBot running locally on your machine:

1. **Clone the repository**

   ```bash
   git clone https://github.com/cooldude6000/meeting-bot69.git
   cd meeting-bot69
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up your environment variables**

   Create a `.env` file in the root directory and add the variables.

4. **Set up the database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000) to see your MeetingBot application running locally.