# RO’Lyfe JUST LISTENING™

A listener-first, mobile-friendly audio lounge for global radio, Hip-Hop and R&B discovery, Caribbean stations, podcasts, artist exploration, and a personal listening shelf.

**Repository:** https://github.com/ROLRichman/rolyfe-just-listening  
**Main page:** `index.html`  
**Style:** `listening.css`  
**Application logic:** `listening.js`

## What visitors can do

- Browse live radio by genre and Caribbean island/region.
- Listen to Hip-Hop, old-school, East Coast, West Coast, Southern rap, drill, R&B, Neo-Soul, reggae, dancehall, soca, kompa/zouk, Afrobeats, lo-fi and smooth jazz stations.
- Discover popular tracks and artists.
- Explore artist biographies, listener statistics, popular albums, top tracks, related artists and catalog counts.
- Search podcasts by host, topic or category and save shows to a personal list.
- Save tracks, albums and podcasts without creating an account, then open saved items directly from the listening shelf.
- Use Atlas as an optional listening guide, with browser speech and optional microphone input.
- Open RO’Lyfe Gaming, Live Sports and other RO’Lyfe destinations from the project menu.
- Keep radio controls visible when supported games enter fullscreen.

## How the mechanics work

### 1. Live radio

The page loads the shared radio player from the RO’Lyfe Gaming repository:

`https://rolrichman.github.io/rolyfe-egaming/shared/radio-player.js`

That shared script mounts a floating radio player on the page. It requests station listings through the `rolyfe-radio-browser` Supabase Edge Function, which acts as the server-side directory connection. The browser receives station metadata and HTTPS stream addresses, then plays the selected broadcaster through an HTML audio element.

The player supports genre and island/region filters, station selection, next station, play/pause, mute and volume. It remembers radio preferences and the last station in browser storage, and now includes a separate Saved Stations shelf plus a **Save current station** action directly below the Play/Next/Mute controls. Visitors can favorite up to 50 station entries, play a favorite after changing genre or island filters, and remove favorites without having to search for them again. Favorites are stored locally in the same browser/device. It attempts a direct secure stream first, then tries a resolved station URL when needed.

Radio stations are independent broadcasters. Availability, stream format, reliability and programming are controlled by each station. Some streams may not work on every browser or device. Mobile browsers may require a user tap before audio can begin.

### 2. Music discovery and artist profiles

The frontend calls the `entertainment-lastfm` Supabase Edge Function for Last.fm discovery data. The server-side function is where the private Last.fm API credential belongs; it must never be placed in this public repository or browser JavaScript.

Last.fm supplies metadata such as popular tracks, artist matches, biographies, listener/play counts, popular albums, top tracks and similar artists. The site links visitors to Spotify and YouTube Music search results for authorized listening. Last.fm metadata is not a music-streaming license and does not provide full track playback here.

### 3. Album and EP catalog counts

The frontend calls the `entertainment-musicbrainz` Supabase Edge Function to look up release-group counts for an artist. MusicBrainz is used for catalog research; its count is not a guarantee of a complete discography. Aliases, collaborations, editions and artist-name matching can affect results.

The backend should serialize MusicBrainz requests to respect its public rate limit. Review MusicBrainz terms before using the data in a commercial product.

### 4. Podcast search

Podcast search currently uses the Apple iTunes Search API from the browser. Results show show artwork, title, publisher and category, with links to the publisher or podcast listing. The current implementation is discovery and bookmarking—not a hosted podcast player. Episode playback can be added later using publisher RSS feeds or an authorized podcast provider.

### 5. My Listening List

Saved tracks, albums and podcasts are stored in the visitor’s browser using `localStorage`. This means guest mode works without registration, but the list is device- and browser-specific. Clearing site data or changing devices can remove or separate saved items. Cloud synchronization and cross-device profiles are future enhancements, not current functionality.

### 6. Atlas listening guide

Atlas currently runs in the browser. It uses speech synthesis for spoken guidance and browser speech recognition when supported and explicitly enabled by the visitor. Microphone access is requested only after the visitor chooses Talk to Atlas.

The ON/OFF preference is stored locally. The Atlas dock stays fixed on screen while the visitor scrolls; the panel opens only when the visitor taps it. The welcome toast dismisses itself, so the page does not unexpectedly open a panel or speak on arrival. Turning Atlas off cancels speech and microphone recognition. Atlas is currently a guided assistant with predefined actions—not a connected, open-ended AI chat model. More natural neural speech and conversational AI require a separate server-side integration with protected credentials.

### 7. RO’Lyfe project navigation

The project dropdown links to RO’Lyfe destinations and source repositories. A source-code link does not guarantee that a project's live deployment is enabled or that the destination is currently healthy. These links should be checked as part of release testing.

## Project structure

This repository is intentionally lightweight and static:

- `index.html` — page structure, sections, navigation and controls.
- `listening.css` — responsive visual system and mobile layout.
- `listening.js` — discovery, artist profiles, podcast search, saved list and Atlas behavior.
- `README.md` — project setup, architecture, mechanics and known limitations.

The radio player is shared from the RO’Lyfe Gaming repository rather than duplicated here. The Last.fm and MusicBrainz integrations run through Supabase Edge Functions.

## Security and content rights

- Keep Last.fm and all other private API secrets in Supabase Edge Function secrets.
- Do not commit service-role keys, private API keys, access tokens or credentials to GitHub.
- A browser-visible Supabase publishable/anon key is not a service-role secret; protect backend data with appropriate access policies and function-side validation.
- Do not copy, host or rebroadcast music or podcast audio without the necessary rights.
- Radio stations and podcast publishers retain control of their own content, streams, availability and advertising.

## Publish with GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select branch `main` and folder `/(root)`.
4. Save and wait for GitHub Pages to finish publishing.

Expected URL:

https://rolrichman.github.io/rolyfe-just-listening/

## Completion checklist

Before calling the release complete, verify:

- [ ] GitHub Pages is enabled and the public URL loads on mobile and desktop.
- [ ] The shared radio-player script loads from the RO’Lyfe Gaming Pages destination.
- [ ] Caribbean island filters return relevant stations; genre filters return sensible results.
- [ ] Radio playback, next, pause, mute, volume and last-station resume work on Android and desktop.
- [ ] Saved Stations can be added, played, removed, and still appear after changing genre/island filters or reloading the page.
- [ ] Last.fm trending and artist search/profile calls return live data through Supabase.
- [ ] MusicBrainz album/EP counts return correctly and handle missing matches gracefully.
- [ ] Podcast search returns shows and the official show links open.
- [ ] Save, follow, remove and refresh persistence work for tracks, albums and podcasts.
- [ ] Atlas ON/OFF, spoken guidance, optional microphone input and Back to Top behave correctly.
- [ ] Project menu destinations are current and mobile navigation does not overflow.
- [ ] No private credentials appear in public source files or browser network requests.

## Known limitations and next enhancements

- No account-based cloud sync for My Listening List or radio favorites yet; saved entries are stored in this browser/device. My Listening List covers discovery tracks, albums and podcasts; the radio player has its own Saved Stations shelf.
- Podcast search currently links to shows; full episode playback is not implemented.
- Last.fm provides discovery metadata, not full music playback.
- Atlas does not yet use a general-purpose AI model or neural voice provider.
- Third-party station streams can be offline, geo-restricted, insecure or unsupported.
- The radio player depends on a separately hosted shared script; both deployments must remain available.

Recommended next improvements are a true unified mini-player state, podcast episode playback through authorized feeds, optional account-backed listening-list sync, richer R&B/Caribbean artist discovery, and a server-side conversational Atlas integration.


## Hip-Hop Vault artist collections and Atlas voice settings

The Hip-Hop Vault groups artist shortcuts into curated collections, with a maximum of 15 quick-pick artists displayed at a time. Visitors can still search any artist directly. The collections include foundational pioneers, East Coast lyricists, groups, West Coast icons, current artists and a dedicated Women Who Move Hip-Hop collection. The requested sequence places Biggie and 2Pac among the first icons, then KRS-One, Slick Rick and Kool G Rap before Locksmith appears in the lyricist collection.

Atlas now exposes the speech voices installed by the visitor's browser/device through a language dropdown, plus a persistent speaking-volume slider. The selected language is also used for browser speech recognition where supported. This changes the voice language and microphone recognition locale; it does not yet provide automatic translation or open-ended multilingual AI responses. Voice availability and quality depend on the operating system/browser and installed speech packs. Full multilingual conversation requires a protected server-side AI integration.


## November 11 listening-lounge updates

- The shared floating radio player now has a separate **Saved Stations** shelf. A heart beside each available station saves or removes it; favorites remain available after changing genres or island filters and after refreshing the page. Up to 50 stations are stored locally per browser/device.
- Saved station playback uses the saved station's secure stream URL when available and can fall back to the station directory's resolver. Third-party streams can still change, become unavailable, or require another tap on mobile.
- Podcast quick searches now include **Leadership**, **Money & Saving**, and **Stop Wasting Money**. Show cards prefer their Apple Podcasts directory page, with publisher and feed links as fallbacks.
- Added **AZ** and **DJ Premier** to the pioneers/architects collection; AZ is also listed among East Coast artists.
- Atlas is aligned with its lower-left dock on mobile. Its panel has a maximum height and its own scroll area so the speech controls remain reachable on shorter screens.
- Radio favorites are separate from **My Listening List**: one is for live station presets; the other is for music discovery and podcast bookmarks.


## Lyrics, lyricists and the expanded sound selector

- The artist directory now includes separate Hip-Hop/Rap lyricists, R&B/Soul songwriters, Reggae/Dancehall storytellers, women lyricists/MCs, and producers/architects, alongside the original era and regional collections. Artist chips remain paged at 15 per screen.
- Trending-track and artist-profile track cards now offer a **Lyrics** link that searches Genius for the exact title and artist. The project links to a licensed lyric destination rather than copying or hosting full copyrighted lyrics.
- The **Your Sound, Your Call** selector is now an expandable in-page panel with Hip-Hop, Old School Hip-Hop, R&B/Soul, Neo-Soul, Reggae, Dancehall, Caribbean, Kompa/Zouk, Afrobeats, Smooth Jazz, Podcasts, and Surprise Me.
- Track cards with a title and artist can be saved to My Listening List. Live radio is different: most station streams do not expose a dependable now-playing song title to the browser, so users can save the station preset. A current radio song can be saved only when a station/provider supplies usable track metadata; that metadata integration is not yet available across all stations.


The current station can be saved directly below **Next** as well as from its heart icon in the available-station list. The floating radio launcher now sits at the lower-right on mobile; Atlas stays at the lower-left, and Back to Top is stacked above Radio instead of overlapping the left-side content.


The floating player is branded **RO’Lyfe Music Stations** in the listening lounge, with its current-station save action directly beneath the main transport controls.


## Expanded chart discovery and conversational Atlas

- Popular & Trending requests 24 Last.fm tracks per page and offers a Load 24 more tracks control. The Last.fm Edge Function has been raised from a 12-item cap to a maximum of 50 per upstream page; the page can continue paging through Last.fm chart pages.
- Added genre chart filters for Old School Hip-Hop, Neo-Soul, Dancehall, Afrobeats, Soca, Kompa/Zouk, Jazz, Rock, Electronic and Latin, alongside Global, Hip-Hop, R&B/Soul, Reggae and Pop.
- Rankings are Last.fm global or genre chart data. A Last.fm popularity chart is discovery metadata, not a guarantee of real-time Spotify stream ranking or licensed playback.
- Atlas has a chat composer and transcript. Typed messages and microphone transcripts use the same conversational route, receive the visitor's selected voice-language instruction, and return a constrained action that the page executes for radio, genre charts, artists, podcasts, saved items and lyricist collections.
- The new rolyfe-atlas Supabase Edge Function calls OpenAI's Responses API server-side. Its OpenAI credential must be stored only as the OPENAI_API_KEY Supabase Edge Function secret. Never put that key in listening.js, HTML, GitHub, or browser storage. If the secret is absent, Atlas displays a clear setup message instead of pretending the model is connected.


### Atlas AI activation

The Atlas conversation Edge Function is deployed as `rolyfe-atlas` and uses the OpenAI Responses API with model `gpt-6.1-terra`. To activate model-backed chat and natural-language voice commands, open the Supabase project for RO’Lyfe JUST LISTENING integrations, go to **Edge Functions → Secrets**, and add:

- Key: `OPENAI_API_KEY`
- Value: the OpenAI API key created in the OpenAI Platform

Save it in Supabase only. Do not paste it into the browser, GitHub, this README, or a chat message. Supabase makes newly saved Edge Function secrets available without a redeploy. If it is not configured, the page displays a setup notice rather than claiming Atlas is using an AI model.


## Playable discovery previews and artist disambiguation

- Trending-chart tracks and artist-profile tracks now have a **Find preview** action. It looks up a matching track in Apple's iTunes Search catalog and, where Apple provides a preview asset, exposes its 30-second promotional audio player with the Apple Music track link beside it. This is a preview sample, not a full-track stream. Full-track playback remains available through the linked listening services.
- Apple promotional preview audio/artwork are displayed in proximity to the Apple Music store link and are used only to promote the corresponding store content, consistent with Apple's Search API guidance.
- Artist search now uses MusicBrainz artist identities and displays the disambiguation comment, type, area and date range before opening a profile. This helps distinguish same-name artists such as Eve (the Philadelphia rapper) from other performers named Eve.
- When an artist identity is selected, its MusicBrainz ID is also sent to Last.fm artist profile, top album, top track and similar-artist lookups, where supported, instead of relying on the name alone.


## Playback transport controls

- The Pick Your Moment area now includes Previous, Play/Pause (or Resume), and Next transport controls wired to the same floating live-radio player.
- The floating RO’Lyfe Music Stations player also includes Previous beside Play, Next and Mute.
- Previous wraps from the first listed station to the last station. The current station index is restored when resuming the remembered station where it is still present in the loaded station list.
- The floating Music Stations panel has more vertical room (up to 82vh/680px on larger displays and 78dvh on mobile) while retaining internal scrolling and safe viewport limits.


## Worldwide radio, station defaults and live catch-up

- The shared radio player requests the Radio Browser country-code catalogue through the Supabase proxy. The country picker retains Caribbean shortcuts and adds an alphabetized worldwide country list; station results are filtered by selected country.
- Added **Country Music** as a station genre, separate from the **Explore by Country** location filter.
- Guests can save a station as **Default**. The default station ID is stored in this browser/device, and the player uses it on first play when no prior last-station resume is available. No account is required.
- Added **30-second rewind**, **30-second forward**, and **Go Live** controls. They activate only if the broadcaster's stream exposes a seekable catch-up/DVR window. Ordinary live-only streams keep them disabled and explain why; the player does not record or silently buffer third-party broadcasts.
- Station favorites and the default station remain device-local. Third-party stations may include their own ads and can change or go offline.


The **Country Music** choice is also available in the Your Sound selector and Popular & Trending chart filters, so the genre remains separate from the Explore by Country station-location menu.


The **Set as Default** button names the actual station (for example, “Set KLM FM as Default”), and the worldwide country menu includes each country's Radio Browser station count where available. The menu accepts country-code and ISO country catalogue response shapes.


## Atlas reads live search and discovery context

Atlas now receives a small, server-validated snapshot of the currently active page section with each chat or voice request. Depending on the active view, this includes:

- **Artist Spotlight:** selected MusicBrainz identity details, Last.fm biography, listeners and plays, MusicBrainz indexed album/EP count and its note, popular albums, top tracks, and related artists.
- **Artist search:** the visible artist matches, disambiguation, type, area, dates and Last.fm listener figures where returned.
- **Popular & Trending:** active chart category, page information, and the loaded track/artist list.
- **Podcast search:** visible show title, publisher, category and release date where supplied by the directory.

The page has one-tap **Read this spotlight**, **Read artist matches**, **Read this chart**, and **Read podcast matches** controls. Atlas also uses the active context when a visitor asks a question in chat or by microphone, so the visitor can ask her to explain what is already on screen.

Atlas receives only fields supplied by the current page/provider response. She is instructed not to invent missing details. Last.fm listeners and plays remain Last.fm metrics; MusicBrainz album/EP totals remain indexed release-group counts, not a promise of a complete discography. Podcast listings do not include episode summaries unless the provider returns them. Context is validated and clipped by the server before being sent to the model; provider text is treated as reference data, not instructions. The OpenAI key remains server-side in the Supabase Edge Function secret.

## Atlas conversation and artist-reader refinements

- The Atlas header's **−** control minimizes the panel instead of ending the conversation. The floating Atlas dock becomes **Return to Atlas** and reopens the existing in-page transcript for the current page session.
- Turning Atlas off remains a separate action; it disables speech and microphone use.
- Added **Read this artist collection** for the currently visible page of curated artist chips. The Atlas service validates and forwards the category, page number and visible artist names.
- Artist-search statistics are now attached by exact MusicBrainz ID when possible, or only by an unambiguous one-to-one artist-name match. This prevents duplicate-name artists from inheriting another performer's Last.fm listener count.
- Artist result cards switch to a single-column layout on narrower displays and allow identity details to wrap cleanly.
- The rolyfe-atlas Edge Function is active at version 3 and accepts the curated artist-collection context. Its OpenAI API key remains server-side in Supabase as OPENAI_API_KEY.
\n\n## Podcast episode playback\n\nPodcast discovery now offers an **Episodes** action for Apple directory results with a collection ID. The page asks the Apple directory for that show’s public feed through the `entertainment-podcast-feed` Supabase Edge Function, then displays up to 20 recent episodes with publisher-hosted HTTPS audio, dates, durations and short descriptions when supplied. Audio is streamed from the publisher; RO’Lyfe does not download, store, rehost or rebroadcast podcast episodes. The player pauses other episode players in the same episode panel. Shows without a secure public RSS feed keep their official directory/publisher link. Feed access is limited to numeric Apple collection IDs, secure public HTTPS feed URLs, bounded redirects, response size and request rate.\n