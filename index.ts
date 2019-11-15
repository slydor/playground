type AttachmentQueryParameterVT = { vtId: number; fileName: string; saveAs: boolean };

type AttachmentQueryParameterDnow = { deliverId: number; fileName: string; saveAs: boolean };

type ReportQueryParameter = { callNr: number; engNr: string; reportType: number; saveAs: boolean };

type MicroserviceAttachmentQuery = {
    endpoint: 'files';
    parameter: AttachmentQueryParameterVT | AttachmentQueryParameterDnow;
};
type MicroserviceReportQuery = {
    endpoint: 'report';
    parameter: ReportQueryParameter;
};

type MicroserviceQuery = MicroserviceAttachmentQuery | MicroserviceReportQuery;

// -

type AttachmentQueryParameterVTArray = [{ vtId: number }, { fileName: string }, { saveAs: boolean }];

type AttachmentQueryParameterDnowArray = [{ deliverId: number }, { fileName: string }, { saveAs: boolean }];

type ReportQueryParameterArray = [{ callNr: number }, { engNr: string }, { reportType: number }, { saveAs: boolean }];

type MicroserviceAttachmentQueryArray = {
    endpoint: 'files';
    parameter: AttachmentQueryParameterVTArray | AttachmentQueryParameterDnowArray;
};
type MicroserviceReportQueryArray = {
    endpoint: 'report';
    parameter: ReportQueryParameterArray;
};

type MicroserviceQueryArray = MicroserviceAttachmentQueryArray | MicroserviceReportQueryArray;

const createParamsArray = (useDnow: boolean, useReport = false): MicroserviceQueryArray => {
    if (useReport) {
        return {
            endpoint: 'report',
            parameter: [{ callNr: 7 }, { engNr: 'iamAnIdYeah' }, { reportType: 1 }, { saveAs: true }],
        };
    }
    if (useDnow) {
        return {
            endpoint: 'files',
            parameter: [{ deliverId: 7 }, { fileName: 'iamAFileName.txt' }, { saveAs: false }],
        };
    }
    return {
        endpoint: 'files',
        parameter: [{ vtId: 7 }, { fileName: 'iamAFileName.txt' }, { saveAs: false }],
    };
};

const getIdParamName = (useDnow: boolean): 'vtId' | 'deliveryId' => (useDnow ? 'deliveryId' : 'vtId');

const createParams = (useDnow: boolean, useReport = false): MicroserviceQuery => {
    if (useReport) {
        return {
            endpoint: 'report',
            parameter: { callNr: 7, engNr: 'iamAnIdYeah', reportType: 1, saveAs: true },
        };
    }
    if (useDnow) {
        return {
            endpoint: 'files',
            parameter: { deliverId: 1, fileName: 'iamAFileName.txt', saveAs: true },
        };
    }
    return {
        endpoint: 'files',
        parameter: { vtId: 7, /* deliverId: 7, */ fileName: 'iamAFileName.txt', saveAs: false },
    };
};

type Queryparameter = {
    [paramname: string]: string | number | boolean;
};

const buildURI = (endpoint: 'files' | 'report', queryParams: Queryparameter): string => {
    const stringParams = Object.keys(queryParams).map(paramName => {
        const value = queryParams[paramName];
        return `${encodeURIComponent(paramName)}=${encodeURIComponent(value)}`;
    });
    return `/${endpoint}?${stringParams.join('&')}`;
};

const buildURIArray = (endpoint: 'files' | 'report', queryParams: MicroserviceQueryArray): string => {
    const stringParams = queryParams.map((paramPair: any) => {
        const paramName = Object.keys(paramPair)[0];
        const value = paramPair[paramName];
        return `${encodeURIComponent(paramName)}=${encodeURIComponent(value)}`;
    });
    return `/${endpoint}?${stringParams.join('&')}`;
};

const combine = () => {
    const queryObj = createParams(true);
    const uri = buildURI(queryObj.endpoint, queryObj.parameter);
};

const combineArray = () => {
    const queryObj = createParamsArray(true);
    const uri = buildURIArray(queryObj.endpoint, queryObj.parameter);
};
