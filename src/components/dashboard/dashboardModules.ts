export * from './dashboardTypes';

import { eventsModule } from '../events/eventsModule';
import { awardsModule } from '../awards/awardsModule';
import { nominationsModule } from '../nominations/nominationsModule';
import { rankingsModule } from '../rankings/rankingsModule';
import { leadsModule } from '../leads/leadsModule';
import { categoriesModule } from '../categories/categoriesModule';
import { registrationsModule } from '../registrations/registrationsModule';
// import { slidersModule } from '../sliders/slidersModule';
// import { formsModule } from '../forms/formsModule';

export {
  eventsModule,
  awardsModule,
  nominationsModule,
  rankingsModule,
  leadsModule,
  categoriesModule,
  registrationsModule,
  // slidersModule,
};

export const dashboardModuleList = [
  eventsModule,
  awardsModule,
  nominationsModule,
  // formsModule,
  rankingsModule,
  leadsModule,
  categoriesModule,
  registrationsModule,
  // slidersModule,
];

export const dashboardNavItems = dashboardModuleList.map((module) => ({
  label: module.title,
  href: module.route,
  icon: module.icon,
  badge: 'CRUD',
}));

export const dashboardRouteSearchPlaceholders: Record<string, string> = {
  '/dashboard': 'Search modules, records, and workflows...',
  '/dashboard/events': eventsModule.searchPlaceholder,
  '/dashboard/awards': awardsModule.searchPlaceholder,
  '/dashboard/nominations': nominationsModule.searchPlaceholder,
  '/dashboard/rankings': rankingsModule.searchPlaceholder,
  '/dashboard/leads': leadsModule.searchPlaceholder,
  '/dashboard/categories': categoriesModule.searchPlaceholder,
  '/dashboard/registrations': registrationsModule.searchPlaceholder,
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

  // if (pathname.startsWith('/dashboard/sliders')) {
  //   return slidersModule.searchPlaceholder;
  // }

  // if (pathname.startsWith('/dashboard/forms')) {
  //   return formsModule.searchPlaceholder;
  // }

  return dashboardRouteSearchPlaceholders['/dashboard'];
}
