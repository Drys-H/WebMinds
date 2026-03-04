# WebMinds - Online Recipe Sharing Platform

## Project Overview
WebMinds is a web application for sharing, rating, and categorising recipes. Users can:
- Create accounts and manage profiles
- Upload recipes with photos
- Comment, like, and save recipes
- Generate smart shopping lists that combine ingredients
- Filter recipes by diet (vegan, keto, high protein) and ingredients

**Project Aim:** Build a responsive, mobile-friendly recipe platform that allows users to explore, share, and plan meals efficiently.  

**Objectives:**
- Implement CRUD operations for recipes
- Create intuitive search and filtering by diet or ingredients
- Allow photo uploads and recipe categorisation
- Provide a combined shopping list feature
- Ensure the app is responsive and user-friendly

## Team 

- 4314797(Front-end/Trello)
- 3810826 (Front-end/UX)
- 4321793(Backend/DB)
- 4325364(Backend/Lead)

## Getting Started
1. Clone the repo localy:
    - git clone https://github.com/Drys-H/WebMinds.git
2. Create branch:
    - git checkout -b feature/your-feature-name
3. Commit & push :
    - git add .
    - git commit -m "Short descriptive message"
    - git push origin feature/your-feature-name

## Branching Strategy
- main → stable code, always deployable
- develop → integration of all features before merging to main
- feature/ → separate branches for each feature (e.g., feature/recipes-crud)

# Git Workflow

## Setup
git clone <repo-url>
cd <repo-folder>

## Start Working
git checkout main
git pull origin main
git checkout -b feature-name

## Work
git status
git add .
git commit -m "Describe your change"
git push -u origin feature-name

## Pull Request
1. Go to GitHub
2. Compare & Pull Request
3. Base → main
4. Review & Merge

## After Merge
git checkout main
git pull origin main
git branch -d feature-name

## Rules
- Never work directly on main
- Always create a feature branch
- Always pull before starting work
- Use pull requests for merging

## Sprint Board
All tasks will be tracked on Trello:
  - Backlog
  - To Do
  - Working On
  - Testing
  - Done
    
Link to Trello: [Trello Board](https://trello.com/b/36t5V6gn/webminds)

## Contribution Guidelines

- Commit often with descriptive messages
- Push to your feature branch only
- Create pull requests to develop when feature is complete
- Review teammates’ PRs before merging

