"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Camera, CameraOff, RotateCcw, Sparkles, Download, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/nav/BottomNav";

export default function ARPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);
  const [selectedLook, setSelectedLook] = useState("natural");
  const [error, setError] = useState("");

  const makeupLooks = [
    { id: "natural", name: "Natural", description: "Everyday fresh look" },
    { id: "glam", name: "Glam", description: "Evening sophistication" },
    { id: "bold", name: "Bold", description: "Creative expression" },
    { id: "classic", name: "Classic", description: "Timeless elegance" }
  ];

  const startCamera = async () => {
    try {
      // Check if camera is already streaming
      if (isStreaming) return;

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false // Explicitly disable audio
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        setError("");
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => {
        if (track.readyState === 'live') {
          track.stop();
        }
      });
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
  };

  const capturePhoto = () => {
    if (!isStreaming) {
      setError("Camera is not active. Please start the camera first.");
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        setError("Failed to get canvas context. Please try again.");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Apply mirror effect if enabled
      if (isMirrored) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `makeup-look-${selectedLook}-${Date.now()}.jpg`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/jpeg', 0.95);
    }
  };

  const shareLook = async () => {
    if (!navigator.share) {
      setError("Web Share API is not supported in this browser.");
      return;
    }

    if (!isStreaming) {
      setError("Camera is not active. Please start the camera first.");
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        setError("Failed to get canvas context. Please try again.");
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (isMirrored) {
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
      }

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'makeup-look.jpg', { type: 'image/jpeg' });
          try {
            await navigator.share({
              title: 'My Makeup Look - Glam Guide AI',
              text: `Check out my ${selectedLook} makeup look!`,
              files: [file]
            });
          } catch (err) {
            console.error('Share failed:', err);
            setError("Failed to share. Please try again.");
          }
        }
      }, 'image/jpeg', 0.95);
    }
  };

  useEffect(() => {
    // Clean up on unmount
    return () => {
      stopCamera();
    };
  }, [isStreaming]);

  // Add error handling for camera access
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000); // Clear error after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white pb-20 overflow-x-hidden">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Camera className="h-6 w-6 text-pink-400" />
              AR Try-On Studio
            </h1>
            <p className="text-white/60 mt-1">
              Test makeup looks with real-time camera preview
            </p>
          </div>
          <Link href="/tutorial">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/5">
              Tutorials
            </Button>
          </Link>
        </header>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Camera View */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10 overflow-hidden">
              <div className="relative aspect-video bg-black">
                {!isStreaming ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Camera className="h-16 w-16 text-white/30 mx-auto mb-4" />
                      <p className="text-white/60 mb-4">Camera is off</p>
                      <Button 
                        onClick={startCamera}
                        className="bg-gradient-to-r from-pink-500 via-rose-500 to-fuchsia-500"
                      >
                        Start Camera
                      </Button>
                      {error && (
                        <p className="text-red-400 text-sm mt-4">{error}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${isMirrored ? 'scale-x-[-1]' : ''}`}
                    />
                    <canvas ref={canvasRef} className="hidden" />
                    
                    {/* Camera Controls Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          onClick={toggleMirror}
                          size="sm"
                          variant="secondary"
                          className="bg-black/50 hover:bg-black/70"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          {isMirrored ? 'Mirror On' : 'Mirror Off'}
                        </Button>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={capturePhoto}
                          size="sm"
                          className="bg-black/50 hover:bg-black/70"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Capture
                        </Button>
                        {navigator.share && (
                          <Button
                            onClick={shareLook}
                            size="sm"
                            className="bg-black/50 hover:bg-black/70"
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        )}
                        <Button
                          onClick={stopCamera}
                          size="sm"
                          variant="destructive"
                          className="bg-red-500/80 hover:bg-red-600"
                        >
                          <CameraOff className="h-4 w-4 mr-2" />
                          Stop
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </div>

          {/* Look Selection */}
          <div className="space-y-4">
            <Card className="p-4 bg-white/5 border-white/10">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-pink-400" />
                Select Look
              </h3>
              <div className="space-y-2">
                {makeupLooks.map((look) => (
                  <button
                    key={look.id}
                    onClick={() => setSelectedLook(look.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedLook === look.id
                        ? 'bg-pink-500/20 border-pink-500 text-white'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-medium">{look.name}</div>
                    <div className="text-sm opacity-70">{look.description}</div>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="p-4 bg-white/5 border-white/10">
              <h3 className="font-semibold mb-3">Tips</h3>
              <ul className="text-sm text-white/60 space-y-2">
                <li>• Face the camera directly for best results</li>
                <li>• Ensure good, even lighting</li>
                <li>• Mirror mode shows your reflection</li>
                <li>• Capture photos to save your looks</li>
              </ul>
            </Card>

            <Link href="/saved">
              <Button className="w-full" variant="outline">
                View Saved Looks
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}