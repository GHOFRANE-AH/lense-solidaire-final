import { useState } from "react";

function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [name, setName] = useState("");
  const [etat, setEtat] = useState("bon");
  const [taille, setTaille] = useState("petit");
  const [resultat, setResultat] = useState(null);
  const [historique, setHistorique] = useState([]);

  const handleImageChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const supprimerImage = () => {
    setImage(null);
    setPreview(null);
  };

  const effacerHistorique = () => {
    setHistorique([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return alert("Ajoute une image");

    const formData = new FormData();
    formData.append("image", image);
    formData.append("etat", etat);
    formData.append("taille", taille);

    const res = await fetch("http://localhost:5000/estimation", {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    const info = {
      objet: data.nomObjet,
      prixDetecte: data.prixDetecte || data.prix,
      prixEstime: data.prix,
      date: new Date().toLocaleString(),
      image: preview
    };

    setResultat(info);

    setHistorique((prev) => [info, ...prev]);
  };

  return (
    <div style={{ padding: 20, maxWidth: 420, margin: "0 auto", fontFamily: "Arial" }}>

      {/* ---- Résultat en haut --- */}
      {resultat && (
        <div style={{
          background: "#fff",
          padding: 15,
          borderRadius: 12,
          marginBottom: 20,
          boxShadow: "0 3px 10px rgba(0,0,0,0.2)"
        }}>
          <h3 style={{ marginTop: 0 }}>🎯 Résultat</h3>

          <p><strong>Objet reconnu :</strong> {resultat.objet}</p>
          <p><strong>Prix estimé :</strong> {resultat.prixEstime} €</p>
          <p><strong>Date :</strong> {resultat.date}</p>
        </div>
      )}

      {/* ---- Formulaire --- */}
      <div style={{
        background: "#fff",
        padding: 20,
        borderRadius: 15,
        boxShadow: "0 3px 10px rgba(0,0,0,0.15)"
      }}>
        <h2>📸 Estimer un objet</h2>

        <form onSubmit={handleSubmit}>

          <label>Photo :</label>
          <div style={{ display: "flex", gap: 10 }}>
            <input type="file" accept="image/*" onChange={handleImageChange} />

            {/* bouton caméra mobile */}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              style={{ width: 120, cursor: "pointer" }}
            />
          </div>

          {preview && (
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <img src={preview} alt="" style={{ width:120, borderRadius:12 }} /><br/>
              <button type="button" onClick={supprimerImage}
                style={{ marginTop: 5, background:"#ff3b3b", color:"white", border:0, padding:"5px 10px", borderRadius:8 }}
              >
                Supprimer image
              </button>
            </div>
          )}

          <label>État :</label>
          <select value={etat} onChange={(e)=>setEtat(e.target.value)} style={{ width:"100%", marginBottom:10 }}>
            <option value="bon">Bon état</option>
            <option value="tres_bon">Très bon état</option>
          </select>

          <label>Taille :</label>
          <select value={taille} onChange={(e)=>setTaille(e.target.value)} style={{ width:"100%", marginBottom:10 }}>
            <option value="petit">Petit</option>
            <option value="moyen">Moyen</option>
            <option value="grand">Grand</option>
          </select>

          <button type="submit"
            style={{ width:"100%", background:"#2b7fff", color:"white", padding:12, border:0, borderRadius:10, cursor:"pointer" }}
          >
            Estimer
          </button>
        </form>
      </div>

      {/* ---- Historique --- */}
      {historique.length > 0 && (
        <div style={{ marginTop:25 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <h3>🕘 Historique</h3>
            <button onClick={effacerHistorique} style={{ padding:"5px 10px", background:"#ff4747", color:"#fff", border:0, borderRadius:8 }}>
              Effacer
            </button>
          </div>

          <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
            {historique.map((item, i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <img src={item.image} alt="" style={{ width:70, height:70, borderRadius:10, objectFit:"cover" }} />
                <p style={{ margin:0, fontSize:12 }}>{item.prixEstime} €</p>
                <p style={{ margin:0, fontSize:10 }}>{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}
{/* ---- Contact --- */}
<div style={{ 
  marginTop: 40, 
  padding: 15, 
  textAlign: "center", 
  fontSize: "14px",
  background: "#ffffffb5",
  borderRadius: 10,
  border: "1px solid #ddd"
}}>
  <p style={{ marginBottom: 5, fontWeight: "bold" }}>
    📧 Me contacter
  </p>

  <p style={{ margin: "5px 0" }}>
    Pour plus d'informations ou propositions :
  </p>

  <a 
    href="mailto:ghofraneah25@gmail.com" 
    style={{ 
      color: "#2b7fff", 
      fontWeight: "bold", 
      textDecoration: "none" 
    }}
  >
    ghofraneah25@gmail.com
  </a>
</div>

    </div>
    
  );
}

export default Home;
