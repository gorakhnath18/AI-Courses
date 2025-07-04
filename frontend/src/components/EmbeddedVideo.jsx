 function EmbeddedVideo({ videoId, title }) {
  return (
    // The classes are now aspect-w-1 and aspect-h-1 for a square ratio.
    <div className="aspect-w-1 aspect-h-1">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg shadow-lg"
      ></iframe>
    </div>
  );
}

export default EmbeddedVideo;