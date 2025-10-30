import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import { useTranslation } from 'react-i18next';

function Admin() {
  const { t, i18n } = useTranslation();

  const [step, setStep] = useState(1); // 1: login, 2: OTP, 3: admin
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');

  const [formData, setFormData] = useState({
    nom: '',
    categorie: 'vaisselles',
    etat: 'bon',
    taille: 'petit',
    prix: '',
  });

  const [rules, setRules] = useState([]);
  const [editId, setEditId] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('✅ Code OTP envoyé par email');
        setStep(2);
      } else {
        alert(data.error || t('login_error'));
      }
    } catch (err) {
      alert(t('connection_error'));
      console.error(err);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.token);
        setStep(3);
      } else {
        alert(data.error || 'Code incorrect');
      }
    } catch (err) {
      alert(t('connection_error'));
      console.error(err);
    }
  };

  const fetchRules = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/rules', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRules(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(t('fetch_error'), err);
      setRules([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rule = {
      nom: formData.nom,
      categorie: formData.categorie,
      etat: formData.etat,
      taille: formData.taille,
      prix: formData.prix ? Number(formData.prix) : 0,
    };

    try {
      const url = editId
        ? `http://localhost:5000/admin/rules/${editId}`
        : 'http://localhost:5000/admin/rules';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rule),
      });

      const data = await res.json();
      if (res.ok) {
        alert(editId ? t('rule_updated') : t('rule_saved'));
        setFormData({
          nom: '',
          categorie: 'vaisselles',
          etat: 'bon',
          taille: 'petit',
          prix: '',
        });
        setEditId(null);
        fetchRules();
      } else {
        alert('Erreur : ' + data.error);
      }
    } catch (err) {
      alert(t('save_error'));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirm_delete'))) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/rules/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchRules();
      } else {
        alert('Erreur : ' + data.error);
      }
    } catch (err) {
      alert(t('delete_error'));
      console.error(err);
    }
  };

  useEffect(() => {
    if (step === 3) fetchRules();
  }, [step]);

  const handleLogout = () => {
    setStep(1);
    setLogin('');
    setPassword('');
    setCode('');
    setToken('');
    setFormData({ nom: '', categorie: 'vaisselles', etat: 'bon', taille: 'petit', prix: '' });
    setEditId(null);
    setRules([]);
  };

  return (
    <>
      {step === 1 && (
        <form onSubmit={handleLogin} style={{ maxWidth: '300px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2>{t('login_title')}</h2>
          <select onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>
          <input type="text" placeholder={t('username')} value={login} onChange={(e) => setLogin(e.target.value)} required />
          <input type="password" placeholder={t('password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button type="submit">{t('login')}</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerify} style={{ maxWidth: '300px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h2>🔐 {t('otp_verification') || 'Vérification OTP'}</h2>
          <input type="text" placeholder="Code OTP reçu par email" value={code} onChange={(e) => setCode(e.target.value)} required />
          <button type="submit">{t('verify') || 'Vérifier'}</button>
        </form>
      )}

      {step === 3 && (
        <div className="container" style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <h2>{editId ? t('edit') : t('admin_title')}</h2>

          <button onClick={handleLogout} style={{ marginBottom: '1rem' }}>
            {t('Déconnexion') || 'Déconnexion'}
          </button>

          <select onChange={(e) => i18n.changeLanguage(e.target.value)} value={i18n.language}>
            <option value="fr">Français</option>
            <option value="en">English</option>
            <option value="ar">العربية</option>
          </select>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" name="nom" placeholder="Nom de l’article" value={formData.nom} onChange={handleChange} required />
            <label>
              Catégorie :
              <select name="categorie" value={formData.categorie} onChange={handleChange}>
                <option value="vaisselles">Vaisselles</option>
                <option value="meubles">Meubles</option>
                <option value="déco">Déco</option>
                <option value="électroménager">Électroménager</option>
              </select>
            </label>
            <label>
              État :
              <select name="etat" value={formData.etat} onChange={handleChange}>
                <option value="bon">Bon état</option>
                <option value="tres_bon">Très bon état</option>
              </select>
            </label>
            <label>
              Taille :
              <select name="taille" value={formData.taille} onChange={handleChange}>
                <option value="petit">Petit</option>
                <option value="moyen">Moyen</option>
                <option value="grand">Grand</option>
              </select>
            </label>
            <input type="number" name="prix" placeholder="Prix (€)" value={formData.prix} onChange={handleChange} required />

            <button type="submit">{editId ? t('edit') : t('save_rule')}</button>
          </form>

          <h3 style={{ marginTop: '2rem' }}>{t('rules_list')}</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>État</th>
                <th>Taille</th>
                <th>Prix (€)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(rules) && rules.length > 0 ? (
                rules.map((rule) => (
                  <tr key={rule._id}>
                    <td>{rule.nom}</td>
                    <td>{rule.categorie}</td>
                    <td>{rule.etat}</td>
                    <td>{rule.taille}</td>
                    <td>{rule.prix}</td>
                    <td>
                      <button onClick={() => {
                        setFormData({
                          nom: rule.nom,
                          categorie: rule.categorie,
                          etat: rule.etat,
                          taille: rule.taille,
                          prix: rule.prix,
                        });
                        setEditId(rule._id);
                      }}>{t('edit')}</button>
                      <button onClick={() => handleDelete(rule._id)}>{t('delete')}</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ color: 'red', textAlign: 'center' }}>
                    ⚠️ {t('no_rules_found') || 'Aucune règle enregistrée'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Admin;
