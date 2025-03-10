import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'day'
})
export class DayPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(value === '1' || value === '21' || value === '31') {
      return value + 'st'
    } else if (value === '2' || value === '22') {
      return value + 'nd'
    } else if (value === '3' || value === '23') {
      return value + 'rd'
    }
    return value + 'th';
  }

}
