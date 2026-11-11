(()=>{
"use strict";
const LASTFM_API="https://nzduinxmsmmdbonefifi.supabase.co/functions/v1/entertainment-lastfm";
const ATLAS_API="https://nzduinxmsmmdbonefifi.supabase.co/functions/v1/rolyfe-atlas";
const TRENDING_PAGE_SIZE=24;
const MB_API="https://nzduinxmsmmdbonefifi.supabase.co/functions/v1/entertainment-musicbrainz";
const SAVED_KEY="rolyfeJustListening.saved.v1";
const AI_KEY="rolyfeJustListening.atlasEnabled.v1";
const $=id=>document.getElementById(id);
const state={
  trend:"all",tracks:[],trackPage:1,trackPages:1,trackLoading:false,saved:readSaved(),artistGeneration:0,
  aiEnabled:readAIEnabled(),recognition:null,lastSpeech:"",atlasHistory:[],atlasBusy:false,
  preferredVoice:null,currentArtist:null,voiceVolume:65,voiceLanguage:"en-US",artistPickPage:0
};
const ARTIST_COLLECTIONS={
  headliners:["The Notorious B.I.G.","2Pac","Nas","Jay-Z","Big Pun","Fat Joe","Dr. Dre","Eminem","Snoop Dogg","Ice Cube","Lil Wayne","Andre 3000","LL Cool J","Beanie Sigel","Jadakiss"],
  pioneers:["Grandmaster Flash","KRS-One","Slick Rick","Kool G Rap","Rakim","AZ","DJ Premier","Doug E. Fresh","Biz Markie","Roxanne Shanté","MC Lyte","Marley B","Marley Marl","D-Nice","Special Ed","Queen Latifah","Big Daddy Kane","Eric B. & Rakim"],
  east:["Jadakiss","The LOX","Styles P","Mobb Deep","Capone-N-Noreaga","Joey Bada$","Nas","AZ","Mic Geronimo","Group Home","Lost Boyz","Keith Murray","Redman","Papoose","RJ Payne","Locksmith"],
  groups:["The Roots","The Pharcyde","Das EFX","Group Home","Lost Boyz","Gang Starr","Brand Nubian","Boot Camp Clik","A Tribe Called Quest","De La Soul","Black Star","The Fugees","OutKast","Cocoa Brovaz","EPMD"],
  west:["Dr. Dre","Eminem","Snoop Dogg","Ice Cube","Kendrick Lamar","D Smoke","Dizzy Wright","Too Short","E-40","The Lady of Rage","Ras Kass","Xzibit","Warren G","Kurupt","The Game"],
  modern:["Locksmith","RJ Payne","D Smoke","Dizzy Wright","Papoose","Dave East","Russ","Joey Bada$","JID","Kendrick Lamar","J. Cole","Black Thought","Sa-Roc","Little Simz","Rapsody"],
  women:["Eve","Sa-Roc","MC Lyte","Roxanne Shanté","Queen Latifah","Lauryn Hill","Rah Digga","Jean Grae","Rapsody","Lady of Rage","Remy Ma","Foxy Brown","Bahamadia","Monie Love","Ladybug Mecca","Noname","Che Noir","Snow Tha Product","Little Simz","Tierra Whack","Doechii","Megan Thee Stallion","Missy Elliott","Nicki Minaj"],
  rap_lyricists:["KRS-One","Slick Rick","Kool G Rap","Rakim","Nas","The Notorious B.I.G.","2Pac","AZ","Big Daddy Kane","Black Thought","Andre 3000","Eminem","Lupe Fiasco","Papoose","Locksmith","RJ Payne","Jadakiss","Styles P","Pharoahe Monch","Royce da 5'9\"","R.A. the Rugged Man","Brother Ali","Masta Ace","Common","Mos Def"],
  rnb_songwriters:["Stevie Wonder","Prince","Sade","D'Angelo","Erykah Badu","Jill Scott","Lauryn Hill","Maxwell","Alicia Keys","Mary J. Blige","Babyface","Smokey Robinson","Marvin Gaye","Curtis Mayfield","Raphael Saadiq","India.Arie","H.E.R.","Frank Ocean","The Weeknd","Miguel","Anderson .Paak","Brandy","Toni Braxton","Keri Hilson","Ne-Yo"],
  reggae_dancehall:["Bob Marley","Peter Tosh","Burning Spear","Beres Hammond","Buju Banton","Damian Marley","Stephen Marley","Chronixx","Protoje","Koffee","Vybz Kartel","Bounty Killer","Beenie Man","Shabba Ranks","Capleton","Sizzla","Toots and the Maytals","Gregory Isaacs","Dennis Brown","Sean Paul","Tarrus Riley","Jah Cure","Mavado","Popcaan","Shenseea"],
  producers:["DJ Premier","Marley Marl","Dr. Dre","Pete Rock","J Dilla","RZA","Q-Tip","Large Professor","Madlib","The Alchemist","Just Blaze","No I.D.","Pharrell Williams","Timbaland","Kanye West","9th Wonder","DJ Khaled","Swizz Beatz","Prince Paul","Easy Mo Bee"]
};
const STARTER_ARTISTS=Object.values(ARTIST_COLLECTIONS).flat();
function readSaved(){try{const x=JSON.parse(localStorage.getItem(SAVED_KEY)||"[]");return Array.isArray(x)?x:[]}catch(_){return[]}}
function readAIEnabled(){try{return localStorage.getItem(AI_KEY)!=="false"}catch(_){return true}}
function safe(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function stripHTML(value){return String(value||"").replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&#39;/g,"'").replace(/\s+/g," ").trim();}
function number(value){const n=Number(value||0);return n? n.toLocaleString("en-US"):"—";}
function asArray(value){if(!value)return[];return Array.isArray(value)?value:[value];}
function imageUrl(item){
  const images=asArray(item?.image);
  const preferred=images.find(x=>x?.size==="extralarge")||images.find(x=>x?.size==="large")||images[images.length-1];
  return preferred?.["#text"]||preferred?.url||"";
}
function openLinkSearch(type,name,artist){
  const q=encodeURIComponent([name,artist].filter(Boolean).join(" "));
  return type==="youtube"?"https://music.youtube.com/search?q="+q:"https://open.spotify.com/search/"+q;
}
function lyricsSearchLink(name,artist){
  return "https://genius.com/search?q="+encodeURIComponent([name,artist].filter(Boolean).join(" "));
}
function readVoices(){
  if(!("speechSynthesis" in window))return;
  const voices=window.speechSynthesis.getVoices()||[];
  const select=$("atlasLanguage");
  if(select){
    const current=state.voiceLanguage||"en-US";
    const langs=[...new Set(voices.map(v=>v.lang).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
    if(langs.length){
      const labels=langs.map(lang=>{
        const voice=voices.find(v=>v.lang===lang);
        const languageName=(typeof Intl!=="undefined"&&Intl.DisplayNames)?new Intl.DisplayNames(["en"],{type:"language"}).of(lang.split("-")[0]):lang;
        return {lang,label:(languageName||lang)+" · "+lang,voice:voice?.name||""};
      });
      select.innerHTML=labels.map(item=>'<option value="'+safe(item.lang)+'">'+safe(item.label)+'</option>').join("");
      if(langs.includes(current))select.value=current;
      else if(langs.includes("en-US"))select.value="en-US";
      state.voiceLanguage=select.value;
    }
  }
  const chosen=voices.filter(v=>v.lang===state.voiceLanguage);
  state.preferredVoice=chosen.find(v=>/natural|enhanced|premium|google/i.test(v.name))||chosen[0]||voices[0]||null;
}
if("speechSynthesis" in window){
  readVoices();
  window.speechSynthesis.addEventListener?.("voiceschanged",readVoices);
}
function setVoiceStatus(text){if($("voiceStatus"))$("voiceStatus").textContent=text;}
function say(text){
  state.lastSpeech=text;
  if(!state.aiEnabled)return;
  if(!("speechSynthesis" in window)){setVoiceStatus("Speech voice unavailable on this browser.");return;}
  try{
    readVoices();
    window.speechSynthesis.cancel();
    const utterance=new SpeechSynthesisUtterance(text);
    utterance.lang=state.preferredVoice?.lang||"en-US";
    if(state.preferredVoice)utterance.voice=state.preferredVoice;
    utterance.rate=0.96;
    utterance.pitch=1.0;
    utterance.volume=Math.max(0,Math.min(1,state.voiceVolume/100));
    utterance.onstart=()=>setVoiceStatus("Atlas is speaking…");
    utterance.onend=()=>setVoiceStatus("Ready when you are");
    utterance.onerror=()=>setVoiceStatus("Tap Speak to hear Atlas");
    window.speechSynthesis.speak(utterance);
  }catch(_){setVoiceStatus("Tap Speak to hear Atlas");}
}
function setAtlasMessage(text,speak=false){
  if($("atlasMessage"))$("atlasMessage").textContent=text;
  if(speak&&state.aiEnabled)say(text);
}
function setAIEnabled(enabled){
  state.aiEnabled=Boolean(enabled);
  try{localStorage.setItem(AI_KEY,String(state.aiEnabled));}catch(_){}
  const label=state.aiEnabled?"✦ Atlas ON":"✦ Atlas OFF";
  if($("atlasToggle")){$("atlasToggle").textContent=label;$("atlasToggle").setAttribute("aria-pressed",String(state.aiEnabled));}
  if($("atlasDock")){$("atlasDock").textContent=label;$("atlasDock").classList.toggle("off",!state.aiEnabled);}
  if($("atlasPower")){$("atlasPower").textContent=state.aiEnabled?"AI ON · Turn off":"AI OFF · Turn on";$("atlasPower").classList.toggle("off",!state.aiEnabled);$("atlasPower").setAttribute("aria-pressed",String(state.aiEnabled));}
  if(!state.aiEnabled){
    try{window.speechSynthesis?.cancel();}catch(_){}
    if(state.recognition){try{state.recognition.stop();}catch(_){}state.recognition=null;}
    closeAtlas();
    setVoiceStatus("Atlas is off");
  }else{
    setVoiceStatus("Atlas is on · voice ready");
  }
}
function openAtlas(open=true){
  if(open&&!state.aiEnabled)return;
  $("atlasPanel").classList.toggle("open",open);
  $("atlasPanel").setAttribute("aria-hidden",String(!open));
  $("atlasToggle")?.setAttribute("aria-expanded",String(open));
  $("atlasDock")?.setAttribute("aria-expanded",String(open));
}
function closeAtlas(){
  $("atlasPanel")?.classList.remove("open");
  $("atlasPanel")?.setAttribute("aria-hidden","true");
  $("atlasToggle")?.setAttribute("aria-expanded","false");
  $("atlasDock")?.setAttribute("aria-expanded","false");
}
function toggleAtlas(){
  if(!state.aiEnabled){setAIEnabled(true);openAtlas(true);setAtlasMessage("Atlas is back. I'm ready to help you find your next sound.",true);return;}
  openAtlas(!$("atlasPanel").classList.contains("open"));
}
function radio(id){return document.getElementById(id);}
function launchRadio(genre){
  const launch=radio("rolRadioLauncher"),panel=radio("rolRadioPanel");
  if(launch&&(!panel||!panel.classList.contains("open")))launch.click();
  const select=radio("rolRadioGenre");
  const map={"hip-hop":"hip-hop","old-school-hip-hop":"old-school-hip-hop","r&b":"rnb","neo-soul":"neo-soul","reggae":"reggae","dancehall":"dancehall","smooth jazz":"smooth-jazz","caribbean":"caribbean","kompa-zouk":"kompa-zouk","afrobeats":"afrobeats"};
  const wanted=map[String(genre||"").toLowerCase()];
  if(select&&wanted&&select.value!==wanted){select.value=wanted;select.dispatchEvent(new Event("change",{bubbles:true}));}
}
function act(action){
  if(action==="next"){
    const next=radio("rolRadioNext");
    if(next){next.click();setAtlasMessage("I'm moving to the next station in the live radio list. It may take a moment to connect.",true);}
    else{launchRadio();setAtlasMessage("Your live radio panel is open. Choose a station and press Play to start the music.",true);}
  }else if(action==="trending"){
    $("discover").scrollIntoView({behavior:"smooth"});
    loadTrending(state.trend);
    setAtlasMessage("Let's check the popular and trending shelf. You'll find artist and track discovery here, with links to authorized listening services.",true);
  }else if(action==="pick"){
    const menu=$("moodMenu");
    if(menu){menu.open=true;menu.scrollIntoView({behavior:"smooth",block:"center"});}
    setAtlasMessage("What sounds good today? Choose a genre, browse podcasts, or let me surprise you.",true);
  }
}
function saved(key){return state.saved.some(item=>item.key===key);}
function persistSaved(){try{localStorage.setItem(SAVED_KEY,JSON.stringify(state.saved));}catch(_){setAtlasMessage("I couldn't save that on this device. Your browser storage may be full or disabled.");}}
function addSaved(item){
  const existed=saved(item.key);
  state.saved=state.saved.filter(x=>x.key!==item.key);
  if(!existed)state.saved.unshift({...item,savedAt:Date.now()});
  state.saved=state.saved.slice(0,150);
  persistSaved();renderSaved();renderTracks();renderArtistProfileButtons();
}
function safeHref(value){
  try{
    const url=new URL(String(value||""),window.location.origin);
    return url.protocol==="https:"||url.protocol==="http:"?url.href:"";
  }catch(_){return "";}
}
function renderSaved(){
  $("savedCount").textContent=state.saved.length+" saved";
  $("savedList").innerHTML=state.saved.length?state.saved.map(item=>{
    const href=safeHref(item.url);
    const open=href?'<a class="mini" target="_blank" rel="noopener noreferrer" href="'+safe(href)+'">Open ↗</a>':"";
    return '<div class="saved-row"><span class="track-icon">'+(item.type==="podcast"?"🎙":item.type==="album"?"💿":"♫")+'</span><div class="saved-copy"><strong>'+safe(item.title)+'</strong><small>'+safe(item.subtitle||item.type)+'</small></div><div class="saved-actions">'+open+'<button type="button" data-remove="'+safe(item.key)+'">Remove</button></div></div>';
  }).join(""):'<p class="fine">Your list is waiting for its first favorite. Tap Save or Follow on an item.</p>';
}
function trackKey(track){return "track:"+String(track.name||"").toLowerCase()+"|"+String(track.artist||"").toLowerCase();}
function renderTracks(){
  $("trendingGrid").innerHTML=state.tracks.length?state.tracks.map((track,index)=>{
    const key=trackKey(track),isSaved=saved(key);
    return '<article class="track-card"><div class="track-top"><span class="track-icon">♫</span><span class="rank">#'+(index+1)+'</span></div><h3>'+safe(track.name)+'</h3><p class="muted">'+safe(track.artist||"Artist")+'</p><div class="actions"><a class="mini" target="_blank" rel="noopener noreferrer" href="'+safe(openLinkSearch("spotify",track.name,track.artist))+'">Spotify ↗</a><a class="mini" target="_blank" rel="noopener noreferrer" href="'+safe(openLinkSearch("youtube",track.name,track.artist))+'">YouTube Music ↗</a><a class="mini" target="_blank" rel="noopener noreferrer" href="'+safe(lyricsSearchLink(track.name,track.artist))+'">Lyrics ↗</a><button class="mini '+(isSaved?"saved":"")+'" type="button" data-save-track="'+index+'">'+(isSaved?"♥ Saved":"♡ Save")+'</button></div></article>';
  }).join(""):'<div class="empty">No tracks loaded. Try Refresh or choose another genre.</div>';
  const more=$("loadMoreTracks");
  if(more){
    more.hidden=!state.tracks.length||state.trackPage>=state.trackPages;
    more.disabled=state.trackLoading;
    more.textContent=state.trackLoading?"Loading more…":"Load 24 more tracks ↓";
  }
}
async function lastfm(method,extra={}){
  const params=new URLSearchParams({method,limit:String(TRENDING_PAGE_SIZE),...extra});
  const response=await fetch(LASTFM_API+"?"+params.toString(),{headers:{Accept:"application/json"}});
  const body=await response.json();
  if(!response.ok||body.error)throw new Error(body.error||"Last.fm discovery is temporarily unavailable.");
  return body.data||{};
}
async function loadTrending(tag=state.trend,append=false){
  if(state.trackLoading)return;
  state.trend=tag;
  if(!append){state.trackPage=1;state.trackPages=1;state.tracks=[];}
  else state.trackPage=Math.min(10,state.trackPage+1);
  const page=state.trackPage;
  document.querySelectorAll("[data-trend]").forEach(button=>button.classList.toggle("selected",button.dataset.trend===tag));
  state.trackLoading=true;
  if(!append)$("trendingGrid").innerHTML='<div class="empty">Finding your listening picks…</div>';
  if($("loadMoreTracks")){$("loadMoreTracks").disabled=true;$("loadMoreTracks").textContent="Loading more…";}
  try{
    const query={limit:String(TRENDING_PAGE_SIZE),page:String(page)};
    const payload=tag==="all"?await lastfm("chart.getTopTracks",query):await lastfm("tag.getTopTracks",{...query,tag});
    const root=payload.tracks||payload.toptracks||{};
    const list=asArray(root.track).map(item=>({name:item.name,artist:typeof item.artist==="string"?item.artist:item.artist?.name||""})).filter(item=>item.name);
    const seen=new Set(state.tracks.map(track=>trackKey(track)));
    const fresh=list.filter(track=>!seen.has(trackKey(track)));
    state.tracks=append?[...state.tracks,...fresh]:fresh;
    const totalPages=Number(root["@attr"]?.totalPages||root["@attr"]?.totalpages||0);
    state.trackPages=totalPages?Math.min(10,totalPages):(list.length>=TRENDING_PAGE_SIZE?10:page);
    if(append&&!fresh.length)state.trackPages=page;
    renderTracks();
  }catch(error){
    if(!append)state.tracks=[];
    renderTracks();
    $("trendingGrid").insertAdjacentHTML("beforeend",'<div class="empty">'+safe(error.message)+' Try Refresh or choose another chart.</div>');
  }finally{
    state.trackLoading=false;
    renderTracks();
  }
}
async function searchPodcasts(term){
  if(!String(term||"").trim())return;
  $("podcastGrid").innerHTML='<div class="empty">Searching podcast listings…</div>';
  try{
    const query=new URLSearchParams({term:String(term).trim(),media:"podcast",entity:"podcast",limit:"12"});
    const response=await fetch("https://itunes.apple.com/search?"+query.toString(),{headers:{Accept:"application/json"}});
    if(!response.ok)throw new Error("Podcast directory did not respond.");
    const data=await response.json(),items=data.results||[];
    if(!items.length){$("podcastGrid").innerHTML='<div class="empty">No shows found. Try another topic or host.</div>';return;}
    $("podcastGrid").innerHTML=items.map(show=>{
      const key="podcast:"+show.collectionId,url=show.collectionViewUrl||(show.collectionId?"https://podcasts.apple.com/podcast/id"+show.collectionId:"")||show.artistViewUrl||show.feedUrl||"#",openLabel=show.collectionViewUrl||show.collectionId?"Open show directory ↗":show.artistViewUrl?"Visit publisher ↗":"Open show feed ↗",isSaved=saved(key);
      const savedItem=encodeURIComponent(JSON.stringify({key,title:show.collectionName||"Podcast",subtitle:show.artistName||"Publisher",type:"podcast",url}));
      const art=show.artworkUrl100?'<img class="pod-art" loading="lazy" src="'+safe(show.artworkUrl100)+'" alt="">':'<div class="pod-art">🎙</div>';
      return '<article class="pod-card">'+art+'<div class="pod-info"><h3>'+safe(show.collectionName||"Podcast")+'</h3><p class="muted">'+safe(show.artistName||"Publisher")+(show.primaryGenreName?" · "+safe(show.primaryGenreName):"")+'</p></div><div class="actions"><a class="mini" target="_blank" rel="noopener noreferrer" href="'+safe(url)+'">'+openLabel+'</a><button class="mini '+(isSaved?"saved":"")+'" type="button" data-save-pod="'+savedItem+'">'+(isSaved?"♥ Saved":"♡ Follow")+'</button></div></article>';
    }).join("");
  }catch(error){$("podcastGrid").innerHTML='<div class="empty">'+safe(error.message)+'</div>';}
}

/* Artist discovery uses the existing Last.fm Edge Function. */
function initArtistPicks(){
  const category=$("artistCategory")?.value||"headliners";
  const all=ARTIST_COLLECTIONS[category]||ARTIST_COLLECTIONS.headliners;
  const pages=Math.max(1,Math.ceil(all.length/15));
  state.artistPickPage=Math.min(state.artistPickPage,pages-1);
  const names=all.slice(state.artistPickPage*15,state.artistPickPage*15+15);
  $("artistQuickPicks").innerHTML=names.map(name=>'<button class="artist-chip" type="button" data-artist-quick="'+safe(name)+'">'+safe(name)+'</button>').join("");
  const count=$("artistPickCount");
  if(count)count.textContent=names.length+" shown · page "+(state.artistPickPage+1)+" of "+pages;
  const prev=$("artistPickPrev"),next=$("artistPickNext");
  if(prev){prev.disabled=state.artistPickPage===0;prev.hidden=pages===1;}
  if(next){next.disabled=state.artistPickPage>=pages-1;next.hidden=pages===1;}
}
async function searchArtists(query){
  const term=String(query||"").trim();
  if(!term)return;
  $("artistProfile").hidden=true;
  $("artistResults").innerHTML='<div class="empty">Searching Last.fm for '+safe(term)+'…</div>';
  try{
    const data=await lastfm("artist.search",{artist:term});
    const container=data.results?.artistmatches?.artist||[];
    const matches=asArray(container).slice(0,8);
    if(!matches.length){$("artistResults").innerHTML='<div class="empty">No artist match found. Try another spelling or search a related group.</div>';return;}
    $("artistResults").innerHTML=matches.map(item=>{
      const image=imageUrl(item),name=item.name||term,mbid=item.mbid||"";
      const art=image?'<img src="'+safe(image)+'" alt="" loading="lazy">':'<span class="artist-placeholder">♫</span>';
      return '<button type="button" class="artist-result" data-artist-name="'+safe(name)+'" data-artist-mbid="'+safe(mbid)+'">'+art+'<span><strong>'+safe(name)+'</strong><small>'+number(item.listeners)+' Last.fm listeners</small></span></button>';
    }).join("");
  }catch(error){$("artistResults").innerHTML='<div class="empty">'+safe(error.message)+' The existing Last.fm connection may need its API secret checked in Supabase.</div>';}
}
function renderArtistProfileButtons(){
  document.querySelectorAll("[data-save-artist-album]").forEach(button=>{
    const index=Number(button.dataset.saveArtistAlbum),album=state.currentArtist?.albums?.[index];
    if(!album)return;
    const key="album:"+String(state.currentArtist.name).toLowerCase()+"|"+String(album.name).toLowerCase();
    const isSaved=saved(key);
    button.textContent=isSaved?"♥ Saved":"♡ Save";
    button.classList.toggle("saved",isSaved);
  });
}
async function loadDiscography(name,mbid,generation){
  $("albumCount").textContent="Checking…";
  try{
    const query=new URLSearchParams({action:"discography",artist:name});
    if(mbid)query.set("mbid",mbid);
    const response=await fetch(MB_API+"?"+query.toString(),{headers:{Accept:"application/json"}});
    const data=await response.json();
    if(generation!==state.artistGeneration)return;
    if(!response.ok||data.error)throw new Error(data.error||"Discography lookup unavailable.");
    $("albumCount").textContent=number(data.count);
    $("albumCount").title=data.note||"MusicBrainz album and EP release-group count";
  }catch(_){
    if(generation===state.artistGeneration)$("albumCount").textContent="Not indexed";
  }
}
async function loadArtist(name,mbid=""){
  const generation=++state.artistGeneration;
  state.currentArtist={name,albums:[],tracks:[]};
  $("artistProfile").hidden=false;
  $("artistResults").innerHTML="";
  $("artistName").textContent=name;
  $("artistStats").textContent="Loading artist profile…";
  $("artistBio").textContent="Gathering biography and catalog details…";
  $("artistAvatar").textContent="♫";
  $("artistAvatar").innerHTML="♫";
  $("artistListeners").textContent="—";$("artistPlays").textContent="—";
  $("artistAlbums").innerHTML='<div class="empty">Loading popular albums…</div>';
  $("artistTracks").innerHTML='<div class="empty">Loading top tracks…</div>';
  $("similarArtists").innerHTML="";
  loadDiscography(name,mbid,generation);
  try{
    const [infoData,albumData,trackData,similarData]=await Promise.all([
      lastfm("artist.getInfo",{artist:name}),
      lastfm("artist.getTopAlbums",{artist:name}),
      lastfm("artist.getTopTracks",{artist:name}),
      lastfm("artist.getSimilar",{artist:name})
    ]);
    if(generation!==state.artistGeneration)return;
    const info=infoData.artist||{},stats=info.stats||{},bio=stripHTML(info.bio?.summary||info.bio?.content||"");
    const realName=info.name||name;
    state.currentArtist.name=realName;
    state.currentArtist.mbid=info.mbid||mbid;
    state.currentArtist.albums=asArray(albumData.topalbums?.album);
    state.currentArtist.tracks=asArray(trackData.toptracks?.track);
    $("artistName").textContent=realName;
    $("artistStats").textContent=[info.listeners?number(info.listeners)+" Last.fm listeners":"",info.streamable?"Artist profile":"Artist catalog"].filter(Boolean).join(" · ");
    $("artistListeners").textContent=number(info.listeners||stats.listeners);
    $("artistPlays").textContent=number(info.playcount||stats.playcount);
    $("artistBio").textContent=bio||"No biography was returned for this artist. Explore the albums and tracks below.";
    const artistImage=imageUrl(info);
    if(artistImage)$("artistAvatar").innerHTML='<img src="'+safe(artistImage)+'" alt="'+safe(realName)+'">';
    const albums=state.currentArtist.albums;
    $("artistAlbums").innerHTML=albums.length?albums.slice(0,8).map((album,index)=>{
      const art=imageUrl(album),albumUrl=album.url||openLinkSearch("spotify",album.name,realName);
      const k="album:"+realName.toLowerCase()+"|"+String(album.name||"").toLowerCase(),isSaved=saved(k);
      const cover=art?'<img src="'+safe(art)+'" alt="" loading="lazy">':'<div class="album-art">♫</div>';
      return '<article class="album-card">'+cover+'<strong>'+safe(album.name||"Untitled album")+'</strong><small>'+safe(album.playcount?number(album.playcount)+" Last.fm plays":"Popular release")+'</small><div class="actions"><a class="mini" target="_blank" rel="noopener" href="'+safe(albumUrl)+'">Open ↗</a><button class="mini '+(isSaved?"saved":"")+'" data-save-artist-album="'+index+'" type="button">'+(isSaved?"♥ Saved":"♡ Save")+'</button></div></article>';
    }).join(""):'<div class="empty">Last.fm did not return popular albums for this artist.</div>';
    const tracks=state.currentArtist.tracks;
    $("artistTracks").innerHTML=tracks.length?tracks.slice(0,6).map((track,index)=>{
      const trackObj={name:track.name||"Track",artist:track.artist?.name||realName},k=trackKey(trackObj),isSaved=saved(k);
      return '<article class="track-card"><div class="track-top"><span class="track-icon">♫</span><span class="rank">TRACK '+(index+1)+'</span></div><h3>'+safe(trackObj.name)+'</h3><p class="muted">'+safe(trackObj.artist)+'</p><div class="actions"><a class="mini" target="_blank" rel="noopener noreferrer" href="'+openLinkSearch("spotify",trackObj.name,trackObj.artist)+'">Spotify ↗</a><a class="mini" target="_blank" rel="noopener noreferrer" href="'+safe(lyricsSearchLink(trackObj.name,trackObj.artist))+'">Lyrics ↗</a><button class="mini '+(isSaved?"saved":"")+'" data-save-artist-track="'+index+'">'+(isSaved?"♥ Saved":"♡ Save")+'</button></div></article>';
    }).join(""):'<div class="empty">No top tracks were returned for this artist.</div>';
    const similar=asArray(similarData.similarartists?.artist).slice(0,10);
    $("similarArtists").innerHTML=similar.map(item=>'<button type="button" class="similar-chip" data-similar-artist="'+safe(item.name)+'">'+safe(item.name)+'</button>').join("")||'<span class="muted">No related artists listed.</span>';
    if(!bio) $("artistBio").textContent="No biography was returned for this artist. Their music catalog is below.";
    $("artistProfile").scrollIntoView({behavior:"smooth",block:"start"});
  }catch(error){
    if(generation!==state.artistGeneration)return;
    $("artistStats").textContent="Profile lookup failed";
    $("artistBio").textContent=error.message||"Last.fm could not return this artist.";
    $("artistAlbums").innerHTML='<div class="empty">Artist data is not available right now.</div>';
    $("artistTracks").innerHTML="";
  }
}

function appendAtlasChat(role,text){
  const log=$("atlasChatLog");
  if(!log)return;
  const row=document.createElement("div");
  row.className="atlas-chat-message "+(role==="user"?"user":"assistant");
  const label=document.createElement("small");
  label.textContent=role==="user"?"YOU":"ATLAS";
  const body=document.createElement("p");
  body.textContent=String(text||"");
  row.append(label,body);
  log.appendChild(row);
  while(log.children.length>12)log.firstElementChild.remove();
  log.scrollTop=log.scrollHeight;
}
function getSelectedLanguageName(){
  try{
    const code=state.voiceLanguage||"en-US";
    return (new Intl.DisplayNames(["en"],{type:"language"}).of(code.split("-")[0])||code)+" ("+code+")";
  }catch(_){return state.voiceLanguage||"English";}
}
function runAtlasAction(action,value=""){
  const v=String(value||"").trim();
  const trendAliases={"hip-hop":"hip-hop","hip hop":"hip-hop","rap":"hip-hop","old school":"old school hip hop","old-school":"old school hip hop","r&b":"r&b","rnb":"r&b","soul":"neo soul","neo-soul":"neo soul","reggae":"reggae","dancehall":"dancehall","afrobeats":"afrobeats","soca":"soca","kompa":"kompa","zouk":"kompa","jazz":"jazz","pop":"pop","rock":"rock","electronic":"electronic","latin":"latin"};
  const radioAliases={"hip-hop":"hip-hop","hip hop":"hip-hop","rap":"hip-hop","old school":"old-school-hip-hop","old-school":"old-school-hip-hop","r&b":"rnb","rnb":"rnb","soul":"neo-soul","neo-soul":"neo-soul","reggae":"reggae","dancehall":"dancehall","afrobeats":"afrobeats","soca":"soca","kompa":"kompa-zouk","zouk":"kompa-zouk","jazz":"smooth-jazz"};
  if(action==="next_station"){
    if(!radio("rolRadioPanel")?.classList.contains("open"))launchRadio();
    radio("rolRadioNext")?.click();
  }else if(action==="open_radio"){
    launchRadio(radioAliases[v.toLowerCase()]||"");
  }else if(action==="set_genre"){
    launchRadio(radioAliases[v.toLowerCase()]||"");
    const tag=trendAliases[v.toLowerCase()];
    if(tag){loadTrending(tag);$("discover").scrollIntoView({behavior:"smooth"});}
  }else if(action==="set_trend"){
    const tag=trendAliases[v.toLowerCase()]||v.toLowerCase();
    const allowed=["hip-hop","old school hip hop","r&b","neo soul","reggae","dancehall","afrobeats","soca","kompa","jazz","pop","rock","electronic","latin"];
    loadTrending(allowed.includes(tag)?tag:"all");
    $("discover").scrollIntoView({behavior:"smooth"});
  }else if(action==="show_trending"||action==="surprise"){
    const tag=action==="surprise"?"all":(trendAliases[v.toLowerCase()]||"all");
    loadTrending(tag);
    $("discover").scrollIntoView({behavior:"smooth"});
  }else if(action==="search_artist"){
    if(v){$("artistQuery").value=v;searchArtists(v);$("artist-vault").scrollIntoView({behavior:"smooth"});}
    else{$("artist-vault").scrollIntoView({behavior:"smooth"});$("artistQuery").focus();}
  }else if(action==="search_podcast"){
    $("podcasts").scrollIntoView({behavior:"smooth"});
    if(v){$("podcastQuery").value=v;searchPodcasts(v);}else $("podcastQuery").focus();
  }else if(action==="open_saved"){
    $("my-list").scrollIntoView({behavior:"smooth"});
  }else if(action==="open_lyricists"){
    const category=$("artistCategory");
    if(category){category.value=["women","rnb_songwriters","reggae_dancehall","producers"].includes(v)?v:"rap_lyricists";state.artistPickPage=0;initArtistPicks();}
    $("artist-vault").scrollIntoView({behavior:"smooth"});
  }else if(action==="save_station"){
    if(!radio("rolRadioPanel")?.classList.contains("open"))launchRadio();
    const saveButton=radio("rolRadioSaveStation");
    if(saveButton&&!saveButton.disabled){saveButton.click();return true;}
    return false;
  }
  return true;
}
async function sendAtlasMessage(raw){
  const message=String(raw||"").trim();
  if(!message||state.atlasBusy||!state.aiEnabled)return;
  state.atlasHistory.push({role:"user",content:message});
  state.atlasHistory=state.atlasHistory.slice(-8);
  appendAtlasChat("user",message);
  $("atlasChatInput").value="";
  state.atlasBusy=true;
  $("atlasSend").disabled=true;
  setVoiceStatus("Atlas is thinking…");
  try{
    const response=await fetch(ATLAS_API,{
      method:"POST",
      headers:{"Content-Type":"application/json","Accept":"application/json"},
      body:JSON.stringify({messages:state.atlasHistory,language:getSelectedLanguageName()})
    });
    const body=await response.json().catch(()=>({}));
    if(response.status===503&&body.code==="OPENAI_API_KEY_MISSING"){
      throw new Error("Atlas's conversation engine is built, but its OpenAI key has not been added to Supabase yet. Add OPENAI_API_KEY under Edge Functions → Secrets, then try again.");
    }
    if(!response.ok)throw new Error(body.error||"Atlas couldn't reach the conversation service. Please try again.");
    let reply=String(body.reply||"I’m here. Tell me what you would like to listen to.");
    const action=String(body.action||"none");
    const value=String(body.value||"");
    const executed=runAtlasAction(action,value);
    if(action==="save_station"&&!executed)reply="Choose or play a radio station first, and then I'll add it to your Saved Stations shelf.";
    state.atlasHistory.push({role:"assistant",content:reply});
    state.atlasHistory=state.atlasHistory.slice(-8);
    appendAtlasChat("assistant",reply);
    setAtlasMessage(reply,true);
    setVoiceStatus(action==="none"?"Ready when you are":"Done · "+action.replace(/_/g," "));
  }catch(error){
    const friendly=error.message||"Atlas is temporarily unavailable.";
    appendAtlasChat("assistant",friendly);
    setAtlasMessage(friendly,true);
    setVoiceStatus("Atlas needs its AI connection checked");
  }finally{
    state.atlasBusy=false;
    $("atlasSend").disabled=false;
    $("atlasChatInput").focus({preventScroll:true});
  }
}
function beginVoiceInput(){
  if(!state.aiEnabled){setVoiceStatus("Turn Atlas on to use voice commands.");return;}
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!Recognition){setVoiceStatus("Voice input is not supported here. Use the buttons.");say("Voice commands aren't available in this browser. You can still use my quick choices.");return;}
  try{
    if(state.recognition){try{state.recognition.stop();}catch(_){}state.recognition=null;}
    const recognition=new Recognition();state.recognition=recognition;
    recognition.lang=state.voiceLanguage||"en-US";recognition.interimResults=false;recognition.maxAlternatives=1;
    setVoiceStatus("Listening…");
    recognition.onresult=event=>{
      const words=String(event.results?.[0]?.[0]?.transcript||"").trim();
      if(words){setVoiceStatus("Heard: "+words);sendAtlasMessage(words);}
      else setVoiceStatus("I didn't catch that. Try again.");
    };
    recognition.onerror=event=>setVoiceStatus(event.error==="not-allowed"?"Microphone permission was not granted.":"Voice input stopped.");
    recognition.onend=()=>{state.recognition=null;if($("voiceStatus")?.textContent==="Listening…")setVoiceStatus("Ready when you are");};
    recognition.start();
  }catch(_){setVoiceStatus("Microphone could not start. Try a button instead.");}
}
function renderArtistPicks(){initArtistPicks();}
function closeProjectMenu(){
  const menu=$("projectsMenu");if(menu)menu.open=false;
}
function bind(){
  $("atlasToggle").addEventListener("click",toggleAtlas);
  $("atlasDock").addEventListener("click",toggleAtlas);
  $("closeAtlas").addEventListener("click",closeAtlas);
  $("atlasPower").addEventListener("click",()=>setAIEnabled(!state.aiEnabled));
  $("atlasSpeak").addEventListener("click",()=>say(state.lastSpeech||"Hello there. Welcome to RO’Lyfe Just Listening. I'm Atlas, your listening guide. What would you like to discover today?"));
  $("atlasTalk").addEventListener("click",beginVoiceInput);
  $("atlasChatForm").addEventListener("submit",event=>{event.preventDefault();sendAtlasMessage($("atlasChatInput").value);});
  $("atlasLanguage").addEventListener("change",()=>{
    state.voiceLanguage=$("atlasLanguage").value;
    readVoices();
    setVoiceStatus("Voice set to "+$("atlasLanguage").selectedOptions[0]?.textContent+".");
  });
  $("atlasVolume").addEventListener("input",()=>{
    state.voiceVolume=Number($("atlasVolume").value);
    $("atlasVolumeValue").textContent=state.voiceVolume+"%";
    try{localStorage.setItem("rolyfeJustListening.atlasVolume.v1",String(state.voiceVolume));}catch(_){}
  });
  $("artistCategory").addEventListener("change",()=>{state.artistPickPage=0;initArtistPicks();});
  $("artistPickPrev").addEventListener("click",()=>{state.artistPickPage=Math.max(0,state.artistPickPage-1);initArtistPicks();});
  $("artistPickNext").addEventListener("click",()=>{state.artistPickPage++;initArtistPicks();});
  $("atlasLanguage").addEventListener("change",()=>{
    try{localStorage.setItem("rolyfeJustListening.atlasLanguage.v1",state.voiceLanguage);}catch(_){}
  });
  $("startRadio").addEventListener("click",()=>{launchRadio();setAtlasMessage("Live radio is ready. Choose a station and press Play when you're ready.",true);});
  $("refreshTrending").addEventListener("click",()=>loadTrending(state.trend));
  $("loadMoreTracks").addEventListener("click",()=>loadTrending(state.trend,true));
  document.querySelectorAll("[data-trend]").forEach(button=>button.addEventListener("click",()=>loadTrending(button.dataset.trend)));
  document.querySelectorAll("[data-atlas-action]").forEach(button=>button.addEventListener("click",()=>act(button.dataset.atlasAction)));
  $("trendingGrid").addEventListener("click",event=>{
    const button=event.target.closest("[data-save-track]");if(!button)return;
    const track=state.tracks[Number(button.dataset.saveTrack)];if(!track)return;
    addSaved({key:trackKey(track),title:track.name,subtitle:track.artist,type:"track",url:openLinkSearch("spotify",track.name,track.artist)});
  });
  $("podcastSearchForm").addEventListener("submit",event=>{event.preventDefault();searchPodcasts($("podcastQuery").value);});
  document.querySelectorAll("[data-podcast-query]").forEach(button=>button.addEventListener("click",()=>{$("podcastQuery").value=button.dataset.podcastQuery;searchPodcasts(button.dataset.podcastQuery);}));
  $("podcastGrid").addEventListener("click",event=>{
    const button=event.target.closest("[data-save-pod]");if(!button)return;
    try{addSaved(JSON.parse(decodeURIComponent(button.dataset.savePod)));}catch(_){}
  });
  $("savedList").addEventListener("click",event=>{
    const button=event.target.closest("[data-remove]");if(!button)return;
    state.saved=state.saved.filter(item=>item.key!==button.dataset.remove);persistSaved();renderSaved();renderTracks();
  });
  $("artistSearchForm").addEventListener("submit",event=>{event.preventDefault();searchArtists($("artistQuery").value);});
  $("artistQuickPicks").addEventListener("click",event=>{
    const button=event.target.closest("[data-artist-quick]");if(!button)return;
    $("artistQuery").value=button.dataset.artistQuick;searchArtists(button.dataset.artistQuick);
  });
  $("artistResults").addEventListener("click",event=>{
    const button=event.target.closest("[data-artist-name]");if(!button)return;
    loadArtist(button.dataset.artistName,button.dataset.artistMbid||"");
  });
  $("closeArtistProfile").addEventListener("click",()=>{$("artistProfile").hidden=true;});
  $("artistAlbums").addEventListener("click",event=>{
    const button=event.target.closest("[data-save-artist-album]");if(!button)return;
    const album=state.currentArtist?.albums?.[Number(button.dataset.saveArtistAlbum)];if(!album)return;
    const name=state.currentArtist.name,k="album:"+name.toLowerCase()+"|"+String(album.name||"").toLowerCase();
    addSaved({key:k,title:album.name||"Album",subtitle:name+" · Album",type:"album",url:album.url||openLinkSearch("spotify",album.name,name)});
  });
  $("artistTracks").addEventListener("click",event=>{
    const button=event.target.closest("[data-save-artist-track]");if(!button)return;
    const track=state.currentArtist?.tracks?.[Number(button.dataset.saveArtistTrack)];if(!track)return;
    const obj={name:track.name||"Track",artist:track.artist?.name||state.currentArtist.name};
    addSaved({key:trackKey(obj),title:obj.name,subtitle:obj.artist,type:"track",url:openLinkSearch("spotify",obj.name,obj.artist)});
  });
  $("similarArtists").addEventListener("click",event=>{
    const button=event.target.closest("[data-similar-artist]");if(!button)return;
    $("artistQuery").value=button.dataset.similarArtist;searchArtists(button.dataset.similarArtist);
  });
  document.querySelectorAll("[data-pick]").forEach(button=>button.addEventListener("click",()=>{
    const genre=button.dataset.pick;
    $("moodMenu").open=false;
    if(genre==="podcasts"){$("podcasts").scrollIntoView({behavior:"smooth"});$("podcastQuery").focus();setAtlasMessage("Let's find a podcast for you.",true);}
    else if(genre==="surprise me"){loadTrending("all");$("discover").scrollIntoView({behavior:"smooth"});setAtlasMessage("Surprise. Here are popular tracks to explore.",true);}
    else{
      const trendTags={"old-school-hip-hop":"old school hip hop","neo-soul":"neo soul","smooth jazz":"smooth jazz","kompa-zouk":"kompa","r&b":"r&b"};
      loadTrending(trendTags[genre]||genre);
      $("discover").scrollIntoView({behavior:"smooth"});
      launchRadio(genre);
      setAtlasMessage("I've set the discovery shelf to "+button.textContent+". You can also choose a matching live radio station.",true);
    }
  }));
  $("dismissWelcome").addEventListener("click",()=>$("welcomeToast").hidden=true);
  $("backToTop").addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));
  window.addEventListener("scroll",()=>{
    $("backToTop").classList.toggle("visible",window.scrollY>420);
  },{passive:true});
  document.addEventListener("click",event=>{
    const menu=$("projectsMenu");if(menu?.open&&!menu.contains(event.target))closeProjectMenu();
  });
  document.addEventListener("keydown",event=>{if(event.key==="Escape"){closeProjectMenu();closeAtlas();$("moodMenu").open=false;}});
}
function tuneRadioLabels(){
  const title=document.querySelector(".rol-radio-title");if(title)title.textContent="🎧 RO’Lyfe Music Stations";
  const subtitle=document.querySelector(".rol-radio-sub");if(subtitle)subtitle.textContent="Island stations, Hip-Hop, R&B and more · Save favorites & listen while you play";
}
function welcomeSequence(){
  window.setTimeout(()=>{
    if($("welcomeToast"))$("welcomeToast").hidden=false;
  },900);
  window.setTimeout(()=>{
    if($("welcomeToast"))$("welcomeToast").hidden=true;
  },6500);
  if(state.aiEnabled){
    setAtlasMessage("Welcome to RO’Lyfe JUST LISTENING. I'm Atlas, your listening guide. Tap the Atlas button whenever you'd like help finding a station, artist, track or podcast.");
  }else{
    setAtlasMessage("Atlas is off. Turn it on whenever you'd like a listening guide.");
  }
  window.setTimeout(tuneRadioLabels,1000);
}
function init(){
  try{
    const stored=Number(localStorage.getItem("rolyfeJustListening.atlasVolume.v1"));
    if(Number.isFinite(stored)&&stored>=0&&stored<=100)state.voiceVolume=stored;
    state.voiceLanguage=localStorage.getItem("rolyfeJustListening.atlasLanguage.v1")||"en-US";
  }catch(_){}
  readVoices();
  bind();renderSaved();renderArtistPicks();
  $("atlasVolume").value=String(state.voiceVolume);
  $("atlasVolumeValue").textContent=state.voiceVolume+"%";
  setAIEnabled(state.aiEnabled);
  loadTrending("all");
  welcomeSequence();
}
init();
})();