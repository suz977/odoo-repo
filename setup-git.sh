#!/bin/bash

# Git setup script for SkillSwap project

echo "Setting up Git repository for SkillSwap..."

# Initialize Git repository
git init

# Create .gitignore file
cat > .gitignore << EOF
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Bolt specific
.bolt/
EOF

# Create README.md
cat > README.md << EOF
# SkillSwap - Comprehensive Skill Exchange Platform

A modern skill exchange platform that allows users to list skills they can offer, find skills they want to learn, and connect with others for mutual exchange.

## 🚀 Features

### Core Features
- **User Profiles** - Complete profile management with photos and preferences
- **Skill Listings** - List skills you can offer or want to learn
- **Swap Requests** - Send and manage skill exchange requests
- **Feedback System** - Rate and review completed skill swaps
- **Admin Panel** - Comprehensive platform management tools

### 🏆 Winning Features
- **🤖 AI-Powered Skill Matchmaking** - Intelligent algorithm that matches users based on mutual interests, availability, and location
- **💱 Swap Credit System** - Fair exchange system where users earn and spend credits for skill swaps

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Icons**: Lucide React
- **State Management**: React Context API

## 📦 Installation

1. Clone the repository:
\`\`\`bash
git clone <your-repo-url>
cd skillswap
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Start the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🏗 Project Structure

\`\`\`
src/
├── components/
│   ├── Admin/          # Admin panel components
│   ├── Auth/           # Authentication components
│   ├── Dashboard/      # Dashboard components
│   ├── Layout/         # Layout components (Navbar, etc.)
│   ├── Matches/        # Skill matching components
│   ├── Profile/        # User profile components
│   ├── Requests/       # Swap request components
│   └── Skills/         # Skill management components
├── contexts/           # React Context providers
├── types/              # TypeScript type definitions
├── App.tsx            # Main app component
├── main.tsx           # App entry point
└── index.css          # Global styles
\`\`\`

## 🎯 Key Features

### AI-Powered Matchmaking
The platform uses an intelligent matching algorithm that:
- Matches users where User A offers what User B wants and vice versa
- Considers availability overlap (mornings, evenings, weekends)
- Factors in location proximity for better matches
- Scores matches using a point system:
  - +50 points for direct skill match
  - +20 points for availability overlap
  - +10 points for location proximity

### Credit System
- Users earn 1 credit for completing a skill swap as a teacher
- Users spend 1 credit to request a skill swap
- Prevents spam and ensures fair exchanges
- Admin can manually adjust credits when needed

## 👥 Demo Accounts

- **Regular User**: sarah@example.com (any password)
- **Admin User**: admin@skillswap.com (any password)

## 🚀 Deployment

The app is deployed on Netlify. To deploy your own version:

1. Build the project:
\`\`\`bash
npm run build
\`\`\`

2. Deploy the \`dist\` folder to your preferred hosting service

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please open an issue in the repository.
EOF

# Add all files to Git
git add .

# Initial commit
git commit -m "Initial commit: SkillSwap platform with AI matchmaking and credit system

Features:
- User authentication and profile management
- Skill listing system (offered/wanted skills)
- AI-powered skill matchmaking algorithm
- Swap request management with status tracking
- Credit system for fair exchanges
- Comprehensive feedback and rating system
- Admin panel for platform management
- Real-time notifications and messaging
- Responsive design with modern UI/UX"

echo "Git repository initialized successfully!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub/GitLab"
echo "2. Add remote origin: git remote add origin <your-repo-url>"
echo "3. Push to remote: git push -u origin main"
echo ""
echo "Repository is ready for upload!"