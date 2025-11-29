"use client";
import { useEffect } from 'react';

export default function SecurityLayer() {
  useEffect(() => {
    // --- 1. CONSOLE EASTER EGG ---
    const message = "🔒 SYSTEM ARCHITECTURE SECURED.";
    const subMsg = "If you would like to know how I built this, you can pay for my services.\n\nContact: jmarinonyc@gmail.com";
    
    const titleStyle = [
      "font-size: 16px",
      "font-weight: bold",
      "color: #3b82f6", // Blue-500
      "background-color: #0f172a", // Slate-900
      "padding: 10px 20px",
      "border-radius: 5px",
      "border: 1px solid #1e293b"
    ].join(';');

    const bodyStyle = [
      "font-size: 12px",
      "color: #94a3b8", // Slate-400
      "padding-top: 10px",
    ].join(';');

    console.clear();
    console.log(`%c${message}`, titleStyle);
    console.log(`%c${subMsg}`, bodyStyle);

    // --- 2. DISABLE RIGHT CLICK ---
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // --- 3. DISABLE INSPECTOR SHORTCUTS ---
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Block Ctrl+Shift+I / Cmd+Opt+I (Inspect)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
      }
      // Block Ctrl+Shift+J / Cmd+Opt+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
      }
      // Block Ctrl+U / Cmd+U (View Source)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return null; // Headless component
}
