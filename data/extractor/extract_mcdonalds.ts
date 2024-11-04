interface McDonaldsItem {
  kor_name: string;
  eng_name: string;
  calorie: string;
  protein: string;
  fat: string;
  sodium: string;
  carbohydrate: string;
  weight: string;
  protein_ratio: string;
  fat_ratio: string;
  sodium_ratio: string;
  carbohydrate_ratio: string;
}

interface McDonaldsData {
  list: McDonaldsItem[];
}

async function extractNutrition(filePath: string): Promise<McDonaldsItem[]> {
  try {
    const fileContent = await Deno.readTextFile(filePath);
    const data: McDonaldsData = JSON.parse(fileContent);
    return data.list;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return [];
  }
}

async function processNutritionData() {
  try {
    const files = [];
    for await (const dirEntry of Deno.readDir('data/mcdonalds')) {
      if (dirEntry.isFile && dirEntry.name.endsWith('.json')) {
        files.push(dirEntry.name);
      }
    }

    const allNutrition: McDonaldsItem[] = [];
    for (const file of files) {
      const filePath = `data/mcdonalds/${file}`;
      const nutritionItems = await extractNutrition(filePath);
      allNutrition.push(...nutritionItems);
    }

    const formattedData = allNutrition.map((item) => ({
      name: {
        ko: item.kor_name.replace(/<[^>]*>/g, ''), // Remove HTML tags
        en: item.eng_name.replace(/<[^>]*>/g, ''), // Remove HTML tags
      },
      nutritionalInfo: {
        calories: parseInt(item.calorie),
        protein: {
          value: parseInt(item.protein),
          unit: 'g',
          dailyValue: `${item.protein_ratio}%`,
        },
        fat: {
          value: parseInt(item.fat),
          unit: 'g',
          dailyValue: `${item.fat_ratio}%`,
        },
        sodium: {
          value: parseInt(item.sodium),
          unit: 'mg',
          dailyValue: `${item.sodium_ratio}%`,
        },
        carbohydrate: {
          value: parseInt(item.carbohydrate),
          unit: 'g',
          dailyValue: `${item.carbohydrate_ratio}%`,
        },
        weight: parseInt(item.weight),
      },
    }));

    await Deno.writeTextFile('mcdonalds_nutrition.json', JSON.stringify(formattedData, null, 2));

    console.log('Nutrition data has been extracted and saved to mcdonalds_nutrition.json');
  } catch (error) {
    console.error('Error processing nutrition data:', error);
  }
}

// Run the script
await processNutritionData();
