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
        parameter: { vtId: 7, fileName: 'iamAFileName.txt', saveAs: false },
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

const combine = () => {
    const queryObj = createParams(true);
    const uri = buildURI(queryObj.endpoint, queryObj.parameter);
};
