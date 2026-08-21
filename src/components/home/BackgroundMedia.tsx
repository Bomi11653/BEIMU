export function BackgroundMedia() {
  return (
    <div className="stage-media" aria-hidden="true">
      <video
        className="stage-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/3d/3d-cyberpunk-poster.jpg"
      >
        <source src="/media/3d/3d-cyberpunk.mp4" type="video/mp4" />
      </video>
      <div className="bottom-blur" />
    </div>
  );
}
