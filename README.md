# GitFull: AI-Powered GitHub Repository Summarizer
![thumbnail](./public/assets/landingPage-13511b32-52ca-42d5-80c8-0f509539a315)

## 🗂️ Description

GitFull is a web application designed to simplify the process of creating and managing GitHub repository READMEs. It uses AI-powered summarization to generate high-quality README content from repository code files. The application is built for developers, repository owners, and contributors who want to create engaging and informative READMEs without spending too much time.

The application integrates with GitHub APIs to fetch repository data, generate summaries, and push changes back to the repository. It also features a user-friendly interface for editing and previewing README content.

## ✨ Key Features

### Core Features

* **AI-Powered Summarization**: Generates high-quality README content from repository code files using Groq API
* **GitHub Integration**: Integrates with GitHub APIs to fetch repository data, generate summaries, and push changes
* **README Editor**: A user-friendly interface for editing and previewing README content

### User Interface

* **Dashboard**: Displays repository information, including owner details, repository description, language breakdown, and file analysis progress
* **Tab Bar**: A navigation menu that allows users to switch between different screens
* **Social Cards**: Displays repository information in a visually appealing format

### Technology Integration

* **NextAuth**: Handles authentication and authorization with GitHub
* **MongoDB**: Stores repository data and user information
* **Tailwind CSS**: A utility-first CSS framework for styling the application

## 🗂️ Folder Structure

```mermaid
graph TD;
  src-->app;
  src-->components;
  src-->lib;
  app-->actions;
  app-->api;
  app-->pages;
  components-->socialCards;
  components-->readmeEditor;
  lib-->utils;
  lib-->mongodb;
```

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000?logo=next.js&logoColor=white&style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?logo=typescript&logoColor=white&style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?logo=mongodb&logoColor=white&style=for-the-badge)
![PostCSS](https://img.shields.io/badge/PostCSS-DD27B3?logo=postcss&logoColor=white&style=for-the-badge)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwind-css&logoColor=white&style=for-the-badge)

## ⚙️ Setup Instructions

To run the project locally, follow these steps:

* Clone the repository: `git clone https://github.com/abhraneeldhar7/gitfull.git`
* Install dependencies: `npm install` or `yarn install`
* Start the development server: `npm run dev` or `yarn dev`

## GitHub Actions

The repository uses GitHub Actions to automate various tasks, such as:

* **Build and Deploy**: Builds and deploys the application to a production environment
* **Code Quality**: Runs code quality checks, including linting and type checking

Note: GitHub Actions workflows are defined in the `.github/workflows` directory.



<br><br>
<div align="center">
<img src="https://avatars.githubusercontent.com/u/89008279?v=4" width="120" />
<h3>Abhra the Neel</h3>
<p>Full-stack developer with expertise in web, Android, and server-side development. Most projects are private due to being production code.</p>
</div>
<br>
<p align="right">
<img src="https://gitfull.vercel.app/appLogo.png" width="20"/>  <a href="https://gitfull.vercel.app">Made by GitFull</a>
</p>
    