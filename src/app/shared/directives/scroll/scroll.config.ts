import { InjectionToken } from '@angular/core';

import PerfectScrollbar from 'perfect-scrollbar';

export const SCROLL_CONFIG_TOKEN = new InjectionToken<PerfectScrollbar.Options>('SCROLL_CONFIG');

export const SCROLL_CONFIG: PerfectScrollbar.Options = {
  minScrollbarLength: 50,
  suppressScrollX: true
};
