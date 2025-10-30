import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Footer from '../components/Footer';

function Home() {
  const { t } = useTranslation();

  const [image, setImage] = useState(null);
  const [etat, setEtat] = useState('bon');
  const [taille, setTaille] = useState('petit');
  const [prix, setPrix] = useState(null);
  const [nomObjet, setNomObjet] = useState('');
  const [message, setMessage] = useState('');
  const [historique, setHistorique] = useState([]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', image);
    formData.append('etat', etat);
    formData.append('taille', taille);

    const res = await fetch('http://localhost:5000/estimation', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setPrix(data.prix);
    setNomObjet(data.nomObjet);
    setMessage(data.message || '');

    setHistorique((prev) => [
      {
        nom: data.nomObjet,
        prix: data.prix,
        message: data.message,
        image: URL.createObjectURL(image),
        date: new Date().toLocaleString(),
      },
      ...prev,
    ]);
  };

  const handleClearHistorique = () => {
    if (window.confirm(t('history.clear') + ' ?')) {
      setHistorique([]);
    }
  };

  return (
    <>
      <div className="container" style={{ maxWidth: '500px', margin: '2rem auto' }}>
        <h2 style={{ textAlign: 'center' }}>Lense - Solidaire - Artilleuses</h2>

        {/* Résultat affiché en haut */}
        {prix !== null && (
          <div
            style={{
              backgroundColor: '#f0f8ff',
              border: '1px solid #ccc',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '2rem',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              textAlign: 'center',
              maxWidth: '300px',
              margin: '0 auto',
            }}
          >
            <h3>🔍 {t('result.title')}</h3>
            <p>
              <strong>{t('result.object')} :</strong> {nomObjet}
            </p>
            <p>
              <strong>{t('result.price')} :</strong> {prix} €
            </p>
            {message && (
              <p style={{ fontStyle: 'italic', color: '#555' }}>
                {t(`messages.${message}`)}
              </p>
            )}
          </div>
        )}

        {/* Formulaire */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
        >
          <input type="file" accept="image/*" onChange={handleImageChange} required />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Aperçu"
              style={{ maxWidth: '100%', maxHeight: '300px', marginTop: '1rem' }}
            />
          )}

          <label>
            {t('etat_label')} :
            <select value={etat} onChange={(e) => setEtat(e.target.value)}>
              <option value="bon">{t('etat.bon')}</option>
              <option value="tres_bon">{t('etat.tres_bon')}</option>
            </select>
          </label>

          <label>
            {t('taille_label')} :
            <select value={taille} onChange={(e) => setTaille(e.target.value)}>
              <option value="petit">{t('taille.petit')}</option>
              <option value="moyen">{t('taille.moyen')}</option>
              <option value="grand">{t('taille.grand')}</option>
            </select>
          </label>

          <button type="submit">{t('form.submit')}</button>
        </form>

        {/* Historique */}
        {historique.length > 0 && (
          <div style={{ marginTop: '2rem' }}>
            <h3>🕘 {t('history.title')}</h3>

            <button
              onClick={handleClearHistorique}
              style={{
                marginBottom: '1rem',
                backgroundColor: '#ffdddd',
                border: '1px solid #cc0000',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {t('history.clear')}
            </button>

            <ul style={{ listStyle: 'none', padding: 0 }}>
              {historique.map((item, index) => (
                <li
                  key={index}
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '1rem',
                    marginBottom: '1rem',
                    backgroundColor: '#fafafa',
                  }}
                >
                  <p>
                    <strong>{t('result.object')} :</strong> {item.nom}
                  </p>
                  <p>
                    <strong>{t('result.price')} :</strong> {item.prix} €
                  </p>
                  {item.message && (
                    <p style={{ fontStyle: 'italic' }}>
                      {t(`messages.${item.message}`)}
                    </p>
                  )}
                  <p>
                    <small>{t('history.date')}: {item.date}</small>
                  </p>
                  <img
                    src={item.image}
                    alt="Aperçu"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section contact */}
      <section
        style={{
          padding: '2rem',
          backgroundColor: '#f0f0f0',
          textAlign: 'center',
          marginTop: '3rem',
          borderTop: '1px solid #ccc',
        }}
      >
        <h3>📬 {t('contact.title')}</h3>
        <p>{t('contact.text')}</p>
        <p>{t('contact.email')}</p>
        <a
          href="mailto:ghofraneah25@gmail.com"
          style={{ fontWeight: 'bold', color: '#0077cc' }}
        >
          ghofraneah25@gmail.com
        </a>
      </section>

      <Footer />
    </>
  );
}

export default Home;
