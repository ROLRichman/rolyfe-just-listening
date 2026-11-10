# RO’Lyfe JUST LISTENING™

A cozy, listener-first audio destination for live radio discovery, trending music metadata, podcasts and a personal Listening List.

## First experience
- A welcome greeting appears about 2–3 seconds after page load.
- Atlas opens after about 5 seconds with spoken guidance and three quick choices: Next, Popular & Trending, and Pick a Track.
- Atlas speaks through the browser's speech synthesis engine. Visitors can tap Speak to hear the message again.
- Optional Talk to Atlas uses browser speech recognition when supported. Microphone permission is requested only after the visitor taps the control.
- Visitors can browse as guests; no account is required.

## Features
- Live Radio reuses the RO’Lyfe Gaming Radio player and Radio Browser-backed station directory.
- Popular & Trending uses Last.fm discovery metadata with Spotify and YouTube Music search links.
- Podcast Lounge uses podcast search listings and links to the show/publisher.
- My Listening List stores saved tracks and podcasts in the current browser.
- Listen While You Play links to RO’Lyfe Gaming and the Live Sports Center.

## Playback and rights
Last.fm provides music discovery metadata, not full track playback. Selected tracks therefore link to official listening services rather than being copied or streamed by this site. Radio stations are independent broadcasters and may include their own programming, sponsorships or advertising. Station availability and audio formats vary.

The shared radio player is loaded from the public RO’Lyfe Gaming repository. Browser autoplay restrictions may require visitors to tap Play before sound begins. Atlas voice is attempted automatically, but a browser may require a tap on Speak before audible speech works. Voice input is opt-in and depends on browser speech recognition support and microphone permission.

Podcast listings do not imply ownership or hosting of the shows. Do not rehost or rebroadcast music or podcast audio without the necessary rights.

## GitHub Pages
Repository: ROLRichman/rolyfe-just-listening

In repository Settings → Pages, choose Deploy from a branch, select main and /(root), then Save.

Expected public URL:
https://rolrichman.github.io/rolyfe-just-listening/

## Current limitations
- Saved items remain in this browser on this device; there is no account sync yet.
- Podcast search shows listings and official show links; full episode playback integration can be added through publisher RSS feeds or an authorized podcast provider.
- A new page load may require an interaction before radio or spoken audio can play.
