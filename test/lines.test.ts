import * as fs from 'fs';
import * as cheerio from 'cheerio';
import { test } from 'vitest';
import { Line, Opening, OpeningCategory } from '../src/types/chess';
import { fixPgn, parsePgn } from '../src/utils/pgn';
import { BoardState, loadBoardState } from '../src/models/BoardState';
// openings was found at https://old.chesstempo.com/chess-openings.html
// and stored manually in openings.html
// the data was extracted using the following code:

/* <tr id="yui-rec51" style="" class="yui-dt-odd">
    <td headers="yui-dt0-th-name " class="yui-dt0-col-name yui-dt-col-name yui-dt-asc yui-dt-sortable yui-dt-first"><div class="yui-dt-liner"><a href="/gamedb/opening/2">Alekhine Defense, Brooklyn Variation</a></div></td>
    <td headers="yui-dt0-th-moves_san " class="yui-dt0-col-moves_san yui-dt-col-moves_san"><div class="yui-dt-liner"><div style="width:30px;background-color:black;">&nbsp;</div></div></td>
    <td headers="yui-dt0-th-total_games " class="yui-dt0-col-total_games yui-dt-col-total_games yui-dt-sortable"><div class="yui-dt-liner">408</div></td>
    <td headers="yui-dt0-th-eco " class="yui-dt0-col-eco yui-dt-col-eco yui-dt-sortable"><div class="yui-dt-liner">B02</div></td>
    <td headers="yui-dt0-th-last_played " class="yui-dt0-col-last_played yui-dt-col-last_played"><div class="yui-dt-liner">2024-08-04</div></td>
    <td headers="yui-dt0-th-performance " class="yui-dt0-col-performance yui-dt-col-performance yui-dt-sortable"><div class="yui-dt-liner">2160</div></td>
    <td headers="yui-dt0-th-avg_player " class="yui-dt0-col-avg_player yui-dt-col-avg_player yui-dt-sortable"><div class="yui-dt-liner">2212</div></td>
    <td headers="yui-dt0-th-player_wins " class="yui-dt0-col-player_wins yui-dt-col-player_wins yui-dt-sortable"><div class="yui-dt-liner">35.8%</div></td>
    <td headers="yui-dt0-th-draws " class="yui-dt0-col-draws yui-dt-col-draws yui-dt-sortable"><div class="yui-dt-liner">20.1%</div></td>
    <td headers="yui-dt0-th-opponent_wins " class="yui-dt0-col-opponent_wins yui-dt-col-opponent_wins yui-dt-sortable"><div class="yui-dt-liner">44.1%</div></td>
    <td headers="yui-dt0-th-moves_san " class="yui-dt0-col-moves_san yui-dt-col-moves_san yui-dt-last"><div class="yui-dt-liner">1.e4 Nf6 2.e5 Ng8</div></td>
  </tr>
*/
function htmlToLines(htmlContent: string): Line[] {
  const $ = cheerio.load(htmlContent);
  const lines: Line[] = [];

  $('tr[id^="yui-rec"]').each((index, element) => {
    const line: Line = {
      eco: '',
      name: '',
      color: '',
      moves: '',
      count: 0
    };
    // Extract name and link
    const nameCell = $(element).find('td.yui-dt-col-name');
    const link = nameCell.find('a');
    line.name = link.text();
    // line.link = link.attr('href') || '';

    line.color = $(element).find('td.yui-dt-col-moves_san div[style*="background-color"]').attr('style')?.match(/background-color:(.*?);/)?.[1].trim() || '';

    // Extract other data
    line.count = parseInt($(element).find('td.yui-dt-col-total_games').text().trim(), 10);
    line.eco = $(element).find('td.yui-dt-col-eco').text().trim();
    // opening.last_played = $(element).find('td.yui-dt-col-last_played').text().trim();
    // opening.performance = $(element).find('td.yui-dt-col-performance').text().trim();
    // opening.avg_player = $(element).find('td.yui-dt-col-avg_player').text().trim();
    // opening.player_wins = $(element).find('td.yui-dt-col-player_wins').text().trim();
    // opening.draws = $(element).find('td.yui-dt-col-draws').text().trim();
    // opening.opponent_wins = $(element).find('td.yui-dt-col-opponent_wins').text().trim();
    line.moves = $(element).find('td.yui-dt-col-moves_san.yui-dt-last').text().trim();

    const moves = fixPgn(line.moves)
    console.log(`test ${moves}`)

    // test parse and run
    const pgn = parsePgn(moves)
    let boardState = new BoardState()
    boardState = loadBoardState(boardState, [pgn])

    line.moves = moves
    console.log('ok')
    lines.push(line);
  });

  return lines;
}

test('html to json', () => {
  // Read the HTML file
  const htmlContent = fs.readFileSync('test/lines.html', 'utf-8');

  // Extract data
  const lines = htmlToLines(htmlContent);

  // Write to JSON file
  fs.writeFileSync('test/lines.json', JSON.stringify(lines, null, 2));

  console.log("Data has been extracted and saved to lines.json");
});

