import { Burger } from '../types';
import { getBurgerName } from '../lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BurgerSelectorProps {
  allBurgers: Burger[];
  onSelect: (value: string) => void;
  disabled: boolean;
}

export function BurgerSelector({ allBurgers, onSelect, disabled }: BurgerSelectorProps) {
  return (
    <div className='mb-6'>
      <label className='text-sm font-medium mb-2 block'>Select Burgers (up to 4)</label>
      <Select onValueChange={onSelect} disabled={disabled}>
        <SelectTrigger className='w-full max-w-md'>
          <SelectValue placeholder='Select a burger' />
        </SelectTrigger>
        <SelectContent>
          {allBurgers.map((burger, index) => (
            <SelectItem key={index} value={index.toString()}>
              {burger.brand} - {getBurgerName(burger)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
