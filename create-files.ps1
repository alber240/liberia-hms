# create-files.ps1 - Automatic file creator for LiberiaHMS

Write-Host "Creating HMS files..." -ForegroundColor Green

# Create public/index.html
@"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>LiberiaHMS - Hospital Management System</title>
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json">
    <meta name="theme-color" content="#0f2b3d">
</head>
<body>
    <div id="root"></div>
</body>
</html>
"@ | Out-File -FilePath "public\index.html" -Encoding utf8

# Create public/manifest.json
@"
{
    "name": "LiberiaHMS",
    "short_name": "LibHMS",
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#0f2b3d",
    "background_color": "#e8f0fe",
    "lang": "en"
}
"@ | Out-File -FilePath "public\manifest.json" -Encoding utf8

# Create src/i18n/en.json
@"
{
    "app": {
        "title": "LiberiaHMS - Hospital Management System",
        "subtitle": "Offline-First | West Africa"
    },
    "nav": {
        "dashboard": "Dashboard",
        "registration": "Patient Registration",
        "patients": "Patient List"
    },
    "registration": {
        "title": "Register New Patient",
        "uhid": "Unique Health ID (UHID)",
        "fullName": "Full Name",
        "dateOfBirth": "Date of Birth",
        "gender": "Gender",
        "male": "Male",
        "female": "Female",
        "other": "Other",
        "phone": "Phone Number",
        "alternatePhone": "Alternate Phone",
        "address": "Address",
        "emergencyContact": "Emergency Contact Name",
        "emergencyPhone": "Emergency Contact Phone",
        "submit": "Register Patient",
        "reset": "Reset Form",
        "success": "Patient registered successfully! UHID: {{uhid}}",
        "duplicateWarning": "Possible duplicate found. Check existing records.",
        "required": "This field is required",
        "uhidAuto": "Will be auto-generated"
    },
    "dashboard": {
        "todayVisits": "Today's Visits",
        "bedOccupancy": "Bed Occupancy",
        "totalPatients": "Total Patients",
        "offlineQueue": "Offline Queue",
        "recentPatients": "Recent Patients"
    },
    "offline": {
        "online": "Online - Synced",
        "offline": "Offline Mode - Working locally",
        "queued": "{{count}} items waiting to sync"
    },
    "common": {
        "save": "Save",
        "cancel": "Cancel",
        "search": "Search",
        "edit": "Edit",
        "delete": "Delete",
        "loading": "Loading..."
    }
}
"@ | Out-File -FilePath "src\i18n\en.json" -Encoding utf8

# Create src/i18n/fr.json
@"
{
    "app": {
        "title": "LiberiaHMS - Système de Gestion Hospitalière",
        "subtitle": "Hors ligne d'abord | Afrique de l'Ouest"
    },
    "nav": {
        "dashboard": "Tableau de bord",
        "registration": "Enregistrement Patient",
        "patients": "Liste des Patients"
    },
    "registration": {
        "title": "Enregistrer un Nouveau Patient",
        "uhid": "Identifiant Unique (UHID)",
        "fullName": "Nom Complet",
        "dateOfBirth": "Date de Naissance",
        "gender": "Sexe",
        "male": "Masculin",
        "female": "Féminin",
        "other": "Autre",
        "phone": "Numéro de Téléphone",
        "alternatePhone": "Téléphone Secondaire",
        "address": "Adresse",
        "emergencyContact": "Contact d'Urgence (Nom)",
        "emergencyPhone": "Téléphone d'Urgence",
        "submit": "Enregistrer le Patient",
        "reset": "Réinitialiser",
        "success": "Patient enregistré avec succès! UHID: {{uhid}}",
        "duplicateWarning": "Doublon possible trouvé. Vérifiez les enregistrements existants.",
        "required": "Ce champ est obligatoire",
        "uhidAuto": "Sera généré automatiquement"
    },
    "dashboard": {
        "todayVisits": "Visites Aujourd'hui",
        "bedOccupancy": "Occupation des Lits",
        "totalPatients": "Nombre Total de Patients",
        "offlineQueue": "File d'attente hors ligne",
        "recentPatients": "Patients Récents"
    },
    "offline": {
        "online": "En ligne - Synchronisé",
        "offline": "Mode Hors Ligne - Travail local",
        "queued": "{{count}} éléments en attente de synchronisation"
    },
    "common": {
        "save": "Enregistrer",
        "cancel": "Annuler",
        "search": "Rechercher",
        "edit": "Modifier",
        "delete": "Supprimer",
        "loading": "Chargement..."
    }
}
"@ | Out-File -FilePath "src\i18n\fr.json" -Encoding utf8

# Create src/i18n/index.ts
@"
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './en.json';
import fr from './fr.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            fr: { translation: fr }
        },
        fallbackLng: 'en',
        interpolation: { escapeValue: false }
    });

export default i18n;
"@ | Out-File -FilePath "src\i18n\index.ts" -Encoding utf8

Write-Host "✅ i18n files created" -ForegroundColor Green

# Create tsconfig.json
@"
{
    "compilerOptions": {
        "target": "ES2020",
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "jsx": "react-jsx",
        "module": "ESNext",
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "allowJs": true,
        "strict": true,
        "noEmit": true,
        "allowSyntheticDefaultImports": true,
        "esModuleInterop": true,
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    },
    "include": ["src"]
}
"@ | Out-File -FilePath "tsconfig.json" -Encoding utf8

Write-Host "✅ tsconfig.json created" -ForegroundColor Green

# Update package.json scripts
$packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
$packageJson.scripts = @{
    "start" = "react-scripts start"
    "build" = "react-scripts build"
    "test" = "react-scripts test"
    "eject" = "react-scripts eject"
}
$packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"

Write-Host "✅ package.json updated" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "File structure created successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Close this Notepad window"
Write-Host "2. In PowerShell, run: npm start" -ForegroundColor White