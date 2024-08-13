import { useEffect, useRef, useState } from "react";
import { usePlayerStore } from "@/store/playerStore";
import { Slider } from "./Slider";

const CurretSong = ({ image, title, artists }) => {
  return (
    <div className="flex items-center gap-2 sm:gap-5 relative overflow-hidden">
      <picture className="w-14 h-14 rounded-md shadow-lg bg-gray-500 overflow-hidden">
        {image ? (
          <img src={image} alt="Cover de la canción" />
        ) : (
          <div className="w-full h-full bg-gray-500"></div>
        )}
      </picture>
      <div className="flex flex-col justify-center">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <span className="text-sm">{artists?.join(", ")}</span>
      </div>
    </div>
  );
};

const SongControl = ({ audio }) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    audio.current.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.current.removeEventListener("timeupdate", handleTimeUpdate);
    };
  });

  const handleTimeUpdate = () => {
    setCurrentTime(audio.current.currentTime);
  };

  const formatTime = (time) => {
    if (time === null) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const duration = audio?.current?.duration ?? 0;

  return (
    <div className="flex gap-x-2 text-xs">
      <span className="min-w-9">{formatTime(currentTime)}</span>
      <Slider
        value={[currentTime]}
        max={audio?.current?.duration ?? 0}
        min={0}
        className="w-[150px] md:w-[250px] lg:w-[350px] xl:w-[450px]"
        disabled={!audio}
        onValueChange={(value) => {
          const [newValue] = value;
          audio.current.currentTime = newValue;
        }}
      />
      <span className="min-w-9">
        {duration ? formatTime(duration) : "--:--"}
      </span>
    </div>
  );
};

const VolumeControl = () => {
  const volume = usePlayerStore((state) => state.volume);
  const setVolume = usePlayerStore((state) => state.setVolume);
  const prevVolume = useRef(volume);

  const handleMute = () => {
    if (volume === 0) {
      setVolume(prevVolume.current);
    } else {
      prevVolume.current = volume;
      setVolume(0);
    }
  };

  return (
    <div className="flex flex-row justify-center gap-x-1">
      <button
        className="transition-all duration-300 hover:scale-105"
        onClick={handleMute}
      >
        {volume <= 0 ? (
          <VolumenMute />
        ) : volume > 0 && volume < 0.4 ? (
          <VolumeOne />
        ) : volume >= 0.4 && volume < 0.7 ? (
          <VolumeTwo />
        ) : volume >= 0.7 ? (
          <VolumeThree />
        ) : null}
      </button>

      <Slider
        defaultValue={[100]}
        max={100}
        min={0}
        className="w-[95px]"
        value={[volume * 100]}
        onValueChange={(value) => {
          const [newVolume] = value;
          const volumeValue = newVolume / 100;
          setVolume(volumeValue);
        }}
      />
    </div>
  );
};
export function Player() {
  const { isPlaying, setIsPlaying, currentMusic, setCurrentMusic, volume } =
    usePlayerStore((state) => state);
  const audioRef = useRef();

  useEffect(() => {
    isPlaying ? audioRef.current.play() : audioRef.current.pause();
  }, [isPlaying]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => {
    const { song, playlist } = currentMusic;
    if (song) {
      const src = `/music/${playlist?.id}/0${song.id}.mp3`;
      //console.log(src);
      audioRef.current.src = src;
      audioRef.current.volume = volume;
      audioRef.current.play();
    }
  }, [currentMusic]);

  const handlePause = () => {
    if (currentMusic.song) {
      setIsPlaying(!isPlaying);
    }
  };

  const getSongIndex = (id) => {
    return currentMusic.songs.findIndex((e) => e.id === id) ?? -1;
  };

  const handlePrev = () => {
    const { song, playlist, songs } = currentMusic;
    const index = getSongIndex(song.id);
    if (index > -1 && index > 0) {
      setIsPlaying(false);
      setCurrentMusic({ songs, playlist, song: songs[index - 1] });
      setIsPlaying(true);
    }s
  };

  const handleNext = () => {
    const { song, playlist, songs } = currentMusic;
    const index = getSongIndex(song.id);
    if (index > -1 && index + 1 < songs.length) {
      setIsPlaying(false);
      setCurrentMusic({ songs, playlist, song: songs[index + 1] });
      setIsPlaying(true);
    }
  };

  return (
    <div className="flex flex-row justify-between w-full px-5 z-50 align-middle">
      <div className="flex flex-row gap-4 w-1/3">
        <CurretSong {...currentMusic.song} />
      </div>
      <div className="flex flex-1 flex-col justify-center items-center w-1/3">
        <div>
          <button
            className="transition-all duration-300 hover:scale-105 fill-gray-200 px-5 hover:fill-white"
            title="Anterior"
            onClick={handlePrev}
          >
            <Prev />
          </button>
          <button
            className="p-2 rounded-full bg-white transition-all duration-300 hover:scale-105"
            title="Pausar/Reproducir"
            onClick={handlePause}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button
            className="transition-all duration-300 hover:scale-105 fill-gray-200 px-5 hover:fill-white"
            title="Siguiente"
            onClick={handleNext}
          >
            <Next />
          </button>
        </div>
        <SongControl audio={audioRef} />
        <audio ref={audioRef} />
      </div>
      <div className="hidden sm:flex flex-row justify-end w-1/3">
        <VolumeControl />
      </div>
    </div>
  );
}

export const Play = ({ className }) => (
  <svg
    className={className}
    width="18px"
    role="img"
    aria-hidden="true"
    viewBox="0 0 16 16"
  >
    <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path>
  </svg>
);

export const Pause = ({ className }) => (
  <svg
    className={className}
    width="18px"
    role="img"
    aria-hidden="true"
    viewBox="0 0 16 16"
  >
    <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path>
  </svg>
);
export const Prev = () => (
  <svg width="18px" role="img" aria-hidden="true" viewBox="0 0 16 16">
    <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z"></path>
  </svg>
);
export const Next = () => (
  <svg width="18px" role="img" aria-hidden="true" viewBox="0 0 16 16">
    <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z"></path>
  </svg>
);
export const VolumenMute = () => (
  <svg
    fill="currentColor"
    width="16px"
    role="presentation"
    aria-label="Volumen apagado"
    aria-hidden="true"
    id="volume-icon"
    viewBox="0 0 16 16"
  >
    <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path>
    <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path>
  </svg>
);

export const VolumeOne = () => (
  <svg
    fill="currentColor"
    width="16px"
    role="presentation"
    aria-label="Volumen bajo"
    aria-hidden="true"
    id="volume-icon"
    viewBox="0 0 16 16"
  >
    <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
  </svg>
);

export const VolumeTwo = () => (
  <svg
    fill="currentColor"
    width="16px"
    role="presentation"
    aria-label="Volumen medio"
    aria-hidden="true"
    id="volume-icon"
    viewBox="0 0 16 16"
  >
    <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 6.087a4.502 4.502 0 0 0 0-8.474v1.65a2.999 2.999 0 0 1 0 5.175v1.649z"></path>
  </svg>
);

export const VolumeThree = () => (
  <svg
    fill="currentColor"
    width="16px"
    role="presentation"
    aria-label="Volumen alto"
    aria-hidden="true"
    id="volume-icon"
    viewBox="0 0 16 16"
  >
    <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path>
    <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path>
  </svg>
);
