import * as fs from 'fs';
import { test } from 'vitest';
import { Line, Opening, OpeningCategory } from '../src/types/chess';

test('merge lines and opening groups', () => {
  const linesData : Line[]= JSON.parse(fs.readFileSync('test/lines.json', 'utf-8'));
  const openingGroupsData = JSON.parse(fs.readFileSync('test/openingGroups.json', 'utf-8'));
  const openingCategories: OpeningCategory[] = openingGroupsData.openingCategories;

  openingCategories.forEach(openingCategory => {
    console.log(openingCategory.name)
    openingCategory.openings.forEach(opening => {
      // console.log(opening);
      let [fromElo,toElo] = opening.range.split('-');
      if (!toElo){
        toElo = fromElo;
      }

      const elos: string[] = []
      const [fromLetter, fromDigit1, fromDigit2] = fromElo.split('')
      const fromDigit = parseInt(fromDigit1,10)*10 + parseInt(fromDigit2,10);
      const [toLetter, toDigit1, toDigit2] = toElo.split('')
      const toDigit = parseInt(toDigit1,10)*10 + parseInt(toDigit2,10);
      for (let i = fromDigit; i <= toDigit; i++) {
        elos.push(`${fromLetter}${i.toString().padStart(2, '0')}`);
      }
      // console.log(fromElo, toElo, elos);
      const lines = linesData.filter(opening => elos.includes(opening.eco));
      console.log(lines.length, opening.name)
      opening.lines = lines.sort((a,b) => b.count - a.count);
    });
  });

  // Write grouped openings to openings.grouped.json
  fs.writeFileSync('test/openings.json', JSON.stringify(openingCategories, null, 2));

  console.log("Grouped openings have been saved to openings.json");
  // console.log('Sample group:', Object.entries(groupedOpenings)[0]);
});
