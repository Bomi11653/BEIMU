"use client";

import { useEffect, useRef, useState } from "react";
import type { CapabilityMedia } from "@/data/capabilities";

type BackgroundMediaProps = {
  media: CapabilityMedia;
};

export function BackgroundMedia({ media }: BackgroundMediaProps) {
  const [layers, setLayers] = useState<[CapabilityMedia, CapabilityMedia]>([
    media,
    media,
  ]);
  const [activeLayer, setActiveLayer] = useState<0 | 1>(0);
  const activeLayerRef = useRef<0 | 1>(0);
  const activeMediaIdRef = useRef(media.id);
  const transitionTokenRef = useRef(0);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  useEffect(() => {
    if (activeMediaIdRef.current === media.id) {
      return;
    }

    activeMediaIdRef.current = media.id;
    const token = transitionTokenRef.current + 1;
    transitionTokenRef.current = token;
    const nextLayer = (activeLayerRef.current === 0 ? 1 : 0) as 0 | 1;

    setLayers((current) => {
      const next: [CapabilityMedia, CapabilityMedia] = [...current];
      next[nextLayer] = media;
      return next;
    });

    const frame = window.requestAnimationFrame(() => {
      const video = videoRefs.current[nextLayer];

      if (!video) {
        return;
      }

      video.load();

      const reveal = async () => {
        if (transitionTokenRef.current !== token) {
          return;
        }

        try {
          await video.play();
        } catch {
          // The poster remains visible if a browser blocks autoplay.
        }

        if (transitionTokenRef.current !== token) {
          return;
        }

        activeLayerRef.current = nextLayer;
        setActiveLayer(nextLayer);

        window.setTimeout(() => {
          const hiddenLayer = nextLayer === 0 ? 1 : 0;
          videoRefs.current[hiddenLayer]?.pause();
        }, 950);
      };

      if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        void reveal();
      } else {
        video.addEventListener("loadeddata", reveal, { once: true });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [media]);

  return (
    <div className="stage-media" aria-hidden="true">
      {layers.map((layer, index) => (
        <video
          className={`stage-video${activeLayer === index ? " is-active" : ""}`}
          key={`${index}-${layer.id}`}
          ref={(node) => {
            videoRefs.current[index] = node;
          }}
          autoPlay={index === 0}
          muted
          loop
          playsInline
          preload={activeLayer === index ? "auto" : "metadata"}
          poster={layer.poster}
          style={{ objectPosition: layer.objectPosition }}
        >
          <source src={layer.src} type="video/mp4" />
        </video>
      ))}
      <div className="bottom-blur" />
    </div>
  );
}
