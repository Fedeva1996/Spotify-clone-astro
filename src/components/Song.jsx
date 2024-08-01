const Song = ({ song }) => {
  return (
    <tr class="hover:bg-white/20">
      <td class="px-4 pt-1 rounded-l-lg">{song.id}</td>
      <td class="flex flex-row px-4 py-1 items-center">
        <picture class="w-10 h-10 rounded-full">
          <img
            src={song.image}
            alt={song.title}
            class="object-cover w-full h-full rounded-lg shadow-lg"
          />
        </picture>
        <div class="flex flex-col px-4 py-1">
          <span class="text-md text-white">{song.title}</span>
          <span class="text-sm">{song.artists.join(", ")}</span>
        </div>
      </td>
      <td class="px-4 py-1">
        <span class="text-md text-white">{song.album}</span>
      </td>
      <td class="px-4 py-1 rounded-r-lg">{song.duration}</td>
    </tr>
  );
};

export default Song;
