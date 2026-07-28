🚀 Momentum DashboardMomentum is a premium, AI-powered goal execution companion and dashboard designed for high-performing technical leads and developers. It bridges real-time project metrics with intelligent predictive analytics to help users track velocity, anticipate execution risks, and hit milestones effortlessly.✨ Key Features📊 Executive Dashboard: Live velocity metrics, execution charts, and on-track completion rates built with Recharts.🎯 Dynamic Goal Planning: Interactive task breakdown, milestone tracking, and autonomous execution modes.🤖 AI Risk Analyzer: Integrated with Google Gemini API to analyze project drift and forecast potential delays before they occur.🔐 Secure OAuth Authentication: End-to-end user authentication with Google OAuth powered by Supabase.⚡ Production-Ready SSR: Optimized rendering with React hydration handling, custom error boundaries, and SPA fallback routing.🛠️ Tech StackFrontend: React 19, TypeScript, Tailwind CSS, Lucide React, RechartsBackend & Auth: Supabase (PostgreSQL Database, Google OAuth)AI Engine: Google Gemini APIDeployment: Vercel🚀 Getting Started1. PrerequisitesEnsure you have the following installed on your machine:Node.js (v18.x or higher)npm or pnpm2. InstallationClone the repository and install dependencies:Bashgit clone https://github.com/sumeethofficial-svg/momentum-dashboard.git
cd momentum-dashboard
npm install
3. Environment VariablesCreate a .env.local file in the root directory and configure the following keys:Code snippet# Supabase Configuration
VITE_SUPABASE_URL=https://xyrmejlbupeusdrehhkx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Google OAuth Credentials
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_client_secret

# AI Engine
GEMINI_API_KEY=your_gemini_api_key
4. Local DevelopmentRun the local development server:Bashnpm run dev
Open http://localhost:5173 in your browser.📦 Deployment on VercelPush your latest code to your GitHub repository.Connect your repository to Vercel.Add the environment variables listed above in Vercel Project Settings $\rightarrow$ Environment Variables.Ensure vercel.json is present in your root directory to handle SPA rewrites:JSON{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
🤝 ContributingContributions, issues, and feature requests are welcome! Feel free to check the issues tab.📄 LicenseThis project is licensed under the MIT License.
