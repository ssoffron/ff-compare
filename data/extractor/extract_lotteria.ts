interface MenuItem {
  name: string;
  allergy: string;
  weight: string;
  calories: string;
  protein: string;
  sodium: string;
  sugar: string;
  saturatedFat: string;
  origin?: string;
}

// Helper function to parse values with ratios in parentheses
function parseValueWithRatio(value: string): { value: number; ratio: number | null } {
  const parts = value.split('(');
  if (parts.length === 2) {
    const numericValue = parseInt(parts[0].replace(/[^0-9]/g, ''));
    const ratio = parseInt(parts[1].replace(/[^0-9]/g, ''));
    return { value: numericValue, ratio };
  }
  return { value: parseInt(value.replace(/[^0-9]/g, '')), ratio: null };
}

async function extractBurgerNutrition() {
  try {
    // Read the HTML file content
    const fileContent = await Deno.readTextFile('data/lotteria/1.html');

    // Use regex to extract burger rows
    const burgerSection = fileContent.match(
      /<tbody>\s*<tr>\s*<td rowspan="\d+">햄버거<\/td>(.*?)<\/tbody>/s,
    );

    if (!burgerSection) {
      throw new Error('Burger section not found in HTML');
    }

    // Extract individual burger rows
    const burgerRows = burgerSection[1].match(/<tr>(.*?)<\/tr>/gs);

    if (!burgerRows) {
      throw new Error('No burger rows found');
    }

    const burgers = burgerRows
      .map((row) => {
        const cells = row.match(/<td[^>]*>(.*?)<\/td>/g);
        if (!cells) return null;

        const cleanCell = (cell: string) => cell.replace(/<td[^>]*>|<\/td>/g, '').trim();

        const burger: MenuItem = {
          name: cleanCell(cells[0]),
          allergy: cleanCell(cells[1]),
          weight: cleanCell(cells[2]),
          calories: cleanCell(cells[3]),
          protein: cleanCell(cells[4]),
          sodium: cleanCell(cells[5]),
          sugar: cleanCell(cells[6]),
          saturatedFat: cleanCell(cells[7]),
        };

        if (cells[9]) {
          burger.origin = cleanCell(cells[9]);
        }

        return burger;
      })
      .filter((burger): burger is MenuItem => burger !== null);

    const formattedData = burgers.map((burger) => {
      const protein = parseValueWithRatio(burger.protein);
      const sodium = parseValueWithRatio(burger.sodium);
      const saturatedFat = parseValueWithRatio(burger.saturatedFat);

      return {
        name: burger.name,
        nutritionalInfo: {
          weight: {
            value: parseInt(burger.weight),
            unit: 'g',
          },
          calories: parseInt(burger.calories),
          protein: {
            value: protein.value,
            unit: 'g',
            dailyValue: protein.ratio ? `${protein.ratio}%` : null,
          },
          sodium: {
            value: sodium.value,
            unit: 'mg',
            dailyValue: sodium.ratio ? `${sodium.ratio}%` : null,
          },
          sugar: {
            value: parseInt(burger.sugar),
            unit: 'g',
          },
          saturatedFat: {
            value: saturatedFat.value,
            unit: 'g',
            dailyValue: saturatedFat.ratio ? `${saturatedFat.ratio}%` : null,
          },
        },
        allergyInfo: burger.allergy.split(', '),
        origin: burger.origin || null,
      };
    });

    await Deno.writeTextFile('lotteria_burgers.json', JSON.stringify(formattedData, null, 2));

    console.log('Burger nutrition data has been extracted and saved to lotteria_burgers.json');
  } catch (error) {
    console.error('Error processing nutrition data:', error);
  }
}

// Run the script
await extractBurgerNutrition();
