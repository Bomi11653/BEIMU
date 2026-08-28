"use client";

type StageAudioToggleProps = {
  enabled: boolean;
  onToggle: () => void;
};

function SoundIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16.5 12a4.5 4.5 0 0 0-2.3-3.92v7.84A4.5 4.5 0 0 0 16.5 12ZM19 12a7.5 7.5 0 0 1-3.75 6.49V5.51A7.5 7.5 0 0 1 19 12ZM5 9v6h3.5L14 19V5L8.5 9H5Z"
        />
        <path
          fill="currentColor"
          d="M3.27 3.27 20.73 20.73 19.62 21.84 2.16 4.38z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
      <path
        fill="currentColor"
        d="M5 9v6h3.5L14 19V5L8.5 9H5Zm11.5 3a4.5 4.5 0 0 1-2.3 3.92V8.08A4.5 4.5 0 0 1 16.5 12Zm2.5 0a7 7 0 0 1-3.5 6.06V5.94A7 7 0 0 1 19 12Z"
      />
    </svg>
  );
}

export function StageAudioToggle({ enabled, onToggle }: StageAudioToggleProps) {
  return (
    <button
      type="button"
      className={enabled ? "stage-audio-toggle is-on" : "stage-audio-toggle"}
      aria-pressed={enabled}
      aria-label={enabled ? "关闭视频原声" : "开启视频原声"}
      onClick={(event) => {
        event.stopPropagation();
        onToggle();
      }}
    >
      <span className="stage-audio-toggle-icon">
        <SoundIcon muted={!enabled} />
      </span>
      <span className="stage-audio-toggle-copy">
        <span className="stage-audio-toggle-state">
          {enabled ? "ON" : "OFF"}
        </span>
        <span className="stage-audio-toggle-label">原声</span>
      </span>
    </button>
  );
}
