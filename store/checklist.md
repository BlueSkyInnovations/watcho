# App Store Connect — Setup Checklist

Work through these sections in order. All text is in `store/en-US/listing.txt` and `store/de-DE/listing.txt`.

---

## Before you start

- [ ] Enable GitHub Pages so the privacy policy URL works:
  - Repo → **Settings → Pages → Source: Deploy from branch → Branch: main → Folder: /docs**
  - After saving, the privacy policy will be live at:
    `https://blueskyinnovations.github.io/watcho/privacy-policy.html`
  - Wait ~2 minutes and confirm the URL loads before proceeding

---

## App Information (applies to all versions)

- [ ] **Name**: watcho
- [ ] **Subtitle**: Movies & TV, privately tracked
- [ ] **Primary Language**: English
- [ ] **Bundle ID**: de.blueskyinnovations.watcho *(already set by EAS)*
- [ ] **Primary Category**: Entertainment
- [ ] **Secondary Category**: Productivity
- [ ] **Content Rights**: "This app does not contain, show, or access third-party content" — leave unchecked; it does use TMDB data under their API terms
- [ ] **Age Rating**: complete the questionnaire using `store/age-rating.txt` → result: **4+**
- [ ] **Privacy Policy URL**: `https://blueskyinnovations.github.io/watcho/privacy-policy.html`

---

## Pricing and Availability

- [ ] **Price**: Free
- [ ] **Availability**: All territories (or restrict as desired)
- [ ] **Pre-order**: No

---

## App Privacy (Data collection questionnaire)

- [ ] "Do you collect data from this app?" → **No** — watcho collects no user data
- [ ] Note: TMDB API requests are user-initiated content lookups, not data collection by the developer

---

## Version 1.0 — iOS App (English listing)

- [ ] **Screenshots**: 6.9" (iPhone 16 Pro Max), 6.5" (iPhone 14 Plus or 11 Pro Max), iPad Pro 13" if supporting iPad — minimum required sizes, others are optional
- [ ] **App Previews**: Optional — skip for now
- [ ] **Promotional Text**: paste from `store/en-US/listing.txt`
- [ ] **Description**: paste from `store/en-US/listing.txt`
- [ ] **Keywords**: paste from `store/en-US/listing.txt`
- [ ] **Support URL**: `https://github.com/BlueSkyInnovations/watcho/issues`
- [ ] **Marketing URL**: `https://github.com/BlueSkyInnovations/watcho`
- [ ] **What's New**: paste from `store/en-US/listing.txt`

### Add German localisation (de-DE)
- [ ] Click **+ Add Localization → German**
- [ ] Fill in all fields from `store/de-DE/listing.txt`
- [ ] Add German screenshots (or reuse English ones — Apple allows it)

---

## Version 1.0 — Build

- [ ] Select the build uploaded via EAS (highest build number available)
- [ ] **Copyright**: © 2026 Blue Sky Innovations GmbH
- [ ] **Version**: 1.0.0 *(must match `version` in app.json)*

---

## Version 1.0 — App Review Information

- [ ] Fill in contact details and notes from `store/review-notes.txt`
- [ ] **Sign-in Required**: No
- [ ] **Notes**: paste from `store/review-notes.txt` (and add your TMDB API key + phone number)

---

## Submit

- [ ] Click **Add for Review**
- [ ] Choose **Manually release this version** (recommended for first release — gives you control over timing)
- [ ] Click **Submit to App Review**

---

## After approval

- [ ] Set release date or click **Release** manually
- [ ] Monitor for any follow-up questions from Apple Review (email notification)
