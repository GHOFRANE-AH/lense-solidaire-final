import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      login_title: "Connexion Admin",
      username: "Identifiant",
      password: "Mot de passe",
      login: "Se connecter",
      admin_title: "Ajouter une règle tarifaire",
      save_rule: "Sauvegarder la règle",
      edit: "Modifier",
      delete: "Supprimer",
      rules_list: "Règles enregistrées",
      rule_saved: "Règle enregistrée !",
      rule_updated: "Règle modifiée !",
      connection_error: "Erreur de connexion",
      login_error: "Identifiants incorrects",
      save_error: "Erreur lors de l’enregistrement",
      fetch_error: "Erreur chargement règles",
      delete_error: "Erreur lors de la suppression",
      confirm_delete: "Supprimer cette règle ?"
    }
  },
  en: {
    translation: {
      login_title: "Admin Login",
      username: "Username",
      password: "Password",
      login: "Login",
      admin_title: "Add Pricing Rule",
      save_rule: "Save Rule",
      edit: "Edit",
      delete: "Delete",
      rules_list: "Saved Rules",
      rule_saved: "Rule saved!",
      rule_updated: "Rule updated!",
      connection_error: "Connection error",
      login_error: "Incorrect credentials",
      save_error: "Error saving rule",
      fetch_error: "Error loading rules",
      delete_error: "Error deleting rule",
      confirm_delete: "Delete this rule?"
    }
  },
  ar: {
    translation: {
      login_title: "تسجيل دخول المسؤول",
      username: "اسم المستخدم",
      password: "كلمة المرور",
      login: "تسجيل الدخول",
      admin_title: "إضافة قاعدة تسعير",
      save_rule: "حفظ القاعدة",
      edit: "تعديل",
      delete: "حذف",
      rules_list: "القواعد المسجلة",
      rule_saved: "تم حفظ القاعدة!",
      rule_updated: "تم تعديل القاعدة!",
      connection_error: "خطأ في الاتصال",
      login_error: "بيانات الدخول غير صحيحة",
      save_error: "حدث خطأ أثناء الحفظ",
      fetch_error: "حدث خطأ أثناء تحميل القواعد",
      delete_error: "حدث خطأ أثناء الحذف",
      confirm_delete: "هل تريد حذف هذه القاعدة؟"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'fr', // langue par défaut
  fallbackLng: 'fr',
  interpolation: {
    escapeValue: false
  }
});

export default i18n;
