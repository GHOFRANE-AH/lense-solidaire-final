import { useState } from 'react';

function ImageUpload({ setPrice }) {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [etat, setEtat] = useState('bon');
  const [taille, setTaille] = useState('petit');

  const handleChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!image) return;
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <div>
        <input type="file" accept="image/*" onChange={handleChange} />
        {previewUrl && (
          <img src={previewUrl} alt="Aperçu" style={{ width: '120px', height: 'auto', marginTop: '0.5rem', borderRadius: '6px', border: '1px solid #ccc' }} />
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label>
          État :
          <select value={etat} onChange={(e) => setEtat(e.target.value)}>
            <option value="bon">Bon état</option>
            <option value="tres_bon">Très bon état</option>
          </select>
        </label>

        <label>
          Taille :
          <select value={taille} onChange={(e) => setTaille(e.target.value)}>
            <option value="petit">Petit</option>
            <option value="moyen">Moyen</option>
            <option value="grand">Grand</option>
          </select>
        </label>

        <button type="submit">Envoyer la photo</button>
      </div>
    </form>
  );
}

export default ImageUpload;
