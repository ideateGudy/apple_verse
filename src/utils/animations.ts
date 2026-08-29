import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type GSAPTarget = gsap.TweenTarget;

type AnimationProps = gsap.TweenVars;
type ScrollProps = Omit<ScrollTrigger.Vars, "trigger">;

export const animateWithGSAP = (
  target: gsap.DOMTarget,
  animationProps: AnimationProps,
  scrollProps: ScrollProps = {},
) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart reverse restart reverse",
      start: "top 85%",
      ...scrollProps,
    },
  });
};

export const animateWithGsapTimeline = (
  timeline: gsap.core.Timeline,
  rotationRef: React.RefObject<THREE.Group>,
  rotationState: number,
  firstTarget: GSAPTarget,
  secondTarget: GSAPTarget,
  animationProps: gsap.TweenVars
) => {
  timeline.to(rotationRef.current.rotation, {
    y: rotationState,
    duration: 1,
    ease: "power2.inOut",
  });

  timeline.to(
    firstTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<", // insert at the start of prev animation
  );

  timeline.to(
    secondTarget,
    {
      ...animationProps,
      ease: "power2.inOut",
    },
    "<",
  );
};
