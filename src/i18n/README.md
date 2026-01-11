# Internationalization (i18n) Guide

## Overview

This project uses `i18next` and `react-i18next` for internationalization support.

## Supported Languages

- **English (en)** - Default language
- **Spanish (es)** - Español

## Usage

### In React Components

```tsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.title')}</h1>
      <p>{t('dashboard.welcome')}</p>
    </div>
  );
}
```

### Changing Language

The language switcher is available in the sidebar footer. Users can:
1. Click the language icon (🌐)
2. Select their preferred language from the dropdown
3. The selection is saved in localStorage

### Adding New Translations

1. **Add to English** (`src/i18n/locales/en.json`):
```json
{
  "mySection": {
    "myKey": "My English Text"
  }
}
```

2. **Add to Spanish** (`src/i18n/locales/es.json`):
```json
{
  "mySection": {
    "myKey": "Mi Texto en Español"
  }
}
```

3. **Use in Component**:
```tsx
{t('mySection.myKey')}
```

## Translation Keys Structure

```
common          - Common UI elements (buttons, actions)
nav             - Navigation menu items
dashboard       - Dashboard page
appointments    - Appointments page and forms
patients        - Patients page and forms
notifications   - Notifications
settings        - Settings page
calendar        - Calendar page
forms           - Form validation messages
```

## Adding a New Language

1. Create a new JSON file in `src/i18n/locales/` (e.g., `fr.json`)
2. Copy the structure from `en.json` and translate all values
3. Import and add to `src/i18n/config.ts`:
```ts
import fr from './locales/fr.json';

i18n.init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr }, // Add new language
  },
  // ...
});
```
4. Add to the language switcher in `src/components/LanguageSwitcher.tsx`:
```ts
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' }, // Add new language
];
```

## Features

- ✅ Automatic language detection from browser
- ✅ Language preference saved in localStorage
- ✅ Real-time language switching without page reload
- ✅ Fallback to English for missing translations
- ✅ Type-safe translation keys (TypeScript support)

## Best Practices

1. **Keep keys organized** - Group related translations together
2. **Use descriptive keys** - `dashboard.todayAppointments` not `dash.ta`
3. **Avoid hardcoded text** - Always use translation keys
4. **Test both languages** - Ensure UI looks good in all languages
5. **Handle plurals** - Use i18next plural features when needed
6. **Keep translations consistent** - Use the same terms throughout

## Example: Complete Component with i18n

```tsx
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export function MyPage() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('myPage.title')}</h1>
      <p>{t('myPage.description')}</p>
      <Button>{t('common.save')}</Button>
      <Button variant="outline">{t('common.cancel')}</Button>
    </div>
  );
}
```
