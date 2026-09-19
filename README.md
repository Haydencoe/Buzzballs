# 💕 Abi's BuzzBall Fun Night

A mobile-friendly BuzzBall voting app for Abi's girls night.

## Flavours

1. Espresso Martini
2. Choc Tease
3. Goaaaaaaal Melon
4. Strawberry Rita
5. Forbidden Apple
6. Lime Rita
7. Passionfruit Martini
8. Berry Cherry Limeade
9. Chilli Mango

## How it works

The front end is hosted on GitHub Pages. Firebase Firestore stores the shared votes so everyone can vote from their own phone and the results page can show the combined results.

## Setup

### 1. Create a Firebase project

Go to Firebase Console and create a project.

Create a **Web App** inside the project and copy the Firebase configuration.

Open `firebase-config.js` and replace every `PASTE_...` value with your real Firebase config.

### 2. Create Firestore

In Firebase Console:

**Build → Firestore Database → Create database**

You can start in production mode.

Then open Firestore **Rules** and use the rules in `firebase.rules`.

### 3. Put the files on GitHub

Create a GitHub repository and upload:

- index.html
- vote.html
- results.html
- style.css
- app.js
- results.js
- firebase-config.js

You can keep README.md too.

### 4. Turn on GitHub Pages

On GitHub:

**Settings → Pages → Build and deployment**

Choose:

**Deploy from a branch**

Then choose:

**main** and **/(root)**

Save.

GitHub will give you your Pages URL.

## Important note

This version intentionally allows anyone who has the site link to submit a vote. It is designed for a small private girls night rather than a public competition.

For a stronger private setup, you could add a simple event PIN/password or Firebase Authentication.
