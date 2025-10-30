import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      © {new Date().getFullYear()} Lense-Solidaire — développé par <strong>Ghofrane Hedna</strong> — Tous droits réservés.
    </footer>
  );
}
