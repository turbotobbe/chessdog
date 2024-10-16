import * as fs from 'fs';
import * as path from 'path';
import { test } from 'vitest';
import { Line, Opening, OpeningCategory } from '../src/types/chess';

test('merge lines and opening groups', () => {
  const linesData: Line[] = JSON.parse(fs.readFileSync('test/lines.json', 'utf-8'));
  const openingGroupsData = JSON.parse(fs.readFileSync('test/openingGroups.json', 'utf-8'));
  const openingCategories: OpeningCategory[] = openingGroupsData.openingCategories;

  openingCategories.forEach(openingCategory => {
    console.log(openingCategory.name)
    openingCategory.openings.forEach(o => {
      // console.log(o);
      let [fromElo, toElo] = o.range.split('-');
      if (!toElo) {
        toElo = fromElo;
      }

      const elos: string[] = []
      const [fromLetter, fromDigit1, fromDigit2] = fromElo.split('')
      const fromDigit = parseInt(fromDigit1, 10) * 10 + parseInt(fromDigit2, 10);
      const [toLetter, toDigit1, toDigit2] = toElo.split('')
      const toDigit = parseInt(toDigit1, 10) * 10 + parseInt(toDigit2, 10);
      for (let i = fromDigit; i <= toDigit; i++) {
        elos.push(`${fromLetter}${i.toString().padStart(2, '0')}`);
      }
      // console.log(fromElo, toElo, elos);
      const lines = linesData.filter(o => elos.includes(o.eco));
      console.log(lines.length, o.name)

      const opening: Opening = {
        slug: o.slug,
        name: o.name,
        range: o.range,
        lines: lines.sort((a, b) => b.count - a.count)
      }

      const dirPath = path.join('public', 'openings', openingCategory.slug);
      const filePath = path.join(dirPath, `${opening.slug}.json`);

      // Create directories recursively if they don't exist
      fs.mkdirSync(dirPath, { recursive: true });

      console.log(`Writing ${filePath}`);
      // Write grouped openings to JSON file
      fs.writeFileSync(filePath, JSON.stringify(opening, null, 2));
    });
  });

  // // Write grouped openings to openings.grouped.json
  // fs.writeFileSync('test/openings.json', JSON.stringify(openingCategories, null, 2));

  console.log("Grouped openings have been saved to openings.json");
  // console.log('Sample group:', Object.entries(groupedOpenings)[0]);
});
