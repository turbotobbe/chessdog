import fs from 'fs';
import { test } from 'vitest';
import rawOpenings from '../src/data/openings.json';
import { OpeningCategory } from '../src/types/chess';
const openingCategories: OpeningCategory[] = rawOpenings as OpeningCategory[];

test('generate openings', () => {   
    console.log(openingCategories);

    const ecoList :{
        letter: string,
        digit: string,
        name: string,
        moves: string
    }[] = []

    // read eco.txt 
    const ecoFile = fs.readFileSync('./test/eco.txt', 'utf8');
    const ecoLines = ecoFile.split('\n');
    ecoLines.forEach(line => {
        if (line.trim() === '') return;
        // console.log(line);
        const [eco, name, moves] = line.split('\t')
        const [letter, digit1, digit2] = eco.trim().split('')
        const digit = (parseInt(digit1, 10)*10 + parseInt(digit2, 10)).toString().padStart(2, '0');
        console.log(letter, digit, name.trim(), moves.trim());
        ecoList.push({letter, digit, name: name.trim(), moves: moves.trim()});
    })
    openingCategories.forEach(openingCategory => {
        openingCategory.openings.forEach(opening => {
            let [firstEco, lastEco] = opening.range.split('-')
            if (!lastEco) {
                lastEco = firstEco;
            }
            const [firstLetter, firstDigit1, firstDigit2] = firstEco.trim().split('')
            const firstDigit = parseInt(firstDigit1, 10)*10 + parseInt(firstDigit2, 10);
            const [lastLetter, lastDigit1, lastDigit2] = lastEco.trim().split('')
            const lastDigit = parseInt(lastDigit1, 10)*10 + parseInt(lastDigit2, 10);

            for (let digit = firstDigit; digit <= lastDigit; digit++) {
                const paddedDigit = digit.toString().padStart(2, '0');
                const filteredEcoList = ecoList.filter(eco => eco.letter === firstLetter && eco.digit === paddedDigit);
                filteredEcoList.forEach(eco => {
                    opening.lines.push({
                        name: eco.name,
                        eco: eco.letter + eco.digit,
                        moves: eco.moves
                    })
                })
            }
        });
    });
    // console.log(JSON.stringify(openingCategories, null, 2));
    // Write the updated openingCategories to a new JSON file
    fs.writeFileSync('./src/data/openings-with-lines.json', JSON.stringify(openingCategories, null, 2));
    console.log('Openings with lines have been written to openings-with-lines.json');
}); 