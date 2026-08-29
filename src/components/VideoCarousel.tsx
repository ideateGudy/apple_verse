import { useEffect, useRef, useState } from "react";
import { highlightsSlides } from "../constants";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger to fix the missing plugin error
gsap.registerPlugin(ScrollTrigger);

const VideoCarousel = () => {
  const videoRef = useRef<(HTMLVideoElement | null)[]>([]);
  const videoSpanRef = useRef<(HTMLSpanElement | null)[]>([]);
  const videoDivRef = useRef<(HTMLSpanElement | null)[]>([]);

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState<
    React.SyntheticEvent<HTMLVideoElement>[]
  >([]);
  const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

  useGSAP(() => {
    // Slider animation
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`,
      duration: 2,
      ease: "power2.inOut",
    });

    // ScrollTrigger animation
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideo((prevVideo) => ({
          ...prevVideo,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId]?.pause();
      } else {
        startPlay && videoRef.current[videoId]?.play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetaData = (
    _i: number,
    e: React.SyntheticEvent<HTMLVideoElement>,
  ) => setLoadedData((prevData) => [...prevData, e]);

  useEffect(() => {
    let currentProgress = 0;
    const span = videoSpanRef.current;

    if (span[videoId]) {
      const anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);

          if (progress !== currentProgress) {
            currentProgress = progress;

            if (videoDivRef.current[videoId]) {
              gsap.to(videoDivRef.current[videoId], {
                width:
                  window.innerWidth < 760
                    ? "10vw"
                    : window.innerWidth < 1200
                      ? "10vw"
                      : "4vw",
              });
            }

            if (span[videoId]) {
              gsap.to(span[videoId], {
                width: `${currentProgress}%`,
                backgroundColor: "white",
              });
            }
          }
        },

        onComplete: () => {
          if (isPlaying) {
            if (videoDivRef.current[videoId]) {
              gsap.to(videoDivRef.current[videoId], {
                width: "12px",
              });
            }
            if (span[videoId]) {
              gsap.to(span[videoId], {
                backgroundColor: "#afafaf",
              });
            }
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      // Safely calculate progress with optional chaining & null checks
      const animUpdate = () => {
        const currentVideo = videoRef.current[videoId];
        if (currentVideo && highlightsSlides[videoId]?.videoDuration) {
          anim.progress(
            currentVideo.currentTime / highlightsSlides[videoId].videoDuration,
          );
        }
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }

      // Clean up ticker on unmount/re-render to avoid memory leaks or targeting stale refs
      return () => {
        gsap.ticker.remove(animUpdate);
      };
    }
  }, [videoId, startPlay]);

  const handleProcess = (type: string, i?: number) => {
    switch (type) {
      case "video-end":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: (i ?? 0) + 1,
        }));
        break;
      case "video-last":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: true,
        }));
        break;
      case "video-reset":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case "play":
      case "pause":
        setVideo((prevVideo) => ({
          ...prevVideo,
          isPlaying: !prevVideo.isPlaying,
        }));
        break;
      default:
        return video;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {highlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  className={`${
                    list.id === 2 && "translate-x-44"
                  } pointer-events-none`}
                  ref={(el) => {
                    videoRef.current[i] = el;
                  }}
                  onEnded={() =>
                    i !== highlightsSlides.length - 1
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last")
                  }
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>

              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {highlightsSlides.map((_, i) => (
            <span
              key={i}
              ref={(el) => {
                videoDivRef.current[i] = el;
              }}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer"
            >
              <span
                className="absolute h-full w-full rounded-full"
                ref={(el) => {
                  videoSpanRef.current[i] = el;
                }}
              />
            </span>
          ))}
        </div>
        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                  ? () => handleProcess("play")
                  : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
};

export default VideoCarousel;
