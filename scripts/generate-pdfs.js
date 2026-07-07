const { jsPDF } = require("jspdf");
const fs = require("fs");
const path = require("path");

const CATEGORIES_DATA = [
  {
    slug: "ai-animal-videos",
    name: "AI Animal Videos",
    url: "https://drive.google.com/drive/folders/1TpHmYvT-361V17pW3zBf1yW1s4h5z6p9?usp=sharing"
  },
  {
    slug: "ai-miniature-reels",
    name: "AI Miniature Reels",
    url: "https://drive.google.com/drive/folders/1r6mz7_zRJV5Q2Yh5dUk8XykYPJixoIIh?usp=sharing"
  },
  {
    slug: "ai-tech-reels",
    name: "AI Tech Reels",
    url: "https://drive.google.com/drive/folders/1owz3KRZ3QJaB2TdwxWuj0IAhjJ2b7mzy?usp=sharing"
  },
  {
    slug: "car-reels",
    name: "Car Reels",
    url: "https://drive.google.com/drive/folders/1_HJ-_6HQPntHiS324eaBbjQ4ZcPTnyoo?usp=sharing"
  },
  {
    slug: "funny-fails-clips",
    name: "Funny Fails Clips",
    url: "https://drive.google.com/drive/folders/1Fpdfc8UTZWjhS0nsNbrCOTjSmq2gu_qP?usp=sharing"
  },
  {
    slug: "luxury-reels-bundle",
    name: "Luxury Reels Bundle",
    url: "https://drive.google.com/drive/folders/1lZCisZagEQ-manu_Gq-UKXRibWxxZYE2?usp=sharing"
  },
  {
    slug: "satisfying-reels",
    name: "Satisfying Reels",
    url: "https://drive.google.com/drive/folders/1Nok4R2QDeR4W4PDaW69-ev5bGWOjSD2j?usp=sharing"
  },
  {
    slug: "study-reels",
    name: "Study Reels",
    url: "https://drive.google.com/drive/folders/1YB0JP-KKxWNP9yoNTEQHDOkScsqB1Lvt?usp=sharing"
  },
  {
    slug: "super-hero-videos",
    name: "Super Hero Videos",
    url: "https://drive.google.com/drive/folders/1iIQmsdtwAjwq59ZPOT05oDSoI609wGXt?usp=sharing"
  },
  {
    slug: "tools-tips-reels",
    name: "Tools Tips Reels",
    url: "https://drive.google.com/drive/folders/1XYlRDzGbH9H_xfnlSicdGlpoQDhR1I1d?usp=sharing"
  },
  {
    slug: "emotional",
    name: "Emotional",
    url: "https://drive.google.com/drive/folders/1diFapWQooXFNjbrR4qZivB6mPBHJ5ISR?usp=sharing"
  },
  {
    slug: "nature",
    name: "Nature",
    url: "https://drive.google.com/drive/folders/1wKIQKuU8eVHGORldwL2L_I-X3TIAkKg1?usp=sharing"
  }
];

const bundlesDir = path.join(__dirname, "../public/bundles");

// Create bundles dir if it doesn't exist
if (!fs.existsSync(bundlesDir)) {
  fs.mkdirSync(bundlesDir, { recursive: true });
}

function generateSinglePDF(category) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Background style
  doc.setFillColor(248, 250, 252); // slate 50
  doc.rect(0, 0, 210, 297, "F");

  // Top header bar (brand purple)
  doc.setFillColor(124, 58, 237); // violet 600
  doc.rect(0, 0, 210, 8, "F");

  // Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate 500
  doc.text("CODELOVE PREMIUM VIDEO ASSETS", 15, 20);

  // Divider line
  doc.setDrawColor(226, 232, 240); // slate 200
  doc.setLineWidth(0.5);
  doc.line(15, 23, 195, 23);

  // Main Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42); // slate 900
  doc.text(`${category.name} Bundle`, 15, 36);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text("Official Google Drive Access & Resource Document", 15, 42);

  // Body Description
  doc.setFontSize(11);
  doc.setTextColor(51, 65, 85); // slate 700
  const descText = 
    `Thank you for purchasing the ${category.name} Premium Video Bundle. ` +
    `Below is your direct lifetime access link. Inside the folder, you will find all the high-definition, ` +
    `watermark-free video reels, clips, templates, and editing assets.`;
  
  const splitDesc = doc.splitTextToSize(descText, 180);
  doc.text(splitDesc, 15, 54);

  // Access Card Container
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(124, 58, 237);
  doc.setLineWidth(0.8);
  doc.roundedRect(15, 75, 180, 38, 4, 4, "FD");

  // Access Card Inner Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(124, 58, 237);
  doc.text("YOUR DIRECT ACCESS LINK:", 22, 84);

  // Access Link (Blue & Clickable)
  doc.setFontSize(12);
  doc.setTextColor(37, 99, 235); // blue 600
  doc.text("Click Here to Open Google Drive Folder", 22, 94);
  doc.link(22, 88, 160, 8, { url: category.url });

  // Access Link Raw text
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // slate 400
  doc.text(category.url, 22, 102);

  // Guidelines
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Guidelines & Best Practices", 15, 130);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  
  const guidelines = [
    "1. Click the highlighted link above to launch Google Drive in your web browser.",
    "2. We recommend bookmarking the folder link so you can easily access updates in the future.",
    "3. You can stream videos online or download them directly in high speed to your desktop or mobile.",
    "4. All assets are 100% watermark-free and cleared for commercial and personal use.",
    "5. Please do not share or distribute this access document. Sharing violates our terms of service."
  ];

  let currentY = 140;
  guidelines.forEach(line => {
    const splitLine = doc.splitTextToSize(line, 180);
    doc.text(splitLine, 15, currentY);
    currentY += splitLine.length * 5 + 2;
  });

  // Support section
  doc.setFillColor(241, 245, 249); // slate 100
  doc.roundedRect(15, 215, 180, 32, 2, 2, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Need Assistance or support?", 22, 224);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  doc.text("If you experience any issues accessing the files, contact us at support@codelove.com", 22, 230);
  doc.text("We respond to all support requests within 12 hours.", 22, 235);

  // Footer branding
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("© CodeLove. All rights reserved. Premium Creators Club.", 15, 275);

  const pdfOutput = doc.output();
  const filePath = path.join(bundlesDir, `${category.slug}.pdf`);
  fs.writeFileSync(filePath, Buffer.from(pdfOutput, "binary"));
  console.log(`✓ Generated ${category.slug}.pdf`);
}

function generateMegaBundlePDF() {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  // Background style
  doc.setFillColor(248, 250, 252);
  doc.rect(0, 0, 210, 297, "F");

  // Top header bar (brand purple)
  doc.setFillColor(124, 58, 237);
  doc.rect(0, 0, 210, 8, "F");

  // Branding
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text("CODELOVE PREMIUM VIDEO ASSETS", 15, 20);

  // Divider line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, 23, 195, 23);

  // Main Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  doc.text("Mega Bundle — All 12 Collections", 15, 36);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 116, 139);
  doc.text("Direct Google Drive Folder Access Links (All-In-One)", 15, 42);

  // Body Description
  doc.setFontSize(10.5);
  doc.setTextColor(51, 65, 85);
  const descText = 
    `Thank you for purchasing the Mega Bundle! Below are the direct access links ` +
    `to all 12 premium AI video collections included in your purchase. Click each link to open the ` +
    `respective Google Drive folder containing watermark-free, high-definition videos.`;
  
  const splitDesc = doc.splitTextToSize(descText, 180);
  doc.text(splitDesc, 15, 52);

  // List of Categories and Links
  let yPos = 70;
  CATEGORIES_DATA.forEach((category, index) => {
    // Left index box
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(15, yPos - 4.5, 8, 8, 1, 1, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(124, 58, 237);
    doc.text(`${index + 1}`, 18, yPos + 1);

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${category.name}`, 27, yPos - 1);

    // Link Action
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(37, 99, 235);
    doc.text("Click to Open Folder", 27, yPos + 3.5);
    
    // Add clickable overlay
    doc.link(27, yPos, 45, 5, { url: category.url });

    yPos += 15;
  });

  // Footer section
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("© CodeLove. All rights reserved. Mega Bundle Premium Edition.", 15, 275);

  const pdfOutput = doc.output();
  const filePath = path.join(bundlesDir, "mega-bundle.pdf");
  fs.writeFileSync(filePath, Buffer.from(pdfOutput, "binary"));
  console.log("✓ Generated mega-bundle.pdf");
}

// Generate all files
console.log("Starting PDF generation...");
CATEGORIES_DATA.forEach(generateSinglePDF);
generateMegaBundlePDF();
console.log("PDF generation complete!");
