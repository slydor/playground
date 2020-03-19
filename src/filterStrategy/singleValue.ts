// filter scope

export type FilterCriteria = {
    value: number;
};

export type GlobalFilterCriterias = {
    region?: FilterCriteria;
    depot?: FilterCriteria;
    carrier?: FilterCriteria;
};

export type GlobalFilterState = {
    regionValue: number | null;
    depotValue: number | null;
    carrierValue: number | null;
    regionRestriction: Set<number>;
    depotRestriction: Set<number>;
    carrierRestriction: Set<number>;
};

export type FilterCriteriaEvaluator = (
    recordValue: FilterCriteria,
    filterState: number | null,
    restrictionScope: Set<number>
) => boolean;

const VALUE_NOT_SET = 0;
export const defaultEvaluateCriteria: FilterCriteriaEvaluator = ({ value }, filterState, restrictionScope): boolean => {
    const isValueSet = value !== VALUE_NOT_SET;
    const isFilterActive = filterState !== null;
    const isValueInScope = restrictionScope.size ? restrictionScope.has(value) : true;

    if (isFilterActive && isValueSet) {
        return filterState === value && isValueInScope;
    } else if (isValueSet) {
        return isValueInScope;
    } else {
        return true;
    }
};

export type GlobalFilterBuilder<TData> = (filterState: GlobalFilterState) => (record: TData) => boolean;
export const createGlobalFilterBuilder = <TData>(
    selectFilterCriteriaStrategy: (record: TData) => GlobalFilterCriterias,
    evaluateCriteria: FilterCriteriaEvaluator
): GlobalFilterBuilder<TData> => {
    return ({
        regionValue,
        depotValue,
        carrierValue,
        regionRestriction,
        depotRestriction,
        carrierRestriction,
    }: GlobalFilterState) => {
        return (record: TData): boolean => {
            const { region, depot, carrier } = selectFilterCriteriaStrategy(record);

            return (
                (region ? evaluateCriteria(region, regionValue, regionRestriction) : true) &&
                (depot ? evaluateCriteria(depot, depotValue, depotRestriction) : true) &&
                (carrier ? evaluateCriteria(carrier, carrierValue, carrierRestriction) : true)
            );
        };
    };
};

// user global scope
export type Task = {
    mainRegionNr: number | null;
    depotNr: number | null;
    carrier: number | null;
};

export type Engineer = {
    regionNr: number | null;
    fixedDepotNr: number | null;
};

export const taskGlobalFilterBuilder = createGlobalFilterBuilder(
    ({ mainRegionNr, depotNr, carrier }: Task) => ({
        region: { value: mainRegionNr ?? 0 },
        depot: { value: depotNr ?? 0 },
        carrier: { value: carrier ?? 0 },
    }),
    defaultEvaluateCriteria
);

export const engineerGlobalFilterBuilder = createGlobalFilterBuilder(
    ({ regionNr, fixedDepotNr }: Engineer) => ({
        region: { value: regionNr ?? 0 },
        depot: { value: fixedDepotNr ?? 0 },
    }),
    defaultEvaluateCriteria
);

// user specific scope

const mockFilterState: GlobalFilterState = {
    regionValue: null,
    depotValue: null,
    carrierValue: null,
    regionRestriction: new Set(),
    depotRestriction: new Set(),
    carrierRestriction: new Set(),
};
const tasks: Task[] = [{ depotNr: 1, mainRegionNr: null, carrier: 0 }];
const engineers: Engineer[] = [{ fixedDepotNr: 1, regionNr: null }];

const taskFilter = taskGlobalFilterBuilder(mockFilterState);
tasks.filter(taskFilter);
const engFilter = engineerGlobalFilterBuilder(mockFilterState);
engineers.filter(engFilter);
