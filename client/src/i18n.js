import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en.json';
import siTranslations from './locales/si.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      si: { translation: siTranslations }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes by default
    }
  });

// Set initial class
document.body.classList.add(`lang-${i18n.language}`);

// Update class on language change
i18n.on('languageChanged', (lng) => {
  document.body.classList.remove('lang-en', 'lang-si');
  document.body.classList.add(`lang-${lng}`);
});

export default i18n;
