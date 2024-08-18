'use client';

import React, { useState, useEffect } from 'react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import { Search, Star } from 'lucide-react';
import { brands, menuItems } from '@/data/menu';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const FastFoodNutritionComparison = () => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMenuItems, setFilteredMenuItems] = useState(menuItems);
  const [selectedItems, setSelectedItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const filtered = menuItems.filter(
      (item) =>
        (!selectedBrand || item.brand === selectedBrand) &&
        (!searchTerm || item.item.toLowerCase().includes(searchTerm.toLowerCase())),
    );
    setFilteredMenuItems(filtered);
  }, [selectedBrand, searchTerm]);

  const toggleItemSelection = (item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item],
    );
  };

  const toggleFavorite = (item) => {
    setFavorites((prev) =>
      prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item],
    );
  };

  const NutritionChart = ({ item }) => (
    <ChartContainer config={{} satisfies ChartConfig}>
      <BarChart
        width={500}
        height={300}
        data={[
          { name: 'Calories', value: item.calories },
          { name: 'Fat', value: item.fat },
          { name: 'Protein', value: item.protein },
          { name: 'Carbs', value: item.carbs },
        ]}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey='name' />
        <YAxis />
        <Bar dataKey='value' fill='#8884d8' />
        <ChartTooltip content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  );

  const ItemCard = ({ item, isFavorite, onToggleFavorite, onToggleSelection }) => (
    <Card className='mb-4 cursor-pointer' onClick={() => onToggleSelection(item)}>
      <CardContent className='flex justify-between items-center p-4'>
        <div>
          <h3 className='text-lg font-semibold'>{item.item}</h3>
          <p>{item.calories} calories</p>
        </div>
        <Button
          variant='outline'
          size='icon'
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item);
          }}
        >
          <Star className={isFavorite ? 'fill-current' : ''} />
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className='container mx-auto p-4'>
      <div className='flex flex-col md:flex-row gap-4'>
        <Card className='w-full md:w-1/4'>
          <CardHeader>
            <CardTitle>Fast Food Nutrition</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <Select onValueChange={(value) => setSelectedBrand(value)}>
                <SelectTrigger>
                  <SelectValue placeholder='Select a brand' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='-'>All brands</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  type='text'
                  placeholder='Search menu items'
                  className='pl-8'
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className='flex items-center space-x-2'>
                <Switch id='dark-mode' checked={isDarkMode} onCheckedChange={setIsDarkMode} />
                <Label htmlFor='dark-mode'>Dark Mode</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='w-full md:w-3/4'>
          <Tabs defaultValue='menu'>
            <TabsList>
              <TabsTrigger value='menu'>Menu</TabsTrigger>
              <TabsTrigger value='comparison'>Comparison</TabsTrigger>
              <TabsTrigger value='favorites'>Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value='menu'>
              <Card>
                <CardHeader>
                  <CardTitle>Menu Items</CardTitle>
                </CardHeader>
                <CardContent>
                  {filteredMenuItems.map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      isFavorite={favorites.some((i) => i.id === item.id)}
                      onToggleFavorite={toggleFavorite}
                      onToggleSelection={toggleItemSelection}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='comparison'>
              <Card>
                <CardHeader>
                  <CardTitle>Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedItems.length > 0 ? (
                    selectedItems.map((item) => (
                      <div key={item.id} className='mb-8'>
                        <h3 className='text-lg font-semibold mb-2'>{item.item}</h3>
                        <NutritionChart item={item} />
                      </div>
                    ))
                  ) : (
                    <p>Select items from the menu to compare</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='favorites'>
              <Card>
                <CardHeader>
                  <CardTitle>Favorites</CardTitle>
                </CardHeader>
                <CardContent>
                  {favorites.length > 0 ? (
                    favorites.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                        onToggleSelection={toggleItemSelection}
                      />
                    ))
                  ) : (
                    <p>No favorites yet</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Card className='mt-4'>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Nutritional data is sourced from publicly available information provided by fast
                food chains. This information may change, and we recommend verifying with the
                official websites for the most up-to-date and accurate data.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FastFoodNutritionComparison;
