# MeetingMate — AI-Powered Meeting Facilitation Tool

**EMGT 5220 Team 2 | Semester Team Project**

MeetingMate is an AI-powered tool that transforms how project managers handle meetings. Before the meeting, it generates structured agendas. After the meeting, it extracts decisions, action items with owners, and flags unresolved items. Everything carries forward automatically so nothing slips between sprints.

## Features

- **Agenda Generation**: Enter project context and attendees → get a structured agenda with time allocations
- **Transcript Summarization**: Paste meeting notes or transcripts → extract decisions and action items with owners
- **Open Item Register**: Unresolved items carry forward automatically between meetings

## Tech Stack

- Frontend: HTML, CSS, JavaScript (vanilla)
- AI: Claude API (Sonnet 4)
- Deployment: Vercel (free tier)
- Design: Custom themed UI with teal-blue-amber color coding

---

## Deployment Instructions

### Step 1: Get Your Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up or log in (Rafael — AI Integration Lead owns this)
3. Go to **API Keys** section
4. Click **Create Key**
5. Copy the key — you'll need it in Step 3

**Cost**: Claude API is pay-as-you-go. For this project (M5 testing + M6 demo), expect ~$2-5 total.

---

### Step 2: Deploy to GitHub

1. Create a new GitHub repository:
   - Go to github.com and log in
   - Click **New repository**
   - Name it `meetingmate`
   - Make it **Public** (required for free Vercel hosting)
   - Click **Create repository**

2. Upload these files to your new repo:
   - `index.html`
   - `styles.css`
   - `app.js`
   - `vercel.json`
   - `api/claude.js` (create an `api` folder first)
   - `README.md` (this file)

   **Easy upload method**: On GitHub, click **Add file → Upload files**, drag all files in, commit.

---

### Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign up with your GitHub account
2. Click **Add New... → Project**
3. Import your `meetingmate` repository
4. **Before deploying**, add the API key:
   - In the **Environment Variables** section, add:
     - **Key**: `ANTHROPIC_API_KEY`
     - **Value**: [paste your Anthropic API key from Step 1]
   - Click **Add**
5. Click **Deploy**

Vercel will build and deploy your app in about 30 seconds. You'll get a live URL like:

```
https://meetingmate-xyz123.vercel.app
```

**That URL is what you submit for M5.**

---

## Testing the Deployed Tool

1. Open your Vercel URL
2. Go to the **Agenda** tab
3. Fill in:
   - Project name: "M5 Beta Testing"
   - Meeting type: "Sprint review"
   - Duration: 60
   - Topics: "Test agenda generation, review action items"
   - Add 2-3 attendees
4. Click **Generate agenda** → should produce a structured agenda in ~5 seconds
5. Go to the **Summary** tab
6. Paste a sample transcript (can be rough bullet points)
7. Click **Generate summary** → should extract decisions and action items
8. Click **Send unresolved to open items** → items appear in the Open Items tab

**If anything fails**, check the Vercel deployment logs or ask Rafael to verify the API key is set correctly.

---

## M5 Submission Checklist

For your M5 deliverable, you need:

1. ✅ **Working beta tool** — Submit the Vercel URL
2. ✅ **Sprint 5 Progress Report** (separate document):
   - Sprint backlog and status
   - Plan vs actual comparison
   - Beta tool description (what works, what doesn't)
   - Testing notes (document at least 3 tests against M2 requirements)
   - Risk log update
   - M6 sprint plan

---

## M6 Enhancements

For the final version in M6, consider adding:

- **Export feature**: Download agenda/summary as .txt or .docx file
- **Persistent storage**: Save open items to a database (Supabase free tier)
- **Better error messages**: More helpful prompts when API calls fail
- **UI polish**: Loading animations, success confirmations
- **Accessibility**: ARIA labels, keyboard navigation

---

## Team Roles (Build Phase)

| Role | Owner | Responsibility |
|------|-------|---------------|
| AI Integration Lead | Rafael Derzavich Kalach | API setup, prompt engineering, testing |
| Frontend Development | Sebastien de Verbigier | Code repository, UI refinements |
| Testing Lead | Samantha Grahn | Run acceptance tests against M2 requirements |
| Documentation | Amro Rajab | User guide, README, progress reports |
| POC & Demo Lead | Chinmay Sangodkar | Coordinate submissions, prepare M7 demo |
| SME & Test Data | Alexander Yazji | Create realistic test scenarios |

---

## Troubleshooting

**"API key not configured" error**:
- Go to Vercel dashboard → your project → Settings → Environment Variables
- Verify `ANTHROPIC_API_KEY` is set correctly
- Redeploy the project

**Tool generates gibberish**:
- Check the Vercel function logs (Dashboard → Deployments → Functions)
- The prompt format might be off — check `api/claude.js`

**Vercel deployment fails**:
- Make sure all files are in the correct folder structure
- `api/claude.js` must be inside an `api/` folder
- Check the Vercel build logs for specific errors

---

## Project Context

This tool fulfills the requirements from:
- **M2**: Tool definition, functional requirements, success criteria
- **M3**: Work breakdown structure decomposition
- **M4**: Implementation plan and risk management

The color scheme maps to the meeting loop:
- **Blue**: Before meeting (agenda planning)
- **Teal**: After meeting (summary output)
- **Amber**: Carried forward (open items needing attention)

---

## Contact

Questions? Reach out to the POC:
- **Chinmay Dhiraj Sangodkar**
- sangodkar.c@northeastern.edu

---

**Ready to deploy?** Follow Steps 1-3 above. Should take about 15 minutes total.
