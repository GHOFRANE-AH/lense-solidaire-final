import React from 'react';
import './About.css';

export default function About() {
  return (
    <div className="about-container">
      <h1>À propos de nous</h1>
      <p>
        Ce projet a été réalisé dans le cadre d’une initiative solidaire portée par notre association.
        Il a été développé bénévolement par une jeune femme algérienne en insertion professionnelle,
        diplômée en intelligence artificielle dans son pays, et spécialisée dans la vente depuis plus de deux ans et demi.
      </p>
      <p>
        Elle a conçu cette application comme un outil pour notre <strong>boutique solidaire</strong>,
        afin de proposer une estimation cohérente des prix des articles de seconde main.
        L’objectif est d’éviter les écarts de prix pour des objets similaires, et de garantir une tarification juste et transparente.
      </p>

      <h2>Droits d’auteur</h2>
      <p>
        
      </p>
      <p>
        © {new Date().getFullYear()} Lense-Solidaire développé par GHOFRANE hedna — Tous droits réservés.
      </p>
    </div>
  );
}
