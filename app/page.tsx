"use client";

import React, { useState, useRef } from 'react';
import { 
  Folder, 
  File,  
  Download, 
  Loader2, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  FileJson, 
  FileImage, 
  FileAudio, 
  FileVideo, 
  FileText,
  FileCode2,
  Settings,
  X
} from 'lucide-react';

import { 
  SiTypescript, 
  SiJavascript, 
  SiReact, 
  SiHtml5, 
  SiCss, 
  SiMarkdown, 
  SiJson, 
  SiSass 
} from 'react-icons/si';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: { [key: string]: FileNode };
}

const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();

  switch (ext) {
    // File TypeScript / TSX
    case 'tsx':
      return <SiReact size={16} className="text-[#61dafb]" />; // Logo React Biru
    case 'ts':
      return <SiTypescript size={16} className="text-[#3178c6]" />; // Logo TS Biru Tua
    
    // File JavaScript / JSX
    case 'jsx':
      return <SiReact size={16} className="text-[#f7df1e]" />; // Logo React Kuning (JSX)
    case 'js':
    case 'mjs':
    case 'cjs':
      return <SiJavascript size={16} className="text-[#f7df1e] bg-black rounded-sm" />; // Logo JS Kuning

    // File Web Standard & Styling
    case 'html':
      return <SiHtml5 size={16} className="text-[#e34c26]" />;
    case 'css':
      return <SiCss size={16} className="text-[#1572b6]" />;
    case 'scss':
    case 'sass':
      return <SiSass size={16} className="text-[#cc6699]" />;

    // File Dokumentasi & Data
    case 'md':
    case 'mdx':
      return <SiMarkdown size={16} className="text-[#000000] bg-white rounded-sm" />;
    case 'json':
      return <SiJson size={16} className="text-[#000000] bg-[#cbd5e1] rounded-sm p-0.5" />;

    // SVG (Satu-satunya media yang lolos filter)
    case 'svg':
      return <FileCode2 size={16} className="text-[#ff9e0f]" />;

    // Default jika ekstensi lainnya tidak spesifik
    default:
      return <File size={16} className="text-[#8b949e]" />;
  }
};

// Fungsi rekursif untuk membuat visualisasi pohon folder ASCII ala GitHub
const generateAsciiTree = (node: FileNode, prefix: string = ""): string => {
  if (!node.children) return "";

  let result = "";
  const keys = Object.keys(node.children).sort((a, b) => {
    const nodeA = node.children![a];
    const nodeB = node.children![b];
    // Dahulukan folder baru file (sesuai standar Git)
    if (nodeA.type !== nodeB.type) {
      return nodeA.type === 'folder' ? -1 : 1;
    }
    return a.localeCompare(b);
  });

  keys.forEach((key, index) => {
    const child = node.children![key];
    const isLast = index === keys.length - 1;
    
    // Tentukan karakter cabang pohon (├─ atau └─)
    const connector = isLast ? "└── " : "├── ";
    
    // Tambahkan garis lurus (│) untuk folder yang masih memiliki cabang ke bawah
    result += `${prefix}${connector}${child.name}${child.type === 'folder' ? '/' : ''}\n`;
    
    if (child.type === 'folder') {
      const newPrefix = prefix + (isLast ? "    " : "│   ");
      result += generateAsciiTree(child, newPrefix);
    }
  });

  return result;
};

// Label teks yang dibutuhkan oleh RenderTree (disalurkan via props)
interface RenderTreeLabels {
  statusIgnored: string;
  treeHeader: string;
  treeOpen: string;
  treeClose: string;
}

interface RenderTreeProps {
  node: FileNode;
  isInIgnoredFolder: (nameOrPath: string) => boolean;
  shouldProcessFile: (fileName: string) => boolean;
  labels: RenderTreeLabels;
}

// Komponen rekursif untuk merender struktur folder tree ala GitHub (Bisa Buka-Tutup)
// Didefinisikan DI LUAR komponen utama agar identitasnya stabil antar render,
// sehingga state lokal `openFolders` tidak ter-reset setiap parent re-render.
const RenderTree = ({ node, isInIgnoredFolder, shouldProcessFile, labels }: RenderTreeProps) => {
  const [openFolders, setOpenFolders] = useState<{ [key: string]: boolean }>({});

  if (!node.children) return null;

  const sortedKeys = Object.keys(node.children).sort((a, b) => {
    const nodeA = node.children![a];
    const nodeB = node.children![b];
    if (nodeA.type !== nodeB.type) {
      return nodeA.type === 'folder' ? -1 : 1;
    }
    return a.localeCompare(b);
  });

  const toggleFolder = (folderName: string) => {
    setOpenFolders((prev) => ({
      ...prev,
      [folderName]: !prev[folderName],
    }));
  };

  return (
    <div className="w-full">
      {sortedKeys.map((key) => {
        const child = node.children![key];
        const isFile = child.type === 'file';
        const isFolderIgnored = !isFile && isInIgnoredFolder(child.path);
        const isFileIgnored = isFile && (isInIgnoredFolder(child.path) || !shouldProcessFile(child.name));
        const isIgnoredTotal = isFolderIgnored || isFileIgnored;
        const isCurrentFolderOpen = openFolders[child.name];

        return (
          <div key={child.path} className="w-full">
            {/* Baris Berkas (items-center & min-w-0 adalah kunci kerapian) */}
            <div 
              onClick={() => !isFile && toggleFolder(child.name)}
              className={`flex items-center justify-between px-4 py-2 border-b border-[#30363d] hover:bg-[#161b22] text-sm text-[#c9d1d9] transition-colors gap-4 ${
                !isFile ? 'cursor-pointer select-none font-medium' : ''
              }`}
            >
              {/* Bagian Kiri: Kombinasi Indikator, Folder, & Ikon (min-w-0 agar truncate bekerja) */}
              <div className="flex items-center space-x-2 pl-2 min-w-0 flex-1">
                {!isFile ? (
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className={`text-[10px] text-[#8b949e] transition-transform inline-block w-2.5 ${isCurrentFolderOpen ? 'rotate-90' : ''}`}>
                      ▶
                    </span>
                    <Folder size={16} className="text-[#58a6ff] fill-[#58a6ff]/10" />
                  </div>
                ) : (
                  <div className="pl-4 w-8 flex justify-center shrink-0">
                    {getFileIcon(child.name)}
                  </div>
                )}
                
                {/* Teks Nama File dengan Truncate Efek Elipsis jika Terlalu Panjang */}
                <span className={`truncate text-left ${isIgnoredTotal ? 'line-through text-[#8b949e]/50' : ''}`} title={child.name}>
                  {child.name}
                </span>
              </div>
              
              {/* Bagian Kanan: Label Status (w-[110px] agar lebar seragam & whitespace-nowrap mencegah patah kata) */}
              <div className="w-[110px] text-right shrink-0 flex justify-end">
                {isIgnoredTotal ? (
                  <span className="text-xs bg-[#21262d] text-[#8b949e] px-2 py-0.5 rounded border border-[#30363d] whitespace-nowrap">
                    {labels.statusIgnored}
                  </span>
                ) : isFile ? (
                  <span className="text-xs text-[#8b949e]/60 whitespace-nowrap">{labels.treeHeader}</span>
                ) : (
                  <span className="text-xs text-[#58a6ff]/80 bg-[#388bfd]/10 px-1.5 py-0.5 rounded text-[11px] whitespace-nowrap">
                    {isCurrentFolderOpen ? labels.treeClose : labels.treeOpen}
                  </span>
                )}
              </div>
            </div>

            {!isFile && isCurrentFolderOpen && (
              <div className="pl-4 border-l border-[#30363d]/70 bg-[#161b22]/10">
                <RenderTree
                  node={child}
                  isInIgnoredFolder={isInIgnoredFolder}
                  shouldProcessFile={shouldProcessFile}
                  labels={labels}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function GitHubFolderConverter() {
  const [filesList, setFilesList] = useState<File[]>([]);
  const [folderTree, setFolderTree] = useState<FileNode | null>(null);
  const [rootName, setRootName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("Mengekstrak Isi Folder...");
  const [scanProgress, setScanProgress] = useState<{ current: number; total: number | null }>({ current: 0, total: null });
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | '', text: string }>({ type: '', text: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Penambahan untuk setting
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [language, setLanguage] = useState<any>('en');

  // Daftar ekstensi media yang akan di-ignore (kecuali .svg)
  const [ignoredFolders, setIgnoredFolders] = useState<string[]>(['.git', 'node_modules', '.next', '.yalc', '.dist']);
  const [ignoredExtensions, setIgnoredExtensions] = useState<string[]>([
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'ico', 'tiff', 
    'mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv',          
    'mp3', 'wav', 'ogg', 'flac', 'aac',                        
    'pdf', 'zip', 'rar', 'tar', 'gz', '7z', 'exe', 'dmg'       
  ]);

  // daftar file yang akan di ignore
  const [ignoredLockFiles, setIgnoredLockFiles] = useState<string[]>(['package-lock.json', 'pnpm-lock.yaml', 'yarn.lock']);

  // State bantuan untuk menangkap input teks di dalam menu setting
  const [newFolderInput, setNewFolderInput] = useState("");
  const [newExtInput, setNewExtInput] = useState("");
  const [newFileInput, setNewFileInput] = useState("");
  // temp state
  const [tempLanguage, setTempLanguage] = useState<any>('en');
  const [tempFolders, setTempFolders] = useState<string[]>([]);
  const [tempExtensions, setTempExtensions] = useState<string[]>([]);
  const [tempFiles, setTempFiles] = useState<string[]>([]); 

  // Kamus multibahasa lengkap untuk seluruh teks di dalam aplikasi
  const t = {
    id: {
      title: "FolderToMarkdownV2",
      desc: "Ekstrak otomatis struktur teks kode & SVG menjadi dokumentasi Markdown dalam sekali klik.",
      btnPick: "Pilih Folder",
      btnGen: "Generate & Download .md",
      btnProcessing: "Memproses...",
      statusReady: "file teks/SVG siap diekstrak",
      placeholder: "Belum ada folder yang dimuat",
      subPlaceholder: "Silakan klik tombol 'Pilih Folder' di atas untuk memetakan file Anda.",
      settingsTitle: "Pengaturan",
      langSelect: "Pilih Bahasa",
      folderIgnoreTitle: "Folder yang Diabaikan (Ignore)",
      folderPlaceholder: "Contoh: dist, build ",
      ignoreFilePlaceholder: "Contoh: config.js", 
      ignoredExtensionsPlaceholder:"Contoh: log, env",
      fileIgnoreTitle: "File Spesifik yang Diabaikan",
      extIgnoreTitle: "Ekstensi yang Diabaikan",
      addBtn: "Tambah",
      // Tambahan teks baru:
      processingTitle: "Sedang Memproses...",
      treeHeader: "file siap proses",
      treeClose: "Tutup",
      treeOpen: "Buka",
      statusIgnored: "Ignored (Media)",
      scanDirText: "Memindai direktori...",
      mapDirText: "Memetakan struktur Folder...",
      bundleText: "Membaca baris kode, menyaring file biner, dan membundelnya ke dalam format Markdown...",
      downloadSuccess: "File Markdown berhasil dibuat dan di-download!",
      errorNoFiles: "Tidak ada file valid yang bisa diproses.",
      chooseFolderInfo: "pilih-folder-anda"
    },
    en: {
      title: "FolderToMarkdownV2",
      desc: "Automatically extract text code structures & SVG into Markdown documentation in one click.",
      btnPick: "Choose Folder",
      btnGen: "Generate & Download .md",
      btnProcessing: "Processing...",
      statusReady: "text/SVG files ready to extract",
      placeholder: "No folder loaded yet",
      subPlaceholder: "Please click the 'Choose Folder' button above to map your files.",
      settingsTitle: "Settings",
      langSelect: "Select Language",
      folderIgnoreTitle: "Ignored Folders",
      folderPlaceholder: "Example: dist, build ",
      ignoreFilePlaceholder: "Example: config.js",
      ignoredExtensionsPlaceholder:"Example: log, env",
      fileIgnoreTitle: "Ignored Specific Files",
      extIgnoreTitle: "Ignored Extensions",
      addBtn: "Add",
      // Tambahan teks baru:
      processingTitle: "Processing...",
      treeHeader: "file ready to process",
      treeClose: "Close",
      treeOpen: "Open",
      statusIgnored: "Ignored (Media)",
      scanDirText: "Scanning directory...",
      mapDirText: "Mapping folder structure...",
      bundleText: "Reading lines of code, filtering binary files, and bundling them into Markdown format...",
      downloadSuccess: "Markdown file successfully created and downloaded!",
      errorNoFiles: "No valid files available to process.",
      chooseFolderInfo: "select-your-folder"
    }, 
    es: { // Spanyol
      title: "FolderToMarkdownV2",
      desc: "Extraiga automáticamente estructuras de código de texto y SVG en documentación Markdown con un solo clic.",
      btnPick: "Seleccionar Carpeta",
      btnGen: "Generar y Descargar .md",
      btnProcessing: "Procesando...",
      statusReady: "archivos de texto/SVG listos para extraer",
      placeholder: "Ninguna carpeta cargada aún",
      subPlaceholder: "Haga clic en el botón 'Seleccionar Carpeta' de arriba para mapear sus archivos.",
      settingsTitle: "Configuración",
      langSelect: "Seleccionar Idioma",
      folderIgnoreTitle: "Carpetas Ignoradas",
      folderPlaceholder: "Ejemplo: dist, build",
      ignoreFilePlaceholder: "Ejemplo: config.js",
      ignoredExtensionsPlaceholder: "Ejemplo: log, env",
      fileIgnoreTitle: "Archivos Específicos Ignorados",
      extIgnoreTitle: "Extensiones Ignoradas",
      addBtn: "Añadir",
      processingTitle: "Procesando...",
      treeHeader: "archivo listo para procesar",
      treeClose: "Cerrar",
      treeOpen: "Abrir",
      statusIgnored: "Ignorado (Media)",
      scanDirText: "Escaneando directorio...",
      mapDirText: "Mapeando estructura de carpetas...",
      bundleText: "Leyendo líneas de código, filtrando archivos binarios y empaquetando en formato Markdown...",
      downloadSuccess: "¡Archivo Markdown creado y descargado con éxito!",
      errorNoFiles: "No hay archivos válidos disponibles para procesar.",
      chooseFolderInfo: "selecciona-tu-carpeta"
    },
    fr: { // Prancis
      title: "FolderToMarkdownV2",
      desc: "Extrayez automatiquement les structures de code texte et SVG en documentation Markdown en un clic.",
      btnPick: "Choisir un Dossier",
      btnGen: "Générer & Télécharger .md",
      btnProcessing: "Traitement...",
      statusReady: "fichiers texte/SVG prêts à être extraits",
      placeholder: "Aucun dossier chargé pour le moment",
      subPlaceholder: "Veuillez cliquer sur le bouton 'Choisir un Dossier' ci-dessus pour cartographier vos fichiers.",
      settingsTitle: "Paramètres",
      langSelect: "Choisir la Langue",
      folderIgnoreTitle: "Dossiers Ignorés",
      folderPlaceholder: "Exemple: dist, build",
      ignoreFilePlaceholder: "Exemple: config.js",
      ignoredExtensionsPlaceholder: "Exemple: log, env",
      fileIgnoreTitle: "Fichiers Spécifiques Ignorés",
      extIgnoreTitle: "Extensions Ignorées",
      addBtn: "Ajouter",
      processingTitle: "Traitement en cours...",
      treeHeader: "fichier prêt à être traité",
      treeClose: "Fermer",
      treeOpen: "Ouvrir",
      statusIgnored: "Ignoré (Média)",
      scanDirText: "Analyse du répertoire...",
      mapDirText: "Cartographie de la structure du dossier...",
      bundleText: "Lecture des lignes de code, filtrage des fichiers binaires et regroupement au format Markdown...",
      downloadSuccess: "Fichier Markdown créé et téléchargé avec succès !",
      errorNoFiles: "Aucun fichier valide disponible pour le traitement.",
      chooseFolderInfo: "pchoisissez-votre-dossier"
    },
    de: { // Jerman
      title: "FolderToMarkdownV2",
      desc: "Extrahieren Sie Textcode-Strukturen und SVGs mit einem Klick automatisch in eine Markdown-Dokumentation.",
      btnPick: "Ordner Auswählen",
      btnGen: "Generieren & Herunterladen .md",
      btnProcessing: "Verarbeitung...",
      statusReady: "Text-/SVG-Dateien bereit zum Extrahieren",
      placeholder: "Noch kein Ordner geladen",
      subPlaceholder: "Bitte klicken Sie oben auf die Schaltfläche 'Ordner Auswählen', um Ihre Dateien zuzuordnen.",
      settingsTitle: "Einstellungen",
      langSelect: "Sprache Auswählen",
      folderIgnoreTitle: "Ignorierte Ordner",
      folderPlaceholder: "Beispiel: dist, build",
      ignoreFilePlaceholder: "Beispiel: config.js",
      ignoredExtensionsPlaceholder: "Beispiel: log, env",
      fileIgnoreTitle: "Ignorierte Spezifische Dateien",
      extIgnoreTitle: "Ignorierte Erweiterungen",
      addBtn: "Hinzufügen",
      processingTitle: "Verarbeitung...",
      treeHeader: "Datei bereit zur Verarbeitung",
      treeClose: "Schließen",
      treeOpen: "Öffnen",
      statusIgnored: "Ignoriert (Medien)",
      scanDirText: "Verzeichnis wird gescannt...",
      mapDirText: "Ordnerstruktur wird abgebildet...",
      bundleText: "Codezeilen werden gelesen, Binärdateien gefiltert und im Markdown-Format gebündelt...",
      downloadSuccess: "Markdown-Datei erfolgreich erstellt und heruntergeladen!",
      errorNoFiles: "Keine gültigen Dateien zur Verarbeitung verfügbar.",
      chooseFolderInfo: "ordner-auswaehlen"
    },
    ja: { // Jepang
      title: "FolderToMarkdownV2",
      desc: "ワンクリックでテキストコード構造とSVGをMarkdownドキュメントに自動抽出します。",
      btnPick: "フォルダを選択",
      btnGen: ".mdを生成してダウンロード",
      btnProcessing: "処理中...",
      statusReady: "抽出準備完了のテキスト/SVGファイル",
      placeholder: "フォルダがまだ読み込まれていません",
      subPlaceholder: "上の「フォルダを選択」ボタンをクリックして、ファイルをマッピングしてください。",
      settingsTitle: "設定",
      langSelect: "言語を選択",
      folderIgnoreTitle: "無視するフォルダ",
      folderPlaceholder: "例: dist, build",
      ignoreFilePlaceholder: "例: config.js",
      ignoredExtensionsPlaceholder: "例: log, env",
      fileIgnoreTitle: "無視する特定のファイル",
      extIgnoreTitle: "無視する拡張子",
      addBtn: "追加",
      processingTitle: "処理中...",
      treeHeader: "処理待ちファイル",
      treeClose: "閉じる",
      treeOpen: "開く",
      statusIgnored: "無視（メディア）",
      scanDirText: "ディレクトリをスキャン中...",
      mapDirText: "フォルダ構造をマッピング中...",
      bundleText: "コード行を読み込み、バイナリファイルをフィルタリングし、Markdown形式にバンドル中...",
      downloadSuccess: "Markdownファイルが正常に作成され、ダウンロードされました！",
      errorNoFiles: "処理可能な有効なファイルがありません。",
      chooseFolderInfo: "フォルダを選択してください"
    },
    ko: { // Korea
      title: "FolderToMarkdownV2",
      desc: "클릭 한 번으로 텍스트 코드 구조와 SVG를 Markdown 문서로 자동 추출합니다.",
      btnPick: "폴더 선택",
      btnGen: ".md 생성 및 다운로드",
      btnProcessing: "처리 중...",
      statusReady: "추출 준비가 된 텍스트/SVG 파일",
      placeholder: "로드된 폴더가 없습니다",
      subPlaceholder: "위의 '폴더 선택' 버튼을 클릭하여 파일을 매핑하세요.",
      settingsTitle: "설정",
      langSelect: "언어 선택",
      folderIgnoreTitle: "제외할 폴더",
      folderPlaceholder: "예시: dist, build",
      ignoreFilePlaceholder: "예시: config.js",
      ignoredExtensionsPlaceholder: "예시: log, env",
      fileIgnoreTitle: "제외할 특정 파일",
      extIgnoreTitle: "제외할 확장자",
      addBtn: "추가",
      processingTitle: "처리 중...",
      treeHeader: "처리 대기 파일",
      treeClose: "닫기",
      treeOpen: "열기",
      statusIgnored: "제외됨 (미디어)",
      scanDirText: "디렉토리 스캔 중...",
      mapDirText: "폴더 구조 매핑 중...",
      bundleText: "코드 줄을 읽고, 바이너리 파일을 필터링하며, Markdown 형식으로 번들링 중...",
      downloadSuccess: "Markdown 파일이 성공적으로 생성 및 다운로드되었습니다!",
      errorNoFiles: "처리할 수 있는 유효한 파일이 없습니다.",
      chooseFolderInfo: "폴더를-선택하세요"
    },
    zh: { // Mandarin / Cina
      title: "FolderToMarkdownV2",
      desc: "一键自动将文本代码结构和 SVG 提取为 Markdown 文档。",
      btnPick: "选择文件夹",
      btnGen: "生成并下载 .md",
      btnProcessing: "处理中...",
      statusReady: "个文本/SVG 文件已准备好提取",
      placeholder: "尚未加载文件夹",
      subPlaceholder: "请点击上方的“选择文件夹”按钮以映射您的文件。",
      settingsTitle: "设置",
      langSelect: "选择语言",
      folderIgnoreTitle: "忽略的文件夹",
      folderPlaceholder: "例如: dist, build",
      ignoreFilePlaceholder: "例如: config.js",
      ignoredExtensionsPlaceholder: "例如: log, env",
      fileIgnoreTitle: "忽略的特定文件",
      extIgnoreTitle: "忽略的扩展名",
      addBtn: "添加",
      processingTitle: "正在处理...",
      treeHeader: "文件准备就绪",
      treeClose: "关闭",
      treeOpen: "展开",
      statusIgnored: "已忽略 (媒体)",
      scanDirText: "正在扫描目录...",
      mapDirText: "正在映射文件夹结构...",
      bundleText: "正在读取代码行、过滤二进制文件并打包为 Markdown 格式...",
      downloadSuccess: "Markdown 文件已成功创建并下载！",
      errorNoFiles: "没有可用于处理的有效文件。",
      chooseFolderInfo: "选择您的文件夹"
    },
    ru: { // Rusia
      title: "FolderToMarkdownV2",
      desc: "Автоматически извлекайте структуры текстового кода и SVG в документацию Markdown в один клик.",
      btnPick: "Выбрать Папку",
      btnGen: "Создать и Скачать .md",
      btnProcessing: "Обработка...",
      statusReady: "текстовых/SVG файлов готовы к извлечению",
      placeholder: "Папка еще не загружена",
      subPlaceholder: "Пожалуйста, нажмите кнопку 'Выбрать Папку' выше, чтобы сопоставить ваши файлы.",
      settingsTitle: "Настройки",
      langSelect: "Выбрать Язык",
      folderIgnoreTitle: "Игнорируемые Папки",
      folderPlaceholder: "Пример: dist, build",
      ignoreFilePlaceholder: "Пример: config.js",
      ignoredExtensionsPlaceholder: "Пример: log, env",
      fileIgnoreTitle: "Игнорируемые Файлы",
      extIgnoreTitle: "Игнорируемые Расширения",
      addBtn: "Добавить",
      processingTitle: "Обработка...",
      treeHeader: "файл готов к обработке",
      treeClose: "Закрыть",
      treeOpen: "Открыть",
      statusIgnored: "Игнорируется (Медиа)",
      scanDirText: "Сканирование директории...",
      mapDirText: "Сопоставление структуры папок...",
      bundleText: "Чтение строк кода, фильтрация бинарных файлов и объединение в формат Markdown...",
      downloadSuccess: "Файл Markdown успешно создан и скачан!",
      errorNoFiles: "Нет доступных для обработки файлов.",
      chooseFolderInfo: "выберите-вашу-папку"
    },
    ar: { // Arab
      title: "FolderToMarkdownV2",
      desc: "استخرج هياكل الأكواد النصية وملفات SVG تلقائيًا إلى مستند Markdown بنقرة واحدة.",
      btnPick: "اختر مجلدًا",
      btnGen: "إنشاء وتحميل .md",
      btnProcessing: "جاري المعالجة...",
      statusReady: "ملفات نصية/SVG جاهزة للاستخراج",
      placeholder: "لم يتم تحميل أي مجلد بعد",
      subPlaceholder: "يرجى النقر على زر 'اختر مجلدًا' أعلاه لخرائط ملفاتك.",
      settingsTitle: "الإعدادات",
      langSelect: "اختر اللغة",
      folderIgnoreTitle: "المجلدات المتجاهلة",
      folderPlaceholder: "مثال: dist, build",
      ignoreFilePlaceholder: "مثال: config.js",
      ignoredExtensionsPlaceholder: "مثال: log, env",
      fileIgnoreTitle: "ملفات محددة متجاهلة",
      extIgnoreTitle: "الامتدادات المتجاهلة",
      addBtn: "إضافة",
      processingTitle: "جاري المعالجة...",
      treeHeader: "ملف جاهز للمعالجة",
      treeClose: "إغلاق",
      treeOpen: "افتح",
      statusIgnored: "متجاهل (وسائط)",
      scanDirText: "جاري فحص الدليل...",
      mapDirText: "جاري رسم بنية المجلد...",
      bundleText: "جاري قراءة سطور الأكواد، وتصفية الملفات الثنائية، وحزمها بصيغة Markdown...",
      downloadSuccess: "تم إنشاء ملف Markdown وتحميله بنجاح!",
      errorNoFiles: "لا توجد ملفات صالحة متاحة للمعالجة.",
      chooseFolderInfo: "اختر-المجلد-الخاص-ب some"
    },
    pt: { // Portugis
      title: "FolderToMarkdownV2",
      desc: "Extraia automaticamente estruturas de código de texto e SVG em documentação Markdown com um clique.",
      btnPick: "Escolher Pasta",
      btnGen: "Gerar e Baixar .md",
      btnProcessing: "Processando...",
      statusReady: "arquivos de texto/SVG prontos para extrair",
      placeholder: "Nenhuma pasta carregada ainda",
      subPlaceholder: "Clique no botão 'Escolher Pasta' acima para mapear seus arquivos.",
      settingsTitle: "Configurações",
      langSelect: "Selecionar Idioma",
      folderIgnoreTitle: "Pastas Ignoradas",
      folderPlaceholder: "Exemplo: dist, build",
      ignoreFilePlaceholder: "Exemplo: config.js",
      ignoredExtensionsPlaceholder: "Exemplo: log, env",
      fileIgnoreTitle: "Arquivos Específicos Ignorados",
      extIgnoreTitle: "Extensões Ignoradas",
      addBtn: "Adicionar",
      processingTitle: "Processando...",
      treeHeader: "arquivo pronto para processar",
      treeClose: "Fechar",
      treeOpen: "Abrir",
      statusIgnored: "Ignorado (Mídia)",
      scanDirText: "Escaneando diretório...",
      mapDirText: "Mapeando estrutura de pastas...",
      bundleText: "Lendo linhas de código, filtrando arquivos binários e agrupando em formato Markdown...",
      downloadSuccess: "Arquivo Markdown criado e baixado com sucesso!",
      errorNoFiles: "Nenhum arquivo válido disponível para processamento.",
      chooseFolderInfo: "pselecione-sua-pasta"
    },
    it: { // Italia
      title: "FolderToMarkdownV2",
      desc: "Estrai automaticamente le strutture del codice di testo e SVG in documentazione Markdown con un clic.",
      btnPick: "Scegli Cartella",
      btnGen: "Genera & Scarica .md",
      btnProcessing: "Elaborazione...",
      statusReady: "file di testo/SVG pronti da estrarre",
      placeholder: "Nessuna cartella ancora caricata",
      subPlaceholder: "Fai clic sul selettore 'Scegli Cartella' in alto per mappare i tuoi file.",
      settingsTitle: "Impostazioni",
      langSelect: "Seleziona Lingua",
      folderIgnoreTitle: "Cartelle Ignorate",
      folderPlaceholder: "Esempio: dist, build",
      ignoreFilePlaceholder: "Esempio: config.js",
      ignoredExtensionsPlaceholder: "Esempio: log, env",
      fileIgnoreTitle: "File Specifici Ignorati",
      extIgnoreTitle: "Estensioni Ignorate",
      addBtn: "Aggiungi",
      processingTitle: "Elaborazione...",
      treeHeader: "file pronto per l'elaborazione",
      treeClose: "Chiudi",
      treeOpen: "Apri",
      statusIgnored: "Ignorato (Media)",
      scanDirText: "Scansione della directory...",
      mapDirText: "Mappatura della struttura delle cartelle...",
      bundleText: "Lettura delle linee di codice, filtraggio dei file binari e raggruppamento in formato Markdown...",
      downloadSuccess: "File Markdown creato e scaricato con successo!",
      errorNoFiles: "Nessun file valido disponibile per l'elaborazione.",
      chooseFolderInfo: "seleziona-la-tua-cartella"
    }
  }[language];

  // Fungsi tambahan untuk mengecek folder yang di-ignore
  const isInIgnoredFolder = (nameOrPath: string): boolean => {
    const parts = nameOrPath.split('/');
    return parts.some((part: string) => ignoredFolders.includes(part));
  };

  // Fungsi untuk memvalidasi apakah file harus diproses atau di-ignore
  const shouldProcessFile = (fileName: string): boolean => {
    if (ignoredLockFiles.includes(fileName)) {
      return false;
    }
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (!ext) return true;
    if (ext === 'svg') return true; // Pengecualian khusus SVG
    return !ignoredExtensions.includes(ext);
  };

  // Fungsi rekursif untuk membaca struktur direktori secara streaming & malas (Lazy/Iterative)
  const scanDirectory = async (
    dirHandle: any,
    currentTree: FileNode,
    currentRootName: string,
    currentPath: string = "",
    counter = { count: 0 } 
  ) => {
    const localFilteredFiles: File[] = [];

    for await (const entry of dirHandle.values()) {
      if (entry.kind === 'directory' && ignoredFolders.includes(entry.name)) {
        continue;
      }

      if (isInIgnoredFolder(entry.name)) {
        continue;
      }

      const entryPath = currentPath ? `${currentPath}/${entry.name}` : entry.name;
      if (!currentTree.children) currentTree.children = {};

      if (entry.kind === 'directory') {
        currentTree.children[entry.name] = {
          name: entry.name,
          type: 'folder',
          path: entryPath,
          children: {}
        };
        
        const subFiles = await scanDirectory(
          entry as FileSystemDirectoryHandle,
          currentTree.children[entry.name],
          currentRootName,
          entryPath,
          counter
        );
        localFilteredFiles.push(...subFiles);
      } else if (entry.kind === 'file') {
        const file = await (entry as FileSystemFileHandle).getFile();
        
        Object.defineProperty(file, 'webkitRelativePath', {
          value: `${currentRootName}/${entryPath}`,
          writable: false
        });

        currentTree.children[entry.name] = {
          name: entry.name,
          type: 'file',
          path: entryPath
        };

        localFilteredFiles.push(file);

        counter.count++;
        // Setiap kelipatan 20 file, kita berikan jeda mikro 0ms agar browser sempat menggambar ke layar visual
        if (counter.count % 20 === 0) {
          setScanProgress(prev => ({ ...prev, current: counter.count }));
          setLoadingText(`${t.mapDirText}`);
          
          // Potongan kode ini memindahkan sisa eksekusi ke antrean berikutnya, memberi waktu UI untuk render
          await new Promise((resolve) => setTimeout(resolve, 0));
        } else if (counter.count === 1) {
          // Khusus file pertama, langsung tembak agar angka 0 langsung berubah jadi 1
          setScanProgress(prev => ({ ...prev, current: counter.count }));
        }
      }
    }
    return localFilteredFiles;
  };

  // Trigger utama saat tombol "Pilih Folder" diklik
  const handlePickFolderModern = async () => {
    // 1. LANGSUNG AKTIFKAN LOADING DI SINI SEBELUM POP-UP BROWSER MUNCUL
    setLoadingText(t.scanDirText);
    setIsLoading(true); 
    setStatusMessage({ type: '', text: '' });
    setScanProgress({ current: 0, total: null }); 

    try {
      // OPSI UTAMA: Browser Chromium (Chrome, Edge, Brave Modern)
      if (window.showDirectoryPicker) {
        const dirHandle = await window.showDirectoryPicker();
        
        // Tetap pasang loading karena prapemindaian baru selesai setelah folder dipilih
        setIsLoading(true); 
        setLoadingText(t.mapDirText);
        
        const currentRootName = dirHandle.name;
        setRootName(currentRootName);

        const root: FileNode = { name: currentRootName, type: 'folder', path: '', children: {} };
        await new Promise((resolve) => setTimeout(resolve, 50));
        const allFiles = await scanDirectory(dirHandle, root, currentRootName, "", { count: 0 });

        setFilesList(allFiles);
        setFolderTree(root);
        setIsLoading(false);
        return;
      }

      // OPSI CADANGAN: Browser Firefox / Safari / Brave Default
      setStatusMessage({ 
        type: 'success',
        // isi text dibawah ini untuk menampilkan pesan (Menggunakan mode kompatibilitas untuk browser Anda. Membuka folder...) 
        text: '' 
      });

      const input = document.createElement('input');
      input.type = 'file';
      // @ts-ignore
      input.webkitdirectory = true;
      input.multiple = true;

      let isProcessingFiles = false;

      input.addEventListener('change', (e: Event) => {
        const files = (e.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
          setIsLoading(false); // Matikan loading jika batal
          return;
        }

        isProcessingFiles = true;
        setIsLoading(true);
        setLoadingText(t.mapDirText);

        const filteredFiles: File[] = [];

        // Saring folder terlarang saja di awal, biarkan file ignore tetap lolos masuk array
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const path = file.webkitRelativePath || file.name;
          const pathParts = path.split('/');
          const hasIgnoredFolder = pathParts.some(part => ignoredFolders.includes(part));
          if (!hasIgnoredFolder) { // ◄ Hanya cek folder raksasa di sini
            filteredFiles.push(file);
          }
        }

        // Pada mode cadangan, total file langsung diketahui sejak awal!
        setScanProgress({ current: 0, total: filteredFiles.length });

        // MEMOTONG STRING DARI BERKAS PERTAMA AGAR NAMA REPOSITORI TETAP AKURAT DI FIREFOX
        const detectedName = files[0]?.webkitRelativePath.split('/')[0] || 'repository';
        const root: FileNode = { name: detectedName, type: 'folder', path: '', children: {} };
        
        // Proses mapping visual pohon folder cadangan dengan counter berjalan
        filteredFiles.forEach((file: File, index: number) => {
          // Update status teks dinamik per berkas yang terdaftar
          setScanProgress(prev => ({ ...prev, current: index + 1 }));
          setLoadingText(`${t.mapDirText} (${index + 1} dari ${filteredFiles.length} file)`);

          const pathParts = file.webkitRelativePath.split('/');
          let current = root;
          let currentPath = "";

          for (let j = 1; j < pathParts.length; j++) {
            const part = pathParts[j];
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            const isFile = j === pathParts.length - 1;
            if (!current.children) current.children = {};
            if (!current.children[part]) {
              current.children[part] = {
                name: part,
                type: isFile ? 'file' : 'folder',
                path: currentPath,
                ...(isFile ? {} : { children: {} })
              };
            }
            current = current.children[part];
          }
        });

        setRootName(root.name);
        setFilesList(filteredFiles);
        setFolderTree(root);
        setIsLoading(false);
        setStatusMessage({ 
            type: 'success', 
            // isi text dibawah ini untuk menampilkan pesan (Folder berhasil dimuat menggunakan mode kompatibilitas!)
            text: '' 
        });
      });

      // dibawah ini adalah kode yang digunakan untuk menutup animasi loading ketika pengguna klik tombol cancel pada dialog pilih folder
      // Jika jendela dialog ditutup tanpa memilih apa pun, matikan loading setelah jeda singkat
      // window.addEventListener('focus', () => {
      //   setTimeout(() => {
      //     if (!isProcessingFiles && (!input.files || input.files.length === 0)) {
      //       setIsLoading(false);
      //     }
      //   }, 300);
      // }, { once: true });

      input.click();

    } catch (err: any) {
      setIsLoading(false); // Matikan loading jika user menekan tombol 'Cancel' pada jendela dialog
      if (err.name !== 'AbortError') {
        setStatusMessage({ type: 'error', text: t.errorNoFiles + err.message });
      }
    }
  };

  const processAndDownloadMarkdown = async () => {
    const finalFilteredFiles = filesList.filter(file => {
      const filePath = file.webkitRelativePath || file.name;
      // Pastikan file tidak berada di folder yang di-ignore DAN ekstensinya tidak di-ignore
      return !isInIgnoredFolder(filePath) && shouldProcessFile(file.name);
    });

    if (finalFilteredFiles.length === 0) {
      setStatusMessage({ type: 'error', text: t.errorNoFiles });
      return;
    }

    setLoadingText(t.bundleText);
    setIsLoading(true);
    setStatusMessage({ type: '', text: '' });

    // Simulasi delay sedikit agar animasi loading terlihat smooth
    await new Promise((resolve) => setTimeout(resolve, 1200));

    let markdownContent = `# Bundle Isi Folder: ${rootName}\n\n`;
    markdownContent += `*Automatically generated on: ${new Date().toLocaleString('en-US')}*\n`;
    markdownContent += `*Total file teks/SVG yang berhasil diekstrak: ${finalFilteredFiles.length} file*\n\n`;
    // untuk menambahkan ASCII struktur folder 
    if (folderTree) {
      markdownContent += `## 📂 Struktur Direktori Repositori\n\n`;
      markdownContent += `\`\`\`text\n`;
      markdownContent += `${rootName}/\n`; // Menampilkan nama folder root di paling atas
      markdownContent += generateAsciiTree(folderTree);
      markdownContent += `\`\`\`\n\n`;
    }
    markdownContent += `---\n\n`;

    for (const file of finalFilteredFiles) {
      const filePath = file.webkitRelativePath || file.name;
      const ext = file.name.split('.').pop()?.toLowerCase() || 'text';

      try {
        const text = await file.text();
        markdownContent += `## 📄 File: ${filePath}\n`;
        markdownContent += `**Path:** \`${filePath}\` | **Ukuran:** ${(file.size / 1024).toFixed(2)} KB\n\n`;
        const maxBackticks = (text.match(/`+/g) ?? []).reduce(
          (max, run) => Math.max(max, run.length),
          0
        );
        const fence = '`'.repeat(Math.max(3, maxBackticks + 1));
        markdownContent += `${fence}${ext}\n`;
        markdownContent += text;
        markdownContent += `\n${fence}\n\n`;
        markdownContent += `---\n\n`;
      } catch (error) {
        markdownContent += `## 📄 File: ${filePath}\n`;
        markdownContent += `⚠️ *Gagal membaca file biner atau terjadi kesalahan sistem.*\n\n---\n\n`;
      }
    }

    // Trigger download blob markdown
    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${rootName || 'repository'}-bundle.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsLoading(false);
    setStatusMessage({ type: 'success', text: t.downloadSuccess });
  };

  if (!isMounted) {
    return <div className="min-h-screen bg-[#0d1117]" />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] p-4 md:p-8 font-sans antialiased selection:bg-[#58a6ff]/30">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header ala Info Repositori */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-[#30363d] pb-5 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xl font-semibold text-[#f0f6fc]">
              <span className="text-[#58a6ff]">FolderToMarkdownV2</span>
              <span className="text-[#8b949e]">/</span>
              <span className="text-[#f0f6fc] font-bold">{rootName || t.chooseFolderInfo}</span>
            </div>
            <p className="text-sm text-[#8b949e] mt-1">
              {t.desc}
            </p>
          </div>
          
          {/* Sisi Tombol Navigasi / Trigger Input */}
          <div className="flex items-center gap-2 md:self-center shrink-0">
            {/* TOMBOL PENGATURAN (RODA GIGI) */}
            <button
              onClick={() => {
                // Salin data utama ke cadangan saat modal dibuka
                setTempLanguage(language);
                setTempFolders(ignoredFolders);
                setTempExtensions(ignoredExtensions);
                setTempFiles(ignoredLockFiles);
                setIsSettingsOpen(true);
              }}
              className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] p-2 rounded-md transition-colors h-[38px] w-[38px] flex items-center justify-center shrink-0"
              title="Settings"
            >
              <Settings size={18} />
            </button>

            {/* TOMBOL PILIH FOLDER */}
            <button
              onClick={handlePickFolderModern}
              className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] px-4 py-1.5 rounded-md text-sm font-medium transition-colors h-[38px] flex items-center justify-center whitespace-nowrap shrink-0"
            >
              {t.btnPick}
            </button>
            
            {/* TOMBOL GENERATE MARKDOWN */}
            <button
              onClick={processAndDownloadMarkdown}
              disabled={isLoading || filesList.length === 0}
              className="flex items-center justify-center space-x-2 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#238636]/40 disabled:text-[#c9d1d9]/50 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm h-[38px] whitespace-nowrap shrink-0"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} className="shrink-0" />
              )}
              <span>{isLoading ? t.btnProcessing : t.btnGen}</span>
            </button>
          </div>
        </div>

        {/* Notifikasi Status */}
        {statusMessage.text && (
          <div className={`p-4 rounded-md border text-sm flex items-start space-x-2 ${
            statusMessage.type === 'success' 
              ? 'bg-[#1f2c20] border-[#238636] text-[#56d364]' 
              : 'bg-[#2d1f1f] border-[#f85149] text-[#f85149]'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <AlertCircle size={18} className="mt-0.5 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Tampilan Struktur Berkas ala GitHub Box */}
        {folderTree ? (
          <div className="bg-[#0d1117] border border-[#30363d] rounded-md overflow-hidden">
            {/* Navigasi File Header */}
            <div className="bg-[#161b22] px-4 py-3 border-b border-[#30363d] flex items-center justify-between text-xs md:text-sm">
              <div className="flex items-center space-x-2 text-[#8b949e]">
                <Folder size={16} className="text-[#8b949e]" />
                <span className="font-semibold text-[#f0f6fc]">{rootName}</span>
              </div>
              <div className="text-xs text-[#8b949e]">
                <span className="text-[#f0f6fc] font-medium">{filesList.length}</span> {t.statusReady}
              </div>
            </div>

            {/* Folder list root content */}
            <div className="flex flex-col">
              <RenderTree
                node={folderTree}
                isInIgnoredFolder={isInIgnoredFolder}
                shouldProcessFile={shouldProcessFile}
                labels={{
                  statusIgnored: t.statusIgnored,
                  treeHeader: t.treeHeader,
                  treeOpen: t.treeOpen,
                  treeClose: t.treeClose,
                }}
              />
            </div>
          </div>
        ) : (
          /* Placeholder State Saat Folder Kosong */
          <div className="border border-dashed border-[#30363d] rounded-lg p-12 text-center bg-[#161b22]/30">
            <Folder size={48} className="mx-auto text-[#8b949e] mb-4 opacity-60" />
            <h3 className="text-base font-semibold text-[#f0f6fc]">{t.placeholder}</h3>
            <p className="text-sm text-[#8b949e] max-w-sm mx-auto mt-1 mb-4">
              {t.subPlaceholder}
            </p>
          </div>
        )}

        {/* Overlay Animasi Loading Pemrosesan Skala Besar */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
            <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
              <Loader2 size={40} className="animate-spin text-[#58a6ff] mx-auto" />
              <div className="space-y-1">
                {/* UBAH BAGIAN DUA BARIS TEKS DI BAWAH INI MENJADI DINAMIS */}
                <h4 className="text-md font-semibold text-[#f0f6fc]">{t.processingTitle}</h4>
                <p className="text-xs text-[#8b949e] leading-relaxed">
                  {loadingText}
                </p>
                {/* Dibawah ini adalah tampilan untuk proggres file yang tebaca.. hilangkan komentar jika ana ingin menampilkannya */}
                {/* <p className="text-[11px] font-mono text-[#58a6ff] pt-1">
                  {scanProgress.total 
                    ? `Progress: ${scanProgress.current} / ${scanProgress.total} file`
                    : `Ditemukan: ${scanProgress.current} file...`}
                </p> */}
              </div>
            </div>
          </div>
        )}

        {/* Untuk tampilan dari setting */}
        {isSettingsOpen && (
          <div 
            onClick={() => setIsSettingsOpen(false)} 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4"
          >
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="bg-[#161b22] border border-[#30363d] rounded-xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl"
            >
              
              {/* Modal Header */}
              <div className="p-4 border-b border-[#30363d] flex items-center justify-between select-none">
                <h3 className="text-md font-semibold text-[#f0f6fc] flex items-center gap-2">
                  <Settings size={18} /> {t.settingsTitle}
                </h3>
                <button onClick={() => setIsSettingsOpen(false)} className="text-[#8b949e] hover:text-[#c9d1d9]">
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body (Menggunakan State Temp & Bebas Scrollbar Ganda) */}
              <div className="p-6 overflow-y-auto space-y-5 text-sm flex-1
                [&::-webkit-scrollbar]:w-2
                [&::-webkit-scrollbar-track]:bg-[#0d1117]
                [&::-webkit-scrollbar-thumb]:bg-[#30363d]
                [&::-webkit-scrollbar-thumb]:rounded-full"
              >
                
                {/* Pilihan Bahasa */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider">{t.langSelect}</label>
                  <select 
                    value={tempLanguage} 
                    onChange={(e) => setTempLanguage(e.target.value as 'id' | 'en')}
                    className="w-full bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-2 text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]"
                  >
                    <option value="id">Bahasa Indonesia</option>
                    <option value="en">English (US)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                    <option value="ja">日本語</option>
                    <option value="ko">한국어</option>
                    <option value="zh">简体中文</option>
                    <option value="ru">Русский</option>
                    <option value="ar">العربية</option>
                    <option value="pt">Português</option>
                    <option value="it">Italiano</option>
                  </select>
                </div>

                {/* Pengaturan Folder Ignore */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider">{t.folderIgnoreTitle}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={t.folderPlaceholder} 
                      value={newFolderInput} 
                      onChange={(e)=>setNewFolderInput(e.target.value)} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newFolderInput) {
                          setTempFolders([...tempFolders, newFolderInput]);
                          setNewFolderInput("");
                        }
                      }}
                      className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]" 
                    />
                    <button 
                      onClick={() => { 
                        if(newFolderInput) { 
                          setTempFolders([...tempFolders, newFolderInput]); 
                          setNewFolderInput(""); 
                        } 
                      }} 
                      className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
                    >{t.addBtn}</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tempFolders.map(folder => (
                      <span key={folder} className="inline-flex items-center gap-1 bg-[#21262d] border border-[#30363d] text-xs px-2 py-0.5 rounded-md text-[#8b949e] font-medium">
                        {folder} <X size={12} className="cursor-pointer text-[#8b949e] hover:text-[#f85149]" onClick={() => setTempFolders(tempFolders.filter(f => f !== folder))} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pengaturan File Ignore */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider">{t.fileIgnoreTitle}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" placeholder={t.ignoreFilePlaceholder} 
                      value={newFileInput} 
                      onChange={(e)=>setNewFileInput(e.target.value)} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newFileInput) {
                          setTempFiles([...tempFiles, newFileInput]);
                          setNewFileInput("");
                        }
                      }}
                      className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]" 
                  />
                    <button 
                      onClick={() => { 
                        if(newFileInput) { 
                          setTempFiles([...tempFiles, newFileInput]); 
                          setNewFileInput(""); 
                        } 
                      }} 
                      className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
                    >{t.addBtn}</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {tempFiles.map(file => (
                      <span key={file} className="inline-flex items-center gap-1 bg-[#21262d] border border-[#30363d] text-xs px-2 py-0.5 rounded-md text-[#8b949e] font-medium">
                        {file} <X size={12} className="cursor-pointer text-[#8b949e] hover:text-[#f85149]" onClick={() => setTempFiles(tempFiles.filter(f => f !== file))} />
                      </span>
                    ))}
                  </div>
                </div>

                {/* Pengaturan Ekstensi Ignore */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-[#8b949e] uppercase tracking-wider">{t.extIgnoreTitle}</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder={t.ignoredExtensionsPlaceholder} 
                      value={newExtInput} 
                      onChange={(e)=>setNewExtInput(e.target.value)} 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newExtInput) {
                          setTempExtensions([...tempExtensions, newExtInput.replace('.','')]);
                          setNewExtInput("");
                        }
                      }}
                      className="flex-1 bg-[#0d1117] border border-[#30363d] rounded-md px-3 py-1.5 text-xs text-[#c9d1d9] focus:outline-none focus:border-[#58a6ff]" 
                    />
                    <button 
                      onClick={() => { 
                        if(newExtInput) { 
                          setTempExtensions([...tempExtensions, newExtInput.replace('.','')]); 
                          setNewExtInput(""); 
                        } 
                      }} 
                      className="bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] px-4 py-1.5 rounded-md text-xs font-medium transition-colors"
                    >{t.addBtn}</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1 border border-[#30363d]/50 p-2 rounded-md bg-[#0d1117]">
                    {tempExtensions.map(ext => (
                      <span key={ext} className="inline-flex items-center gap-1 bg-[#21262d] border border-[#30363d] text-[11px] px-2 py-0.5 rounded-md text-[#8b949e] font-medium m-0.5">
                        .{ext} <X size={12} className="cursor-pointer text-[#8b949e] hover:text-[#f85149]" onClick={() => setTempExtensions(tempExtensions.filter(e => e !== ext))} />
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* ─── MODAL FOOTER: AREA TOMBOL APPLY BARU ───────────────────── */}
              <div className="p-4 border-t border-[#30363d] flex justify-end gap-2 bg-[#161b22] rounded-b-xl select-none">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="bg-transparent hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>
                <button 
                  onClick={() => {
                    // Kunci data dari cadangan ke state utama aplikasi
                    setLanguage(tempLanguage);
                    setIgnoredFolders(tempFolders);
                    setIgnoredExtensions(tempExtensions);
                    setIgnoredLockFiles(tempFiles);
                    setIsSettingsOpen(false); // Tutup jendela
                  }}
                  className="bg-[#238636] hover:bg-[#2ea043] text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
                >
                  {language === 'id' ? 'Terapkan' : 'Apply'}
                </button>
              </div>
              {/* ────────────────────────────────────────────────────────────── */}

            </div>
          </div>
        )}
      </div>
    </div>
  );
}