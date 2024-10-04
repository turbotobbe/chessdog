import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { test, expect } from 'vitest';

test('wikipedia', () => {
  const wikipediaContent = fs.readFileSync('test/wikipedia.json', 'utf8');
  const wikipediaJSON = JSON.parse(wikipediaContent);
  const $doc = cheerio.load(wikipediaJSON['parse']['text']['*']);

//   // Save the formatted HTML content to a file
//   const formattedHtml = $doc.html();
//   fs.writeFileSync('test/wikipedia.html', formattedHtml, 'utf8');
//   console.log('Formatted HTML saved to wikipedia.html');

  const openings: { code: string; name: string; lines: string[] }[] = [];

  // Find all h4 elements
  $doc('h4').each((index, element) => {
    const $h4 = $doc(element);
    const codeAndName = $h4.text().trim();
    const [code, ...nameParts] = codeAndName.split(' ');
    const name = nameParts.join(' ');

    const lines: string[] = [];

    // Find the ul element immediately following the h4
    const $ul = $h4.next('ul');
    $ul.find('li').each((_, li) => {
      lines.push($doc(li).text().trim());
    });

    openings.push({ code, name, lines });
  });

  // Log the results
  openings.forEach((opening, index) => {
    console.log(`Opening ${index + 1}: ${opening.code} ${opening.name}`);
    opening.lines.forEach((line, i) => {
      console.log(`  Line ${i + 1}: ${line}`);
    });
    console.log('');
  });

  // Add an assertion to ensure we've extracted at least one opening
//   expect(openings.length).toBeGreaterThan(0);
});
