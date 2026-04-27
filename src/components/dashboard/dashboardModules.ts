export * from './dashboardTypes';

import { eventsModule } from '../events/eventsModule';
import { awardsModule } from '../awards/awardsModule';
import { awardsListModule } from '../awards/awardsListModule';
import { nominationsModule } from '../nominations/nominationsModule';
import { rankingsModule } from '../rankings/rankingsModule';
import { leadsModule } from '../leads/leadsModule';
import { categoriesModule } from '../categories/categoriesModule';
import { registrationsModule } from '../registrations/registrationsModule';
import { paymentsModule } from '../orders/paymentsModule';
import { filesModule } from '../files/filesModule';
// import { slidersModule } from '../sliders/slidersModule';
// import { formsModule } from '../forms/formsModule';

export {
  eventsModule,
  awardsModule,
  awardsListModule,
  nominationsModule,
  rankingsModule,
  leadsModule,
  categoriesModule,
  registrationsModule,
  paymentsModule,
  // slidersModule,
  // formsModule,
   filesModule,
};

export const dashboardModuleList = [
  eventsModule,
  awardsModule,
  awardsListModule,
  nominationsModule,
  // formsModule,
  rankingsModule,
  leadsModule,
  categoriesModule,
  registrationsModule,
  paymentsModule,
  filesModule,
  // slidersModule,
];

export const dashboardNavItems = [
  {
    label: 'Events',
    href: eventsModule.route,
    icon: eventsModule.icon,
  },
  {
    label: 'Awards',
    icon: awardsModule.icon,
    subItems: [
      { label: 'Awards List', href: awardsListModule.route },
      { label: 'Award Category', href: awardsModule.route },
      { label: 'Nominations', href: nominationsModule.route },
    ],
  },
  {
    label: 'Rankings',
    href: rankingsModule.route,
    icon: rankingsModule.icon,
  },
  {
    label: 'Leads',
    href: leadsModule.route,
    icon: leadsModule.icon,
  },
  {
    label: 'Categories',
    href: categoriesModule.route,
    icon: categoriesModule.icon,
  },
  {
    label: 'Registrations',
    href: registrationsModule.route,
    icon: registrationsModule.icon,
  },
];

export const dashboardRouteSearchPlaceholders: Record<string, string> = {
  '/dashboard': 'Search modules, records, and workflows...',
  '/dashboard/events': eventsModule.searchPlaceholder,
  '/dashboard/awards': awardsModule.searchPlaceholder,
  '/dashboard/awards-list': awardsListModule.searchPlaceholder,
  '/dashboard/nominations': nominationsModule.searchPlaceholder,
  '/dashboard/rankings': rankingsModule.searchPlaceholder,
  '/dashboard/leads': leadsModule.searchPlaceholder,
  '/dashboard/categories': categoriesModule.searchPlaceholder,
  '/dashboard/registrations': registrationsModule.searchPlaceholder,
  '/dashboard/payments': paymentsModule.searchPlaceholder,
  '/dashboard/files': filesModule.searchPlaceholder,
  // '/dashboard/sliders': slidersModule.searchPlaceholder,
  // '/dashboard/forms': formsModule.searchPlaceholder,
};

export function resolveDashboardSearchPlaceholder(pathname?: string | null) {
  if (!pathname) {
    return dashboardRouteSearchPlaceholders['/dashboard'];
  }

  if (pathname.startsWith('/dashboard/events')) {
    return eventsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/awards')) {
    return awardsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/awards-list')) {
    return awardsListModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/nominations')) {
    return nominationsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/rankings')) {
    return rankingsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/leads')) {
    return leadsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/categories')) {
    return categoriesModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/registrations')) {
    return registrationsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/payments')) {
    return paymentsModule.searchPlaceholder;
  }

  if (pathname.startsWith('/dashboard/files')) {
    return filesModule.searchPlaceholder;
  }

  // if (pathname.startsWith('/dashboard/sliders')) {
  //   return slidersModule.searchPlaceholder;
  // }

  // if (pathname.startsWith('/dashboard/forms')) {
  //   return formsModule.searchPlaceholder;
  // }

  return dashboardRouteSearchPlaceholders['/dashboard'];
}
