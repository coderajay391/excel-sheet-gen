'use client';

import React, { useState } from 'react';
import { X, Monitor, Terminal, Copy, Check, ShieldCheck, Apple, Laptop } from 'lucide-react';

interface DesktopPackagingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DesktopPackagingModal({ isOpen, onClose }: DesktopPackagingModalProps) {
  const [selectedOS, setSelectedOS] = useState<'win' | 'mac' | 'linux'>('win');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const osConfig = {
    win: {
      name: 'Windows',
      ext: '.exe (Installer & Portable)',
      arch: 'x64, arm64',
      cmd: 'npm run package:win',
      packageScript: `"package:win": "next build && electron-builder --win nsis portable"`,
      details: 'Generates a signed or unsigned standalone executable (.exe) that can be run on Windows 10/11 without any runtime installation or internet connection.'
    },
    mac: {
      name: 'macOS',
      ext: '.dmg & .app',
      arch: 'Apple Silicon (M1/M2/M3/M4) & Intel',
      cmd: 'npm run package:mac',
      packageScript: `"package:mac": "next build && electron-builder --mac --universal"`,
      details: 'Bundles into a universal macOS binary (.dmg and .app bundle) supporting both ARM64 and x86_64 architectures with native macOS menubar integrations.'
    },
    linux: {
      name: 'Linux',
      ext: '.AppImage & .deb',
      arch: 'x86_64, aarch64',
      cmd: 'npm run package:linux',
      packageScript: `"package:linux": "next build && electron-builder --linux AppImage deb"`,
      details: 'Produces portable .AppImage binaries that run across Ubuntu, Debian, Fedora, Arch, and RedHat distributions with desktop file associations for .xlsx files.'
    }
  };

  const currentOS = osConfig[selectedOS];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Monitor className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Cross-Platform Desktop Packaging Hub
              </h3>
              <p className="text-xs text-slate-400">
                Package Offline Excel Guider as a native desktop binary for Windows, macOS, or Linux.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* OS Selector Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setSelectedOS('win')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedOS === 'win'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>Windows (.exe)</span>
            </button>

            <button
              onClick={() => setSelectedOS('mac')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedOS === 'mac'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              <span>macOS (.dmg)</span>
            </button>

            <button
              onClick={() => setSelectedOS('linux')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedOS === 'linux'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Linux (.AppImage)</span>
            </button>
          </div>

          {/* OS Target Summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="text-slate-400 font-medium">Target Package:</span>
              <span className="text-blue-400 font-mono font-semibold">{currentOS.ext}</span>
            </div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="text-slate-400 font-medium">Supported Architectures:</span>
              <span className="text-slate-300 font-mono">{currentOS.arch}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              {currentOS.details}
            </p>

            <span className="text-[11px] text-slate-400 font-mono block mb-1.5 uppercase font-medium">
              Terminal Packaging Command:
            </span>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs">
              <span className="text-emerald-400">$ {currentOS.cmd}</span>
              <button
                onClick={() => copyToClipboard(currentOS.cmd)}
                className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Copy command"
              >
                {copiedText === currentOS.cmd ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Native Keyboard Shortcut Reference */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>Desktop Keyboard Shortcuts</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-850">
                <span className="text-slate-500 text-[10px] block">EXPORT</span>
                <span className="text-slate-200">⌘/Ctrl + S</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-850">
                <span className="text-slate-500 text-[10px] block">NEW PROJECT</span>
                <span className="text-slate-200">⌘/Ctrl + N</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-850">
                <span className="text-slate-500 text-[10px] block">EDIT CELL</span>
                <span className="text-slate-200">Double Click / Enter</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-850">
                <span className="text-slate-500 text-[10px] block">NEXT CELL</span>
                <span className="text-slate-200">Tab / Arrows</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-850">
                <span className="text-slate-500 text-[10px] block">COPY TSV</span>
                <span className="text-slate-200">⌘/Ctrl + C</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-850">
                <span className="text-slate-500 text-[10px] block">CANCEL EDIT</span>
                <span className="text-slate-200">Escape</span>
              </div>
            </div>
          </div>

          {/* Offline & Security Guarantee */}
          <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-emerald-400 block mb-0.5">
                Local-Only Execution Verified
              </span>
              <span>
                All workbook models, formulas, and exports run strictly in client memory. No telemetry, no cloud dependencies, and 100% functional without an active internet connection.
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">Electron v34+ & Next.js Engine</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-md font-medium cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
