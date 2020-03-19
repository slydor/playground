import { GlobalFilterState, defaultEvaluateCriteria, createGlobalFilterBuilder } from './singleValue';

describe('defaultEvaluateCriteria', () => {
    test.each`
        recordValue | filterState | expected
        ${0}        | ${null}     | ${true}
        ${0}        | ${1}        | ${true}
        ${0}        | ${2}        | ${true}
        ${1}        | ${null}     | ${true}
        ${1}        | ${1}        | ${true}
        ${1}        | ${2}        | ${false}
        ${2}        | ${null}     | ${true}
        ${2}        | ${1}        | ${false}
        ${2}        | ${2}        | ${true}
    `(
        '"no means all" semantic returns $expected when value=$recordValue and filter=$filterState',
        ({ recordValue, filterState, expected }) => {
            expect(defaultEvaluateCriteria({ value: recordValue }, filterState, new Set())).toBe(expected);
        }
    );
    test.each`
        recordValue | filterState | expected
        ${0}        | ${null}     | ${true}
        ${0}        | ${1}        | ${true}
        ${0}        | ${2}        | ${true}
        ${1}        | ${null}     | ${true}
        ${1}        | ${1}        | ${true}
        ${1}        | ${2}        | ${false}
        ${2}        | ${null}     | ${false}
        ${2}        | ${1}        | ${false}
        ${2}        | ${2}        | ${false}
    `(
        '"no means all" semantic returns $expected when value=$recordValue and filter=$filterState in restriced scope of [1]',
        ({ recordValue, filterState, expected }) => {
            expect(defaultEvaluateCriteria({ value: recordValue }, filterState, new Set([1]))).toBe(expected);
        }
    );
});

const mockNotSetFilterState: GlobalFilterState = {
    regionValue: null,
    depotValue: null,
    carrierValue: null,
    regionRestriction: new Set(),
    depotRestriction: new Set(),
    carrierRestriction: new Set(),
};
const getFilter = (partial: Partial<GlobalFilterState> = {}): GlobalFilterState => {
    return Object.assign({}, mockNotSetFilterState, partial);
};

describe.only('createGlobalFilterBuilder', () => {
    type MockData = { type: 'mockRecord' };
    const mockRecord: MockData = { type: 'mockRecord' };

    test('should create builder returning true when called without filter criteria', () => {
        const filterBuilder = createGlobalFilterBuilder(
            (record: MockData) => ({}),
            () => false
        );
        const result = filterBuilder(getFilter())(mockRecord);
        expect(result).toBe(true);
    });
    test('should create builder which not calls evaluateCriteria for no given criterias', () => {
        const mockPositiveEvaluateCriteria = jest.fn(() => true);

        const filterBuilder1 = createGlobalFilterBuilder((record: MockData) => ({}), mockPositiveEvaluateCriteria);
        filterBuilder1(getFilter())(mockRecord);

        expect(mockPositiveEvaluateCriteria).not.toHaveBeenCalled();
    });

    const mockFilterState = getFilter({
        regionValue: 10,
        depotValue: 20,
        carrierValue: 30,
        regionRestriction: new Set([11]),
        depotRestriction: new Set([22]),
        carrierRestriction: new Set([33]),
    });

    test('should create builder which calls evaluateCriteria only for region criteria', () => {
        const mockPositiveEvaluateCriteria = jest.fn(() => true);

        const filterBuilder = createGlobalFilterBuilder(
            (record: MockData) => ({ region: { value: 1 } }),
            mockPositiveEvaluateCriteria
        );

        filterBuilder(mockFilterState)(mockRecord);
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledTimes(1);
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledWith({ value: 1 }, 10, new Set([11]));
    });
    test('should create builder which calls evaluateCriteria only for depot criteria', () => {
        const mockPositiveEvaluateCriteria = jest.fn(() => true);

        const filterBuilder = createGlobalFilterBuilder(
            (record: MockData) => ({ depot: { value: 2 } }),
            mockPositiveEvaluateCriteria
        );

        filterBuilder(mockFilterState)(mockRecord);
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledTimes(1);
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledWith({ value: 2 }, 20, new Set([22]));
    });
    test('should create builder which calls evaluateCriteria only for carrier criteria', () => {
        const mockPositiveEvaluateCriteria = jest.fn(() => true);

        const filterBuilder = createGlobalFilterBuilder(
            (record: MockData) => ({ carrier: { value: 3 } }),
            mockPositiveEvaluateCriteria
        );

        filterBuilder(mockFilterState)(mockRecord);
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledTimes(1);
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledWith({ value: 3 }, 30, new Set([33]));
    });

    test('should create builder which calls evaluateCriteria for all criterias', () => {
        const mockPositiveEvaluateCriteria = jest.fn(() => true);

        const filterBuilder = createGlobalFilterBuilder(
            (record: MockData) => ({ region: { value: 1 }, depot: { value: 2 }, carrier: { value: 3 } }),
            mockPositiveEvaluateCriteria
        );

        filterBuilder(mockFilterState)(mockRecord);
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledTimes(3);
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledWith({ value: 1 }, 10, new Set([11]));
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledWith({ value: 2 }, 20, new Set([22]));
        expect(mockPositiveEvaluateCriteria).toHaveBeenCalledWith({ value: 3 }, 30, new Set([33]));
    });
});
