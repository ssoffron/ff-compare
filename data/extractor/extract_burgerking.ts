interface NutritionItem {
  MENU_NM: string;
  CALORY: string;
  PROTEIN: string;
  SUGARS: string;
  NATRIUM: string;
  SATUFAT: string;
  WEIGHT: string;
}

interface BurgerKingData {
  body: {
    nutrition_list: NutritionItem[];
  };
}

// Helper function to parse values with ratios and units
function parseValueWithRatio(value: string) {
  const parts = value.split('(');
  let numericValue = '';
  let unit = '';
  let ratio = '';

  if (parts.length === 2) {
    // Extract numeric value and unit
    const valueMatch = parts[0].match(/(\d+)(mg|g)?/);
    if (valueMatch) {
      numericValue = valueMatch[1];
      unit = valueMatch[2] || '';
    }
    // Extract ratio
    ratio = parts[1].replace(')', '').replace('%', '');
  }

  return {
    value: parseInt(numericValue),
    unit,
    ratio: parseInt(ratio),
  };
}

async function extractNutrition(filePath: string): Promise<NutritionItem[]> {
  try {
    const fileContent = await Deno.readTextFile(filePath);
    const data: BurgerKingData = JSON.parse(fileContent);
    return data.body.nutrition_list;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

async function processNutritionData() {
  try {
    // Read all files in the burgerking directory
    const files = [];
    for await (const dirEntry of Deno.readDir('data/burgerking')) {
      if (dirEntry.isFile && dirEntry.name.endsWith('.json')) {
        files.push(dirEntry.name);
      }
    }

    // Process each file and collect nutrition data
    const allNutrition: NutritionItem[] = [];
    for (const file of files) {
      const filePath = `data/burgerking/${file}`;
      const nutritionItems = await extractNutrition(filePath);
      allNutrition.push(...nutritionItems);
    }

    // Format the data for better readability
    const formattedData = allNutrition.map((item) => {
      const protein = parseValueWithRatio(item.PROTEIN);
      const sodium = parseValueWithRatio(item.NATRIUM);
      const saturatedFat = parseValueWithRatio(item.SATUFAT);

      return {
        name: item.MENU_NM,
        nutritionalInfo: {
          calories: parseInt(item.CALORY),
          protein: {
            value: protein.value,
            unit: protein.unit || 'g',
            dailyValue: `${protein.ratio}%`,
          },
          sugar: parseInt(item.SUGARS),
          sodium: {
            value: sodium.value,
            unit: sodium.unit || 'mg',
            dailyValue: `${sodium.ratio}%`,
          },
          saturatedFat: {
            value: saturatedFat.value,
            unit: saturatedFat.unit || 'g',
            dailyValue: `${saturatedFat.ratio}%`,
          },
          weight: parseInt(item.WEIGHT),
        },
      };
    });

    // Write the results to a new file
    await Deno.writeTextFile(
      'data/burgerking_burgers.json',
      JSON.stringify(formattedData, null, 2),
    );

    console.log('Nutrition data has been extracted and saved to burgerking_burgers.json');
  } catch (error) {
    console.error('Error processing nutrition data:', error);
  }
}

// Run the script
await processNutritionData();
