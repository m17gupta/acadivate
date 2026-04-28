import type { RootState } from "@/src/hook/store";
import type { DashboardModuleId, DashboardModuleRow } from "./dashboardModules";
import type { EventRecord } from "@/src/hook/events/eventType";
import type { AwardRecord } from "@/src/hook/awards/awardType";
import type { RankingRecord } from "@/src/hook/rankings/rankingType";
import type { LeadRecord } from "@/src/hook/leads/leadType";
import type { NominationRecord } from "@/src/hook/nominations/nominationType";
import type { CategoryRecord } from "@/src/hook/categories/categoryType";
import {
  createEventThunk,
  deleteEventThunk,
  fetchEventsThunk,
  updateEventThunk,
} from "@/src/hook/events/eventThunk";
import {
  createAwardThunk,
  deleteAwardThunk,
  fetchAwardsThunk,
  updateAwardThunk,
} from "@/src/hook/awards/awardThunk";
import {
  createAwardListThunk,
  deleteAwardListThunk,
  fetchAwardsListThunk,
  updateAwardListThunk,
} from "@/src/hook/awards/awardsListThunk";
import {
  createRankingThunk,
  deleteRankingThunk,
  fetchRankingsThunk,
  updateRankingThunk,
} from "@/src/hook/rankings/rankingThunk";
import {
  createLeadThunk,
  deleteLeadThunk,
  fetchLeadsThunk,
  updateLeadThunk,
} from "@/src/hook/leads/leadThunk";
import {
  createNominationThunk,
  deleteNominationThunk,
  fetchNominationsThunk,
  updateNominationThunk,
} from "@/src/hook/nominations/nominationThunk";
import {
  createCategoryThunk,
  deleteCategoryThunk,
  fetchCategoriesThunk,
  updateCategoryThunk,
} from "@/src/hook/categories/categoryThunk";
import {
  createRegistrationThunk,
  deleteRegistrationThunk,
  fetchRegistrationsThunk,
  updateRegistrationThunk,
} from "@/src/hook/registrations/registrationThunk";
import {
  createSliderThunk,
  deleteSliderThunk,
  fetchSlidersThunk,
  updateSliderThunk,
} from "@/src/hook/sliders/sliderThunk";
import {
  createOrderThunk,
  fetchOrdersThunk,
} from "@/src/hook/orders/orderThunk";

type AnyRecord = {
  _id?: string | { $oid: string };
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

function normalizeValue(value: any) {
  if (value && typeof value === "object") {
    if (value.$date) return value.$date.split("T")[0];
    if (value.$oid) return value.$oid;
  }
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return value.split("T")[0];
  }
  return value;
}

function normalizeRecord(record: AnyRecord): AnyRecord {
  const normalized: AnyRecord = {};
  Object.keys(record).forEach((key) => {
    const value = record[key];
    // Detect nested section (has 'label' property and is an object, but not MongoDB $date/$oid)
    if (
      value &&
      typeof value === "object" &&
      "label" in (value as any) &&
      !(value as any).$date &&
      !(value as any).$oid
    ) {
      // It's a section, flatten its children
      Object.keys(value as any).forEach((subKey) => {
        if (subKey !== "label") {
          normalized[subKey] = normalizeValue((value as any)[subKey]);
        }
      });
    } else {
      normalized[key] = normalizeValue(value);
    }
  });
  return normalized;
}

function firstStringValue(record: AnyRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }

  return "record";
}

function mapEventRecordToRow(record: AnyRecord): DashboardModuleRow {
  const normalized = normalizeRecord(record);
  const event = normalized as any;

  return {
    id: String(event._id ?? event.slug ?? event.title ?? "event"),
    values: {
      ...normalized,
      title: event.title ?? "",
      slug: event.slug ?? "",
      status: event.status ?? "Draft",
      bannerImage: event.bannerImage || "",
      thumbnailImage: event.thumbnailImage || "",
      gallery: Array.isArray(event.gallery) ? event.gallery : [],
      agenda: Array.isArray(event.agenda) ? event.agenda : [],
      speakers: Array.isArray(event.speakers) ? event.speakers : [],
      faqs: Array.isArray(event.faqs) ? event.faqs : [],
      termsAndConditions: Array.isArray(event.termsAndConditions)
        ? event.termsAndConditions
        : [],
      customRegistrationForm: Array.isArray(event.customRegistrationForm)
        ? event.customRegistrationForm
        : [],
    },
  };
}

function mapAwardRecordToRow(record: AnyRecord): DashboardModuleRow {
  const award: any = record;

  return {
    id: String(award._id ?? award.title ?? award.category ?? "award"),
    values: {
      title: award.title ?? "",
      cycle: award.cycle ?? "",
      category: award.category ?? "",
      status: award.status ?? "",
      items: award.items ?? [],
    },
  };
}

function mapAwardListRecordToRow(record: any): DashboardModuleRow {
  return {
    id: String(record._id ?? "award-list"),
    values: {
      selectedAwards: (record.selectedAwards as any[]) ?? [],
      deadline: String(record.deadline ?? ""),
      status: String(record.status ?? ""),
      active: record.active ?? false,
    },
  };
}

function mapRankingRecordToRow(record: AnyRecord): DashboardModuleRow {
  const ranking = record as unknown as RankingRecord;

  return {
    id: String(ranking._id ?? ranking.institution ?? ranking.rank ?? "ranking"),
    values: {
      institution: ranking.institution ?? "",
      country: ranking.country ?? "",
      rank: ranking.rank ?? "",
      score: ranking.score ?? "",
      status: ranking.status ?? "",
      logoUrl: ranking.logoUrl ?? "",
    },
  };
}

function mapLeadRecordToRow(record: AnyRecord): DashboardModuleRow {
  const lead = record as unknown as LeadRecord;

  return {
    id: String(lead._id ?? lead.name ?? lead.email ?? "lead"),
    values: {
      name: lead.name ?? "",
      email: lead.email ?? "",
      phoneNumber: lead.phoneNumber ?? "",
      institution: lead.institution ?? "",
      source: lead.source ?? "",
      subject: lead.subject ?? "",
      status: lead.status ?? "",
      note: lead.note ?? "",
    },
  };
}

function mapNominationRecordToRow(record: AnyRecord): DashboardModuleRow {
  const nomination = record as unknown as NominationRecord;

  return {
    id: String(
      nomination._id ??
        nomination.nomineeFirstName ??
        nomination.nomineeLastName ??
        nomination.award ??
        "nomination",
    ),
    values: {
      nomineeFirstName: nomination.nomineeFirstName ?? "",
      nomineeLastName: nomination.nomineeLastName ?? "",
      nomineeEmail: nomination.nomineeEmail ?? "",
      award: nomination.award ?? "",
      category: nomination.category ?? "",
      voting: nomination.voting ?? "",
      source: nomination.source ?? "",
      narrative: nomination.narrative ?? "",
      roles: nomination.roles ?? "",
      education: nomination.education ?? "",
      status: nomination.status ?? "",
    },
  };
}

function mapCategoryRecordToRow(record: AnyRecord): DashboardModuleRow {
  const category = record as unknown as CategoryRecord;

  return {
    id: String(category._id ?? category.title ?? "category"),
    values: {
      title: category.title ?? "",
      desc: category.desc ?? "",
      tags: category.tags ?? "",
      count: category.count ?? "",
      color: category.color ?? "",
    },
  };
}

function mapRegistrationRecordToRow(record: AnyRecord): DashboardModuleRow {
  return {
    id: String(record._id ?? record.email ?? "registration"),
    values: {
      fullName: String(record.fullName ?? ""),
      email: String(record.email ?? ""),
      phoneNumber: String(record.phoneNumber ?? ""),
      role: String(record.role ?? ""),
      status: String(record.status ?? "Pending"),
    },
  };
}

function mapOrderRecordToRow(record: AnyRecord): DashboardModuleRow {
  return {
    id: String(record._id ?? record.paymentId ?? "payment"),
    values: {
      paymentId: String(record.paymentId ?? ""),
      orderId: String(record.orderId ?? ""),
      amount: String(record.amount ?? "0"),
      status: String(record.status ?? "pending"),
      paymentMethod: String(record.paymentMethod ?? "Offline Payment"),
      createdAt: String(record.createdAt ?? ""),
    },
  };
}

function mapSliderRecordToRow(record: AnyRecord): DashboardModuleRow {
  return {
    id: String(record._id ?? record.title ?? "slider"),
    values: {
      title: String(record.title ?? ""),
      subtitle: String(record.subtitle ?? ""),
      imageUrl: String(record.imageUrl ?? ""),
      linkUrl: String(record.linkUrl ?? ""),
      order: String(record.order ?? "0"),
      status: String(record.status ?? "Active"),
      description: String(record.description ?? ""),
    },
  };
}

export function selectDashboardModuleSnapshot(
  state: RootState,
  moduleId: DashboardModuleId,
): DashboardModuleSnapshot {
  switch (moduleId) {
    case "events":
      return {
        records: state.events.allEvent,
        isFetched: state.events.isFetchedEvent,
      };
    case "awards":
      return {
        records: state.awards.allAward,
        isFetched: state.awards.isFetchedAward,
      };
    case "awards-list":
      return {
        records: state.awardsList.allAwardsList,
        isFetched: state.awardsList.isFetchedAwardsList,
      };
    case "rankings":
      return {
        records: state.rankings.allRanking,
        isFetched: state.rankings.isFetchedRanking,
      };
    case "leads":
      return {
        records: state.leads.allLead,
        isFetched: state.leads.isFetchedLead,
      };
    case "nominations":
      return {
        records: state.nominations.allNomination,
        isFetched: state.nominations.isFetchedNomination,
      };
    case "categories":
      return {
        records: state.categories.allCategory,
        isFetched: state.categories.isFetchedCategory,
      };
    case "registrations":
      return {
        records: state.registrations.allRegistration,
        isFetched: state.registrations.isFetchedRegistration,
      };
    case "sliders":
      return {
        records: state.sliders.allSlider,
        isFetched: state.sliders.isFetchedSlider,
      };
    case "payments":
      return {
        records: state.orders.allOrders,
        isFetched: state.orders.isFetchedOrder,
      };
    default:
      return { records: [], isFetched: false };
  }
}

export function getDashboardModuleCrud(
  moduleId: DashboardModuleId,
): DashboardModuleCrud {
  switch (moduleId) {
    case "events":
      return {
        fetchAllThunk: fetchEventsThunk as AnyThunk,
        createThunk: createEventThunk as AnyThunk,
        updateThunk: updateEventThunk as AnyThunk,
        deleteThunk: deleteEventThunk as AnyThunk,
        mapRecordToRow: mapEventRecordToRow,
      };
    case "awards":
      return {
        fetchAllThunk: fetchAwardsThunk as AnyThunk,
        createThunk: createAwardThunk as AnyThunk,
        updateThunk: updateAwardThunk as AnyThunk,
        deleteThunk: deleteAwardThunk as AnyThunk,
        mapRecordToRow: mapAwardRecordToRow,
      };
    case "awards-list":
      return {
        fetchAllThunk: fetchAwardsListThunk as AnyThunk,
        createThunk: createAwardListThunk as AnyThunk,
        updateThunk: updateAwardListThunk as AnyThunk,
        deleteThunk: deleteAwardListThunk as AnyThunk,
        mapRecordToRow: mapAwardListRecordToRow,
      };
    case "rankings":
      return {
        fetchAllThunk: fetchRankingsThunk as AnyThunk,
        createThunk: createRankingThunk as AnyThunk,
        updateThunk: updateRankingThunk as AnyThunk,
        deleteThunk: deleteRankingThunk as AnyThunk,
        mapRecordToRow: mapRankingRecordToRow,
      };
    case "leads":
      return {
        fetchAllThunk: fetchLeadsThunk as AnyThunk,
        createThunk: createLeadThunk as AnyThunk,
        updateThunk: updateLeadThunk as AnyThunk,
        deleteThunk: deleteLeadThunk as AnyThunk,
        mapRecordToRow: mapLeadRecordToRow,
      };
    case "nominations":
      return {
        fetchAllThunk: fetchNominationsThunk as AnyThunk,
        createThunk: createNominationThunk as AnyThunk,
        updateThunk: updateNominationThunk as AnyThunk,
        deleteThunk: deleteNominationThunk as AnyThunk,
        mapRecordToRow: mapNominationRecordToRow,
      };
    case "categories":
      return {
        fetchAllThunk: fetchCategoriesThunk as AnyThunk,
        createThunk: createCategoryThunk as AnyThunk,
        updateThunk: updateCategoryThunk as AnyThunk,
        deleteThunk: deleteCategoryThunk as AnyThunk,
        mapRecordToRow: mapCategoryRecordToRow,
      };
    case "registrations":
      return {
        fetchAllThunk: fetchRegistrationsThunk as AnyThunk,
        createThunk: createRegistrationThunk as AnyThunk,
        updateThunk: updateRegistrationThunk as AnyThunk,
        deleteThunk: deleteRegistrationThunk as AnyThunk,
        mapRecordToRow: mapRegistrationRecordToRow,
      };
    case "sliders":
      return {
        fetchAllThunk: fetchSlidersThunk as AnyThunk,
        createThunk: createSliderThunk as AnyThunk,
        updateThunk: updateSliderThunk as AnyThunk,
        deleteThunk: deleteSliderThunk as AnyThunk,
        mapRecordToRow: mapSliderRecordToRow,
      };
    case "payments":
      return {
        fetchAllThunk: fetchOrdersThunk as AnyThunk,
        createThunk: createOrderThunk as AnyThunk,
        updateThunk: (() => null) as AnyThunk,
        deleteThunk: (() => null) as AnyThunk,
        mapRecordToRow: mapOrderRecordToRow,
      };
    default:
      return {
        fetchAllThunk: (() => null) as AnyThunk,
        createThunk: (() => null) as AnyThunk,
        updateThunk: (() => null) as AnyThunk,
        deleteThunk: (() => null) as AnyThunk,
        mapRecordToRow: (record) => ({
          id: String(
            record._id ?? firstStringValue(record, ["title", "name", "award"]),
          ),
          values: {},
        }),
      };
  }
}
