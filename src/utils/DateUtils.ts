import { format } from 'date-fns';

export default class DateUtils {
  static formatDate = (date: Date | string, formatter: string = 'MMMM dd, yyyy'): string => {
    return format(new Date(date), formatter);
  };
}
