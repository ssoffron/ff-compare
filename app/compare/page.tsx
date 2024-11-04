'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { BurgerSelector } from '../../components/BurgerSelector';
import { ComparisonTable } from '../../components/ComparisonTable';
import { Burger } from '../../types';
import burgerKingData from '@/data/burgerking_burgers.json';
import lotteriaData from '@/data/lotteria_burgers.json';
import mcdonaldsData from '@/data/mcdonalds_burgers.json';

export default function BurgerComparison() {
  const [selectedBurgers, setSelectedBurgers] = useState<Burger[]>([]);

  const allBurgers = [
    ...burgerKingData.map((burger) => ({ ...burger, brand: 'Burger King' })),
    ...lotteriaData.map((burger) => ({ ...burger, brand: 'Lotteria' })),
    ...mcdonaldsData.map((burger) => ({ ...burger, brand: "McDonald's" })),
  ];

  const handleBurgerSelect = (value: string) => {
    const burger = allBurgers[parseInt(value)];
    if (selectedBurgers.length < 4) {
      setSelectedBurgers([...selectedBurgers, burger]);
    }
  };

  const handleRemoveBurger = (index: number) => {
    setSelectedBurgers(selectedBurgers.filter((_, i) => i !== index));
  };

  return (
    <div className='container mx-auto p-6'>
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Burger Nutritional Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <BurgerSelector
            allBurgers={allBurgers}
            onSelect={handleBurgerSelect}
            disabled={selectedBurgers.length >= 4}
          />
          {selectedBurgers.length > 0 && (
            <ComparisonTable burgers={selectedBurgers} onRemove={handleRemoveBurger} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
