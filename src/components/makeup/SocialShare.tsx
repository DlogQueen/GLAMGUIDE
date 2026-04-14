"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, 
  Download, 
  Camera,
  Check,
  X,
  Link as LinkIcon
} from "lucide-react";

// Custom social icons as components
const TwitterIcon = () => (
  <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className="h-4 w-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SocialShareProps {
  lookName: string;
  onDownload?: () => void;
  onScreenshot?: () => void;
}

export function SocialShare({ lookName, onDownload, onScreenshot }: SocialShareProps) {
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareText = `Check out my ${lookName} makeup look created with Makeup Mastery AI! 💄✨`;

  const handleShare = (platform: string) => {
    let url = "";
    
    switch (platform) {
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        break;
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case "copy":
        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
    }

    if (url) {
      window.open(url, "_blank", "width=600,height=400");
    }
  };

  return (
    <>
      <Button 
        variant="outline" 
        className="gap-2"
        onClick={() => setShowModal(true)}
      >
        <Share2 className="h-4 w-4" />
        Share Look
      </Button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-serif text-xl font-semibold text-gray-900">
                    Share Your Look
                  </h3>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="rounded-full p-1 hover:bg-gray-100"
                  >
                    <X className="h-5 w-5 text-gray-500" />
                  </button>
                </div>

                <p className="mb-4 text-sm text-gray-600">
                  Share your <span className="font-medium text-rose-600">{lookName}</span> look with friends!
                </p>

                {/* Social Buttons */}
                <div className="mb-4 grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleShare("twitter")}
                  >
                    <TwitterIcon />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleShare("facebook")}
                  >
                    <FacebookIcon />
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => handleShare("copy")}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4" />
                        Copy Link
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => {
                      onScreenshot?.();
                      setShowModal(false);
                    }}
                  >
                    <Camera className="h-4 w-4" />
                    Screenshot
                  </Button>
                </div>

                {/* Download */}
                {onDownload && (
                  <Button
                    className="w-full gap-2"
                    onClick={() => {
                      onDownload();
                      setShowModal(false);
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download Video
                  </Button>
                )}
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
