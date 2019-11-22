type UpdateCache = {
    [sourceId: number]: {
        [name: string]: boolean;
    };
};

export type ValidationUpdate = {
    sourceId: number;
    name: string;
    valid: boolean;
};

export class Validator {
    private sourceIds: Array<number> = new Array<number>();
    private validState: UpdateCache = {};
    // use null only as inital value to let the first external invoke trigger onValidation
    private lastIsValid: boolean | null = null;
    constructor(private onValidation: (isValid: boolean) => void) {}

    private isValid = (): boolean => {
        for (let i = 0; i < this.sourceIds.length; i++) {
            const idValidations = this.validState[this.sourceIds[i]] || {};
            const partlyValidKeys = Object.keys(idValidations);
            const partlyValid = partlyValidKeys
                .map(key => idValidations[key])
                .every(Boolean);
            if (partlyValid === false) {
                return false;
            }
        }
        return true;
    };

    private handleValidation = (): void => {
        const valid = this.isValid();
        if (valid !== this.lastIsValid) {
            this.lastIsValid = valid;
            this.onValidation(valid);
        }
    };

    public setSourceIds = (sourceIds: Array<number>): void => {
        this.sourceIds = sourceIds;
        this.handleValidation();
    };

    public updateValidation = (update: ValidationUpdate): void => {
        const { sourceId, name, valid } = update;
        if (!this.validState.hasOwnProperty(sourceId)) {
            this.validState[sourceId] = {};
        }
        this.validState[sourceId][name] = valid;
        this.handleValidation();
    };
}
