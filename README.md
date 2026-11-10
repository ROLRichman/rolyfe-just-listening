# RO’Lyfe JUST LISTENING™

A cozy, listener-first audio destination for live radio discovery, trending music metadata, podcasts, a personal Listening List, and a Hip-Hop Vault.

## First experience and Atlas
- A welcome greeting appears about 2–3 seconds after page load.
- Atlas opens after about 5 seconds with spoken guidance and quick listening choices.
- Atlas has an explicit AI ON/OFF control. The preference is saved locally; when OFF, the assistant panel and speech are disabled. The sticky header and floating Atlas control remain available to turn it back ON.
- Atlas uses the best available English browser voice, with tuned speaking speed and pitch. Voice quality depends on the speech engine installed on the visitor's device.
- Optional Talk to Atlas uses browser speech recognition when supported. Microphone permission is requested only after the visitor taps the control.
- The Atlas panel is fixed to the viewport and remains in position while the visitor scrolls. A Back to Top control appears after scrolling down.
- Visitors can browse as guests; no account is required.

## Listening features
- Live Radio reuses the RO’Lyfe Gaming Radio player and Radio Browser-backed station directory.
- Popular & Trending uses Last.fm discovery metadata with Spotify and YouTube Music search links.
- Podcast Lounge searches podcast listings and links to the show/publisher.
- My Listening List stores saved tracks, albums and podcasts in the current browser.
- Listen While You Play links to RO’Lyfe Gaming and the Live Sports Center.

## Hip-Hop Vault
A starter collection includes Nas, KRS-One, Kendrick Lamar, JID, J. Cole, Jeru the Damaja, Brand Nubian, Gang Starr, Pete Rock, Redman, Keith Murray, Erick Sermon, O.C., Slick Rick, D-Nice, Rakim, Kool G Rap, Scarface, Special Ed, Cocoa Brovaz, OGC, Buckshot, Boot Camp Clik, Black Thought, Sa-Roc, Mos Def / Yasiin Bey, and more searchable artists.

The existing Last.fm Edge Function supplies artist search, artist profiles, similar artists, popular tracks and popular albums. The new `entertainment-musicbrainz` Supabase Edge Function looks up album/EP release-group counts by artist MusicBrainz ID or name. MusicBrainz requests are serialized to respect its public one-request-per-second service limit.

Album counts are catalog counts, not a promise that every edition, alias or collaboration has been matched. Popular albums from Last.fm are a popularity list, not necessarily a complete discography.

## Project directory
The RO’Lyfe Projects dropdown includes direct destinations and links to all 47 repositories accessible to the connected GitHub account at the time it was built. The list is grouped by markets/scanners/trading, property/capital/deals, business/education/labs, and other projects. It includes direct links to the Live Sports Center, Scanner Desk, Scanner Hub, Chart Wars and Market Terminal.

Repository links are source-code links. A repository existing on GitHub does not by itself mean its GitHub Pages deployment is enabled or that the project is complete.

## Playback, voice and rights
Last.fm provides discovery metadata, not full track playback. Selected tracks therefore link to authorized listening services rather than being copied or streamed by this site. Radio stations are independent broadcasters and may include their own programming, sponsorships or advertising. Station availability and audio formats vary.

Atlas currently uses the browser's speech synthesis and speech-recognition features. The site does not currently call a neural text-to-speech provider or a general-purpose chat model. For more human-like neural speech and fully open-ended conversation, a server-side AI/TTS provider and its protected API credential would be a separate integration. Do not place an OpenAI, ElevenLabs, Last.fm or other private secret in this public repository.

Podcast listings link to their publisher or directory; they do not imply ownership or hosting. Do not rehost or rebroadcast music or podcast audio without the necessary rights.

MusicBrainz offers its API without an API key for non-commercial use, requires an identifiable User-Agent and limits clients to one request per second. Check MusicBrainz commercial terms before using this data in a monetized product.

## GitHub Pages
Repository: https://github.com/ROLRichman/rolyfe-just-listening

In repository Settings → Pages, choose Deploy from a branch, select main and /(root), then Save.

Expected public URL:
https://rolrichman.github.io/rolyfe-just-listening/

## Current limitations
- Saved items remain in this browser on this device; there is no account sync yet.
- Podcast search shows listings and official show links; full episode playback integration can be added through publisher RSS feeds or an authorized podcast provider.
- Browser autoplay restrictions may require visitors to tap Play before radio audio begins.
- Atlas spoken voice is limited to the voices supplied by the browser/device until a neural TTS service is connected.
- The MusicBrainz function is deployed, but its live response and artist counts still need browser-side testing after GitHub Pages is enabled.
