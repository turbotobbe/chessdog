import * as fs from 'fs';
import * as path from 'path';
import { test } from 'vitest';
import { Line, Opening, OpeningCategory } from '../src/types/chess';
import { defaultChessBoardController } from '../src/controllers/DefaultChessBoardController';
import { parsePgn, parseMove } from '../src/utils/pgn';
import { serializeController, serializeTree } from '../src/controllers/Serialize';

test('merge lines and opening groups', () => {
  const linesData: Line[] = JSON.parse(fs.readFileSync('test/lines.json', 'utf-8'));
  const openingGroupsData = JSON.parse(fs.readFileSync('test/openingGroups.json', 'utf-8'));
  const openingCategories: OpeningCategory[] = openingGroupsData.openingCategories;

  for (const openingCategory of openingCategories) {
    console.log(openingCategory.name)
    for (const opening of openingCategory.openings) {
      // console.log(o);
      let [fromElo, toElo] = opening.range.split('-');
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
      console.log(lines.length, opening.name)

      const openingSlug = opening.slug;
      const openingName = opening.name;
      const openingRange = opening.range;
      const openingLines = lines.sort((a, b) => b.count - a.count);

      // build the tree
      const controller = defaultChessBoardController('Explore', true, true);

      for (const line of openingLines) {
        controller.selectFirst()
        console.log('line', line.moves)
        const pgnGame = parsePgn(line.moves, line.name);
        pgnGame.turns.forEach((turn) => {
          const move = parseMove(controller.currentState(), turn.white.pgn)
          controller.onMove(move.sourceSquareId, move.targetSquareId);
          if (turn.black) {
            const move = parseMove(controller.currentState(), turn.black.pgn);
            controller.onMove(move.sourceSquareId, move.targetSquareId);
          }
        });
        controller.onComment(line.name);
      }
      controller.selectFirst();

      // select first move of each node
      for (const nodeId in controller.gameTree.nodes) {
        if (controller.gameTree.nodes[nodeId].childIds.length > 0) {
          controller.gameTree.nodes[nodeId].childIdx = 0;
        }
      }

      // add opening name to root node
      controller.gameTree.nodes[controller.gameTree.rootId].state.comments = [opening.name];

      // serialize the tree
      const serializedTree = serializeTree(controller.gameTree);

      const dirPath = path.join('public', 'openings', openingCategory.slug);
      const filePath = path.join(dirPath, `${openingSlug}.json`);

      // Create directories recursively if they don't exist
      fs.mkdirSync(dirPath, { recursive: true });

      console.log(`Writing ${filePath}`);
      // Write grouped openings to JSON file
      fs.writeFileSync(filePath, JSON.stringify(serializedTree, null, 2));
    }
  }

  // // Write grouped openings to openings.grouped.json
  // fs.writeFileSync('test/openings.json', JSON.stringify(openingCategories, null, 2));

  // console.log('Sample group:', Object.entries(groupedOpenings)[0]);
});
