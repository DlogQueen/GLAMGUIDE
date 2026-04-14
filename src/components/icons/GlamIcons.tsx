"use client";

import React from "react";

interface IconProps {
  className?: string;
  size?: number;
}

// Custom Glam Brush Icon
export function GlamBrushIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Brush handle */}
      <path d="M4 20L8 16" />
      <path d="M6 22L10 18" />
      {/* Brush ferrule */}
      <path d="M8 16L14 10" />
      {/* Brush bristles with glam swoosh */}
      <path d="M14 10C16 8 18 6 20 4" />
      <path d="M15 11C17 9 19 7 21 5" />
      <path d="M13 9C14 7 15 5 16 3" />
      {/* Sparkle accents */}
      <path d="M18 2L18.5 3L19 2L18.5 1L18 2" fill="currentColor" />
      <path d="M20 6L20.5 7L21 6L20.5 5L20 6" fill="currentColor" />
    </svg>
  );
}

// Lipstick Icon
export function LipstickIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Lipstick bullet */}
      <path d="M8 6V3C8 2 9 1 10 1H14C15 1 16 2 16 3V6" />
      <path d="M8 6H16V10C16 11 15 12 14 12H10C9 12 8 11 8 10V6Z" fill="currentColor" fillOpacity="0.3" />
      {/* Case */}
      <rect x="7" y="12" width="10" height="10" rx="1" />
      <path d="M7 15H17" />
      {/* Glam highlight */}
      <path d="M9 8H11" strokeWidth="1" />
    </svg>
  );
}

// Eyeshadow Palette Icon
export function PaletteIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Palette case */}
      <rect x="2" y="4" width="20" height="16" rx="2" />
      {/* Eyeshadow pans */}
      <circle cx="7" cy="9" r="2.5" fill="currentColor" fillOpacity="0.2" />
      <circle cx="12" cy="9" r="2.5" fill="currentColor" fillOpacity="0.4" />
      <circle cx="17" cy="9" r="2.5" fill="currentColor" fillOpacity="0.6" />
      <circle cx="7" cy="15" r="2.5" fill="currentColor" fillOpacity="0.3" />
      <circle cx="12" cy="15" r="2.5" fill="currentColor" fillOpacity="0.5" />
      <circle cx="17" cy="15" r="2.5" fill="currentColor" fillOpacity="0.7" />
      {/* Brush stroke */}
      <path d="M20 2L22 4" strokeWidth="1" />
    </svg>
  );
}

// Glam Mirror Icon
export function MirrorIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Mirror frame */}
      <ellipse cx="12" cy="10" rx="8" ry="9" />
      <ellipse cx="12" cy="10" rx="6" ry="7" fill="currentColor" fillOpacity="0.1" />
      {/* Stand */}
      <path d="M8 18L12 22L16 18" />
      <path d="M12 19V22" />
      {/* Reflection sparkle */}
      <path d="M10 7L10.5 8L11 7L10.5 6L10 7" fill="currentColor" />
      <path d="M13 9L13.5 10L14 9L13.5 8L13 9" fill="currentColor" />
    </svg>
  );
}

// Crown/Queen Icon for Glam
export function CrownIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Crown base */}
      <path d="M4 18H20" />
      <path d="M3 18L5 10L8 14L12 8L16 14L19 10L21 18" fill="currentColor" fillOpacity="0.2" />
      {/* Crown points */}
      <path d="M5 10V6" />
      <path d="M8 14V9" />
      <path d="M12 8V3" />
      <path d="M16 14V9" />
      <path d="M19 10V6" />
      {/* Jewels */}
      <circle cx="5" cy="6" r="1" fill="currentColor" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" />
      <circle cx="19" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

// AI Magic Wand with Sparkles
export function MagicWandIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Wand */}
      <path d="M4 20L20 4" />
      <path d="M6 18L8 16" strokeWidth="2" />
      {/* Star tip */}
      <path d="M18 2L19 5L22 6L19 7L18 10L17 7L14 6L17 5L18 2Z" fill="currentColor" />
      {/* Sparkles */}
      <path d="M4 8L4.5 9L5 8L4.5 7L4 8" fill="currentColor" />
      <path d="M8 4L8.5 5L9 4L8.5 3L8 4" fill="currentColor" />
    </svg>
  );
}

// Camera with Glam Effect
export function GlamCameraIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Camera body */}
      <rect x="3" y="6" width="18" height="14" rx="3" />
      {/* Lens */}
      <circle cx="12" cy="13" r="4" />
      <circle cx="12" cy="13" r="2" fill="currentColor" fillOpacity="0.3" />
      {/* Flash */}
      <path d="M8 6V4H16V6" />
      {/* Glam sparkle overlay */}
      <path d="M20 4L20.5 5L21 4L20.5 3L20 4" fill="currentColor" />
      <path d="M18 2L18.5 3L19 2L18.5 1L18 2" fill="currentColor" />
    </svg>
  );
}

// Heart with Makeup Swipe
export function GlamHeartIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Heart shape */}
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill="currentColor"
        fillOpacity="0.2"
      />
      {/* Makeup brush swipe across heart */}
      <path d="M5 9C8 12 16 12 19 9" strokeWidth="1" />
    </svg>
  );
}

// Face Profile with Sparkle
export function FaceIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Face outline */}
      <ellipse cx="12" cy="12" rx="7" ry="8" />
      {/* Eyes */}
      <path d="M9 11C9.5 11.5 10 11.5 10.5 11" />
      <path d="M13.5 11C14 11.5 14.5 11.5 15 11" />
      {/* Smile */}
      <path d="M9 14C10 15.5 14 15.5 15 14" />
      {/* Glam sparkle */}
      <path d="M17 5L17.5 6L18 5L17.5 4L17 5" fill="currentColor" />
    </svg>
  );
}

// Sparkle/Star burst
export function SparkleIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
        fill="currentColor"
        fillOpacity="0.3"
      />
      <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" />
    </svg>
  );
}

// Tutorial/Book with Brush
export function TutorialIcon({ className = "", size = 24 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Book */}
      <path d="M4 4H10C11 4 12 5 12 6V20C12 19 11 18 10 18H4V4Z" fill="currentColor" fillOpacity="0.1" />
      <path d="M20 4H14C13 4 12 5 12 6V20C12 19 13 18 14 18H20V4Z" fill="currentColor" fillOpacity="0.1" />
      {/* Pages */}
      <path d="M12 6C12 5 11 4 10 4H4V18H10C11 18 12 19 12 20" />
      <path d="M12 6C12 5 13 4 14 4H20V18H14C13 18 12 19 12 20" />
      {/* Mini brush */}
      <path d="M6 14L8 12" strokeWidth="1" />
    </svg>
  );
}
