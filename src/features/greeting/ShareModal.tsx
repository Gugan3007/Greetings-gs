'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Copy, Check, MessageCircle, X, Send } from 'lucide-react';

// ─── Inline Brand SVGs ───────────────────────────────────────────────────────

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 5.964H5.078z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
);

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
}

export function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const isLocalLink = (() => {
    try {
      const parsed = new URL(url);
      return parsed.protocol !== 'https:' ||
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1' ||
        /^10\.|^192\.168\.|^172\.(1[6-9]|2\d|3[01])\./.test(parsed.hostname);
    } catch {
      return true;
    }
  })();

  const legacyCopy = () => {
    const input = document.createElement('textarea');
    input.value = url;
    input.setAttribute('readonly', '');
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.appendChild(input);
    input.select();
    const didCopy = document.execCommand('copy');
    input.remove();
    return didCopy;
  };

  const handleCopy = async () => {
    let didCopy = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        didCopy = true;
      }
    } catch {
      // Safari can expose Clipboard API while denying writes. Fall through to
      // the selection-based copy path, which works after a real button click.
    }

    if (!didCopy) didCopy = legacyCopy();

    if (didCopy) {
      setCopyFailed(false);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopyFailed(true);
    }
  };

  const handleNativeShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }
    try {
      await navigator.share({ title, url });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      await handleCopy();
    }
  };

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${title} ${url}`)}`,
      color: 'bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20',
    },
    {
      name: 'Twitter',
      icon: TwitterIcon,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      color: 'bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20',
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md overflow-hidden rounded-[var(--radius-lg)] border border-glass-border bg-glass-bg p-6 shadow-2xl backdrop-blur-xl pointer-events-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-purple/20 text-accent-purple">
                    <Share2 className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground">Share Greeting</h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full p-2 text-fg-muted transition-colors hover:bg-white/10 hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <p className={`mb-4 rounded-[var(--radius-md)] border px-3 py-2 text-center text-xs ${
                isLocalLink
                  ? 'border-amber-400/25 bg-amber-400/10 text-amber-200'
                  : 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
              }`}>
                {isLocalLink
                  ? 'Local preview · same Wi-Fi and a running Mac are required.'
                  : 'Public HTTPS link · opens on any phone or network.'}
              </p>

              {/* URL Copy Box */}
              <div className="mb-8 flex items-center gap-2 rounded-[var(--radius-md)] border border-glass-border bg-background p-2">
                <input
                  type="text"
                  readOnly
                  value={url}
                  className="flex-1 bg-transparent px-3 text-sm text-fg-secondary focus:outline-none"
                />
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-gradient-to-r from-accent-purple to-accent-blue px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  onClick={handleCopy}
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>

              {copyFailed ? (
                <p className="-mt-5 mb-6 text-center text-xs text-accent-rose">Select the link above and copy it manually.</p>
              ) : null}

              <button
                type="button"
                onClick={handleNativeShare}
                className="mb-5 flex w-full items-center justify-center gap-2 rounded-[var(--radius-md)] border border-glass-border bg-white/5 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-white/10"
              >
                <Send className="h-4 w-4" />
                Share from this device
              </button>

              {/* Social Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {shareLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col items-center gap-2 rounded-[var(--radius-md)] p-4 transition-colors ${link.color}`}
                  >
                    <link.icon className="h-6 w-6" />
                    <span className="text-xs font-medium">{link.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
