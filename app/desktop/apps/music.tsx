// "use client";

// import { useState, useRef, useEffect } from "react";
// import { 
//   Play, 
//   Pause, 
//   SkipForward, 
//   SkipBack, 
//   Volume2, 
//   Music, 
//   ListMusic,
//   Repeat,
//   Shuffle
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Slider } from "@/components/ui/slider";

// /**
//  * MusicApp - A functional music player for SlowbatOS.
//  * Features track listing, playback controls, and real audio progress tracking.
//  * 
//  * @returns {JSX.Element} The music player UI
//  */
// export default function MusicApp() {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [volume, setVolume] = useState(0.7);
  
//   const audioRef = useRef<HTMLAudioElement | null>(null);

//   const tracks = [
//     { title: "ncs.mp3", artist: "NCS_Release", url: "/music/ncs.mp3" },
//     { title: "Cyber_Atmosphere.mp3", artist: "JD_Admin", url: "#" },
//     { title: "Neon_Drift.wav", artist: "Unknown_Node", url: "#" },
//   ];

//   const currentTrack = tracks[currentTrackIndex];

//   // Initialize and update audio volume
//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.volume = volume;
//     }
//   }, [volume]);

//   // Handle play/pause logic
//   useEffect(() => {
//     if (audioRef.current) {
//       if (isPlaying) {
//         audioRef.current.play().catch(e => console.error("Playback failed", e));
//       } else {
//         audioRef.current.pause();
//       }
//     }
//   }, [isPlaying, currentTrackIndex]);

//   const togglePlay = () => setIsPlaying(!isPlaying);

//   const nextTrack = () => {
//     setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
//     setIsPlaying(true);
//   };

//   const prevTrack = () => {
//     setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
//     setIsPlaying(true);
//   };

//   const handleTimeUpdate = () => {
//     if (audioRef.current) {
//       setCurrentTime(audioRef.current.currentTime);
//     }
//   };

//   const handleLoadedMetadata = () => {
//     if (audioRef.current) {
//       setDuration(audioRef.current.duration);
//     }
//   };

//   const handleSeek = (val: number[]) => {
//     const newTime = val[0];
//     if (audioRef.current) {
//       audioRef.current.currentTime = newTime;
//       setCurrentTime(newTime);
//     }
//   };

//   const formatTime = (time: number) => {
//     if (isNaN(time)) return "0:00";
//     const minutes = Math.floor(time / 60);
//     const seconds = Math.floor(time % 60);
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   };

//   return (
//     <div className="flex flex-col h-full font-mono text-xs text-zinc-400 p-4 bg-zinc-50 dark:bg-zinc-950/50 transition-colors">
//       <audio 
//         ref={audioRef}
//         src={currentTrack.url}
//         onTimeUpdate={handleTimeUpdate}
//         onLoadedMetadata={handleLoadedMetadata}
//         onEnded={nextTrack}
//       />

//       {/* Player Core UI */}
//       <div className="flex-1 flex flex-col items-center justify-center space-y-6">
//         {/* Album Art Placeholder */}
//         <div className="w-32 h-32 md:w-40 md:h-40 bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-emerald-500/20 rounded-xl flex items-center justify-center shadow-2xl relative overflow-hidden group">
//           <div className="absolute inset-0 bg-emerald-500/5 animate-pulse" />
//           <Music className={`w-16 h-16 md:w-20 md:h-20 text-emerald-500/40 ${isPlaying ? 'animate-bounce' : ''}`} />
//           <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
//              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
//           </div>
//         </div>

//         {/* Track Info */}
//         <div className="text-center space-y-1">
//           <h2 className="text-sm md:text-base font-bold text-zinc-800 dark:text-emerald-400 tracking-wider truncate max-w-[250px]">
//             {currentTrack.title}
//           </h2>
//           <p className="text-[10px] text-zinc-500 dark:text-zinc-500 uppercase tracking-tighter">
//             {currentTrack.artist}
//           </p>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full max-w-[300px] space-y-2">
//           <Slider 
//             value={[currentTime]} 
//             max={duration || 100} 
//             step={0.1} 
//             onValueChange={handleSeek}
//             className="cursor-pointer"
//           />
//           <div className="flex justify-between text-[9px] text-zinc-500 uppercase">
//             <span>{formatTime(currentTime)}</span>
//             <span>{formatTime(duration)}</span>
//           </div>
//         </div>

//         {/* Playback Controls */}
//         <div className="flex items-center gap-4 md:gap-6">
//           <Button variant="ghost" size="icon" onClick={prevTrack} className="hover:bg-emerald-500/10 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500">
//             <SkipBack className="w-5 h-5" />
//           </Button>
          
//           <Button 
//             variant="ghost" 
//             size="icon" 
//             onClick={togglePlay}
//             className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all shadow-lg shadow-emerald-500/10"
//           >
//             {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
//           </Button>

//           <Button variant="ghost" size="icon" onClick={nextTrack} className="hover:bg-emerald-500/10 text-zinc-600 dark:text-zinc-400 hover:text-emerald-500">
//             <SkipForward className="w-5 h-5" />
//           </Button>
//         </div>
//       </div>

//       {/* Footer Controls */}
//       <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800/50 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Volume2 className="w-4 h-4 text-zinc-500" />
//           <div className="w-20">
//             <Slider 
//               value={[volume * 100]} 
//               max={100} 
//               step={1} 
//               onValueChange={(val) => setVolume(val[0] / 100)} 
//             />
//           </div>
//         </div>
        
//         <div className="flex gap-2">
//           <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-500">
//             <Shuffle className="w-3.5 h-3.7" />
//           </Button>
//           <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-500">
//             <Repeat className="w-3.5 h-3.5" />
//           </Button>
//           <Button variant="ghost" size="icon" className="w-7 h-7 hover:bg-emerald-500/10 text-zinc-500 hover:text-emerald-500">
//             <ListMusic className="w-3.5 h-3.5" />
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// }
