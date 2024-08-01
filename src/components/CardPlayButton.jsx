import { Play, Pause } from "./Player.jsx";
import { usePlayerStore } from "@/store/playerStore";

export function CardPlayButton({ id, size = "small" }) {
  const { isPlaying, setIsPlaying, currentMusic, setCurrentMusic } =
    usePlayerStore((state) => state);

  const isPlayingPlaylist = isPlaying && currentMusic?.playlist?.id === id;

  const handleClick = () => {
    if (isPlayingPlaylist) {
      setIsPlaying(false);
      return;
    }

    setCurrentMusic({
      playlist: {
        id,
      },
    });
    fetch(`/api/get-info-playlist.json?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        const { songs, playlist } = data;
        setIsPlaying(true);
        setCurrentMusic({
          songs,
          playlist,
          song: songs[0],
        });

        console.log({playlist, songs});
      });
  };

  const className = size === "small" ? "w-4 h-4" : "w-5 h-5"; 

  return (
    <button
      onClick={handleClick}
      className="card-play-button rounded-full bg-green-500 p-4 transition-all duration-300 hover:scale-105 hover:bg-green-400"
    >
      {isPlayingPlaylist ? <Pause className={className} /> : <Play className={className} />}
    </button>
  );
}
