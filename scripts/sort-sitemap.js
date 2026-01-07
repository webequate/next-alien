const fs = require('fs');
const path = require('path');

const sitemapPath = path.join(__dirname, '../public/sitemap-0.xml');

if (fs.existsSync(sitemapPath)) {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  
  // Extract the header and closing tag
  const lines = content.split('\n');
  const header = lines[0];
  const openTag = lines[1];
  const closeTag = lines[lines.length - 1];
  
  // Extract all URL entries
  const urlEntries = lines.slice(2, -1);
  
  // Sort alphanumerically by the URL (the loc content)
  urlEntries.sort((a, b) => {
    const urlA = a.match(/<loc>(.*?)<\/loc>/)[1];
    const urlB = b.match(/<loc>(.*?)<\/loc>/)[1];
    return urlA.localeCompare(urlB, undefined, { numeric: true, sensitivity: 'base' });
  });
  
  // Reconstruct the file
  const sortedContent = [header, openTag, ...urlEntries, closeTag].join('\n');
  fs.writeFileSync(sitemapPath, sortedContent, 'utf8');
  
  console.log('✓ Sitemap sorted alphanumerically');
} else {
  console.log('⚠ Sitemap file not found at:', sitemapPath);
}
