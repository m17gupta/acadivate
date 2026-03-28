import type { RootState } from '@/src/hook/store';
import type { DashboardModuleId, DashboardModuleRow } from './dashboardModules';
import type { EventRecord } from '@/src/hook/events/eventType';
import type { AwardRecord } from '@/src/hook/awards/awardType';
import type { RankingRecord } from '@/src/hook/rankings/rankingType';
import type { LeadRecord } from '@/src/hook/leads/leadType';
import type { NominationRecord } from '@/src/hook/nominations/nominationType';
import {
  createEventThunk,
  deleteEventThunk,
  fetchEventsThunk,
  updateEventThunk,
} from '@/src/hook/events/eventThunk';
import {
  createAwardThunk,
  deleteAwardThunk,
  fetchAwardsThunk,
  updateAwardThunk,
} from '@/src/hook/awards/awardThunk';
import {
  createRankingThunk,
  deleteRankingThunk,
  fetchRankingsThunk,
  updateRankingThunk,
} from '@/src/hook/rankings/rankingThunk';
import {
  createLeadThunk,
  deleteLeadThunk,
  fetchLeadsThunk,
  updateLeadThunk,
} from '@/src/hook/leads/leadThunk';
import {
  createNominationThunk,
  deleteNominationThunk,
  fetchNominationsThunk,
  updateNominationThunk,
} from '@/src/hook/nominations/nominationThunk';

type AnyRecord = {
  _id?: string;
  [key: string]: unknown;
};

type AnyThunk = (...args: any[]) => any;

export type DashboardModuleCrud = {
  fetchAllThunk: AnyThunk;
  createThunk: AnyThunk;
  updateThunk: AnyThunk;
  deleteThunk: AnyThunk;
  mapRecordToRow: (record: AnyRecord) => DashboardModuleRow;
};

export type DashboardModuleSnapshot = {
  records: AnyRecord[];
  isFetched: boolean;
};

function firstStringValue(record: AnyRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) {
      return value;
    }
  }

  return 'record';
}

function mapEventRecordToRow(record: AnyRecord): DashboardModuleRow {
  const event = record as unknown as EventRecord;

  return {
    id: String(event._id ?? event.slug ?? event.title ?? 'event'),
    values: {
      type: event.type ?? '',
      title: event.title ?? '',
      eventDate: event.eventDate ?? '',
      startTime: event.startTime ?? '',
      location: event.location ?? '',
      status: event.status ?? '',
      slug: event.slug ?? '',
      featured: event.featured ?? '',
      imageUrl: Array.isArray(event.imageUrl)
        ? event.imageUrl
        : event.imageUrl
          ? [event.imageUrl]
          : [],
    },
  };
}

function mapAwardRecordToRow(record: AnyRecord): DashboardModuleRow {
  const award = record as unknown as AwardRecord;

  return {
    id: String(award._id ?? award.title ?? award.category ?? 'award'),
    values: {
      title: award.title ?? '',
      cycle: award.cycle ?? '',
      category: award.category ?? '',
      nominationDeadline: award.nominationDeadline ?? '',
      status: award.status ?? '',
      imageUrl: award.imageUrl ?? '',
    },
  };
}

function mapRankingRecordToRow(record: AnyRecord): DashboardModuleRow {
  const ranking = record as unknown as RankingRecord;

  return {
    id: String(ranking._id ?? ranking.institution ?? ranking.rank ?? 'ranking'),
    values: {
      institution: ranking.institution ?? '',
      country: ranking.country ?? '',
      rank: ranking.rank ?? '',
      score: ranking.score ?? '',
      status: ranking.status ?? '',
      logoUrl: ranking.logoUrl ?? '',
    },
  };
}

function mapLeadRecordToRow(record: AnyRecord): DashboardModuleRow {
  const lead = record as unknown as LeadRecord;

  return {
    id: String(lead._id ?? lead.name ?? lead.email ?? 'lead'),
    values: {
      name: lead.name ?? '',
      email: lead.email ?? '',
      source: lead.source ?? '',
      subject: lead.subject ?? '',
      status: lead.status ?? '',
      note: lead.note ?? '',
    },
  };
}

function mapNominationRecordToRow(record: AnyRecord): DashboardModuleRow {
  const nomination = record as unknown as NominationRecord;

  return {
    id: String(nomination._id ?? nomination.nomineeName ?? nomination.award ?? 'nomination'),
    values: {
      nomineeName: nomination.nomineeName ?? '',
      award: nomination.award ?? '',
      category: nomination.category ?? '',
      submittedOn: nomination.submittedOn ?? '',
      status: nomination.status ?? '',
      note: nomination.note ?? '',
    },
  };
}

export function selectDashboardModuleSnapshot(
  state: RootState,
  moduleId: DashboardModuleId
): DashboardModuleSnapshot {
  switch (moduleId) {
    case 'events':
      return { records: state.events.allEvent, isFetched: state.events.isFetchedEvent };
    case 'awards':
      return { records: state.awards.allAward, isFetched: state.awards.isFetchedAward };
    case 'rankings':
      return { records: state.rankings.allRanking, isFetched: state.rankings.isFetchedRanking };
    case 'leads':
      return { records: state.leads.allLead, isFetched: state.leads.isFetchedLead };
    case 'nominations':
      return {
        records: state.nominations.allNomination,
        isFetched: state.nominations.isFetchedNomination,
      };
    default:
      return { records: [], isFetched: false };
  }
}

export function getDashboardModuleCrud(moduleId: DashboardModuleId): DashboardModuleCrud {
  switch (moduleId) {
    case 'events':
      return {
        fetchAllThunk: fetchEventsThunk as AnyThunk,
        createThunk: createEventThunk as AnyThunk,
        updateThunk: updateEventThunk as AnyThunk,
        deleteThunk: deleteEventThunk as AnyThunk,
        mapRecordToRow: mapEventRecordToRow,
      };
    case 'awards':
      return {
        fetchAllThunk: fetchAwardsThunk as AnyThunk,
        createThunk: createAwardThunk as AnyThunk,
        updateThunk: updateAwardThunk as AnyThunk,
        deleteThunk: deleteAwardThunk as AnyThunk,
        mapRecordToRow: mapAwardRecordToRow,
      };
    case 'rankings':
      return {
        fetchAllThunk: fetchRankingsThunk as AnyThunk,
        createThunk: createRankingThunk as AnyThunk,
        updateThunk: updateRankingThunk as AnyThunk,
        deleteThunk: deleteRankingThunk as AnyThunk,
        mapRecordToRow: mapRankingRecordToRow,
      };
    case 'leads':
      return {
        fetchAllThunk: fetchLeadsThunk as AnyThunk,
        createThunk: createLeadThunk as AnyThunk,
        updateThunk: updateLeadThunk as AnyThunk,
        deleteThunk: deleteLeadThunk as AnyThunk,
        mapRecordToRow: mapLeadRecordToRow,
      };
    case 'nominations':
      return {
        fetchAllThunk: fetchNominationsThunk as AnyThunk,
        createThunk: createNominationThunk as AnyThunk,
        updateThunk: updateNominationThunk as AnyThunk,
        deleteThunk: deleteNominationThunk as AnyThunk,
        mapRecordToRow: mapNominationRecordToRow,
      };
    default:
      return {
        fetchAllThunk: (() => null) as AnyThunk,
        createThunk: (() => null) as AnyThunk,
        updateThunk: (() => null) as AnyThunk,
        deleteThunk: (() => null) as AnyThunk,
        mapRecordToRow: (record) => ({
          id: String(record._id ?? firstStringValue(record, ['title', 'name', 'award'])),
          values: {},
        }),
      };
  }
}
