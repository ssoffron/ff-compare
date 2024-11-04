import { Burger } from '../types';
import { getBurgerName, getNutritionalValue } from '../lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface ComparisonTableProps {
  burgers: Burger[];
  onRemove: (index: number) => void;
}

export function ComparisonTable({ burgers, onRemove }: ComparisonTableProps) {
  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Nutritional Info</TableHead>
            {burgers.map((burger, index) => (
              <TableHead key={index}>
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{getBurgerName(burger)}</span>
                  <Button variant='ghost' size='sm' onClick={() => onRemove(index)}>
                    <X className='h-4 w-4' />
                  </Button>
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <NutritionalRow label='Calories' field='calories' burgers={burgers} />
          <NutritionalRow label='Protein' field='protein' burgers={burgers} showDailyValue />
          <NutritionalRow label='Sodium' field='sodium' burgers={burgers} showDailyValue />
          <NutritionalRow label='Sugar' field='sugar' burgers={burgers} />
          <NutritionalRow
            label='Saturated Fat'
            field='saturatedFat'
            burgers={burgers}
            showDailyValue
          />
        </TableBody>
      </Table>
    </div>
  );
}

interface NutritionalRowProps {
  label: string;
  field: keyof Burger['nutritionalInfo'];
  burgers: Burger[];
  showDailyValue?: boolean;
}

function NutritionalRow({ label, field, burgers, showDailyValue }: NutritionalRowProps) {
  return (
    <TableRow>
      <TableCell className='font-medium'>{label}</TableCell>
      {burgers.map((burger, index) => (
        <TableCell key={index} className='text-center'>
          {field === 'calories'
            ? burger.nutritionalInfo[field]
            : getNutritionalValue(burger.nutritionalInfo[field])}
          {showDailyValue && (
            <>
              <br />
              <span className='text-sm text-muted-foreground'>
                {(burger.nutritionalInfo[field] as any)?.dailyValue}
              </span>
            </>
          )}
        </TableCell>
      ))}
    </TableRow>
  );
}
