const fs = require('fs');
const path = require('path');

// Dossiers à exclure
const EXCLUDED_DIRS = [
  'node_modules',
  '.git',
  '.expo',
  'ios',
  'android',
  '.vscode',
  '.cursor',
  'dist',
  'build',
  'coverage',
  '.next',
  'out'
];

// Fichiers à exclure
const EXCLUDED_FILES = [
  'package-lock.json',
  'yarn.lock',
  '.DS_Store',
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'concat-code.js',
  'concatenated-code.txt'
];

// Extensions de fichiers à inclure
const INCLUDED_EXTENSIONS = [
  '.ts', '.tsx', '.js', '.jsx',
  '.json', '.md', '.txt',
  '.css', '.scss', '.sass',
  '.html', '.xml', '.yml', '.yaml',
  '.sql', '.toml', '.config.js'
];

// Fonction pour vérifier si un fichier doit être inclus
function shouldIncludeFile(filePath, fileName) {
  // Exclure les fichiers spécifiques
  if (EXCLUDED_FILES.includes(fileName)) {
    return false;
  }
  
  // Inclure seulement les extensions spécifiées
  const ext = path.extname(fileName);
  if (ext && !INCLUDED_EXTENSIONS.includes(ext)) {
    return false;
  }
  
  // Inclure les fichiers sans extension si ils ont des noms spéciaux
  if (!ext && !['README', 'LICENSE', 'CHANGELOG', 'Dockerfile'].includes(fileName)) {
    return false;
  }
  
  return true;
}

// Fonction pour vérifier si un dossier doit être exclu
function shouldExcludeDir(dirName) {
  return EXCLUDED_DIRS.includes(dirName) || dirName.startsWith('.');
}

// Fonction récursive pour parcourir les fichiers
function walkDirectory(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      if (!shouldExcludeDir(file)) {
        walkDirectory(filePath, fileList);
      }
    } else {
      if (shouldIncludeFile(filePath, file)) {
        fileList.push(filePath);
      }
    }
  });
  
  return fileList;
}

// Fonction pour formater le contenu d'un fichier
function formatFileContent(filePath, content) {
  const relativePath = path.relative(process.cwd(), filePath);
  const separator = '='.repeat(80);
  
  return `${separator}
FILE: ${relativePath}
${separator}

${content}

`;
}

// Fonction principale
function concatenateCode() {
  console.log('🚀 Début de la concaténation du code...');
  
  const projectRoot = process.cwd();
  const outputFile = path.join(projectRoot, 'concatenated-code.txt');
  
  // Obtenir la liste de tous les fichiers
  const fileList = walkDirectory(projectRoot);
  
  console.log(`📁 ${fileList.length} fichiers trouvés`);
  
  // Trier les fichiers par nom pour un ordre cohérent
  fileList.sort();
  
  let concatenatedContent = '';
  let processedFiles = 0;
  let errors = 0;
  
  // En-tête du fichier de sortie
  concatenatedContent += `CONCATENATED CODE - ${new Date().toISOString()}
${'='.repeat(80)}
PROJET: ${path.basename(projectRoot)}
TOTAL DE FICHIERS: ${fileList.length}
${'='.repeat(80)}

`;
  
  // Traiter chaque fichier
  fileList.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      concatenatedContent += formatFileContent(filePath, content);
      processedFiles++;
      
      if (processedFiles % 10 === 0) {
        console.log(`📄 Traité ${processedFiles}/${fileList.length} fichiers...`);
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la lecture de ${filePath}:`, error.message);
      errors++;
    }
  });
  
  // Écrire le fichier de sortie
  try {
    fs.writeFileSync(outputFile, concatenatedContent, 'utf8');
    console.log(`✅ Concaténation terminée !`);
    console.log(`📊 Statistiques:`);
    console.log(`   - Fichiers traités: ${processedFiles}`);
    console.log(`   - Erreurs: ${errors}`);
    console.log(`   - Taille du fichier: ${(fs.statSync(outputFile).size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📝 Fichier de sortie: ${outputFile}`);
  } catch (error) {
    console.error('❌ Erreur lors de l\'écriture du fichier de sortie:', error.message);
  }
}

// Exécuter le script
concatenateCode(); 