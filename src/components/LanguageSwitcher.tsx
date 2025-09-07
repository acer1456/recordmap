import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh-TW' ? 'en' : 'zh-TW';
    i18n.changeLanguage(newLang);
  };

  return (
    <button
      onClick={toggleLanguage}
      className="language-switcher"
      title={i18n.language === 'zh-TW' ? t('language.switchToEnglish') : t('language.switchToChinese')}
    >
      {i18n.language === 'zh-TW' ? '🇺🇸 EN' : '🇹🇼 中文'}
    </button>
  );
};

export default LanguageSwitcher;
