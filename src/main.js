import './libs/typeahead';
import './libs/date-time-picker';
import { EventCalendar } from './calendar/event-calendar.js';
import { CitySearch } from './search-city/search-city'

export const eventCalendar = new EventCalendar();
export const citySearch = new CitySearch();