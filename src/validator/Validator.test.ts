import { Validator } from './Validator';

describe('Validator', () => {
    test('expect constructor to create an empty validator and not notify the valid state', () => {
        const handleValidation = jest.fn();
        new Validator(handleValidation);
        expect(handleValidation).not.toHaveBeenCalled();
    });

    test('expect onValidation is called once after changing the source ids', () => {
        const handleValidation = jest.fn();
        new Validator(handleValidation).setSourceIds([]);
        expect(handleValidation).toHaveBeenCalledTimes(1);
    });

    test('expect onValidation is called with true after changing the source ids to [1, 2, 3] without any updates', () => {
        const handleValidation = jest.fn();
        new Validator(handleValidation).setSourceIds([1, 2, 3]);
        expect(handleValidation).toHaveBeenCalledWith(true);
    });

    test('expect onValidation is called once after changing the source ids twice without any updates', () => {
        const handleValidation = jest.fn();
        const validator = new Validator(handleValidation);
        validator.setSourceIds([1]);
        validator.setSourceIds([1, 2]);
        expect(handleValidation).toHaveBeenCalledTimes(1);
    });

    test('expect validator with valid update to call onValidation with true', () => {
        const handleValidation = jest.fn();
        const validator = new Validator(handleValidation);
        validator.setSourceIds([1]);
        validator.updateValidation({
            sourceId: 1,
            name: 'mock',
            valid: true
        });
        expect(handleValidation).toHaveBeenLastCalledWith(true);
    });

    test('expect validator with invalid update to call onValidation with false', () => {
        const handleValidation = jest.fn();
        const validator = new Validator(handleValidation);
        validator.setSourceIds([1]);
        validator.updateValidation({
            sourceId: 1,
            name: 'mock',
            valid: false
        });
        // last because setSourceIds also calls it and thats ok
        expect(handleValidation).toHaveBeenLastCalledWith(false);
    });

    test('expect validator with one valid and one invalid update (of same name) to call onValidation first with true, then with false', () => {
        const handleValidation = jest.fn();
        const validator = new Validator(handleValidation);
        validator.setSourceIds([1]);
        validator.updateValidation({
            sourceId: 1,
            name: 'mock',
            valid: true
        });
        expect(handleValidation).toHaveBeenLastCalledWith(true);
        validator.updateValidation({
            sourceId: 1,
            name: 'mock',
            valid: false
        });
        expect(handleValidation).toHaveBeenLastCalledWith(false);
    });

    test('expect validator with one valid and one invalid update (of different name) to call onValidation first with true, then with false', () => {
        const handleValidation = jest.fn();
        const validator = new Validator(handleValidation);
        validator.setSourceIds([1]);
        validator.updateValidation({
            sourceId: 1,
            name: 'mock_1',
            valid: true
        });
        expect(handleValidation).toHaveBeenLastCalledWith(true);
        validator.updateValidation({
            sourceId: 1,
            name: 'mock_2',
            valid: false
        });
        expect(handleValidation).toHaveBeenLastCalledWith(false);
    });

    test('expect validator with two valid updates (of same name) to call onValidation once', () => {
        const handleValidation = jest.fn();
        const validator = new Validator(handleValidation);
        validator.setSourceIds([1]);
        validator.updateValidation({
            sourceId: 1,
            name: 'mock',
            valid: true
        });
        validator.updateValidation({
            sourceId: 1,
            name: 'mock',
            valid: true
        });
        expect(handleValidation).toHaveBeenCalledTimes(1);
    });

    test('expect validator with two invalid updates (of same name) to call onValidation once for initial true and once for false update', () => {
        const handleValidation = jest.fn();
        const validator = new Validator(handleValidation);
        validator.setSourceIds([1]);
        expect(handleValidation).toHaveBeenCalledWith(true);
        validator.updateValidation({
            sourceId: 1,
            name: 'mock',
            valid: false
        });
        validator.updateValidation({
            sourceId: 1,
            name: 'mock',
            valid: false
        });
        expect(handleValidation).toHaveBeenLastCalledWith(false);
        expect(handleValidation).toHaveBeenCalledTimes(2);
    });

    test('expect validator ignoring update with different source ids', () => {
        const handleValidation = jest.fn();
        const validator = new Validator(handleValidation);
        validator.setSourceIds([1]);
        validator.updateValidation({
            sourceId: 2,
            name: 'mock',
            valid: false
        });
        expect(handleValidation).toHaveBeenCalledWith(true);
        expect(handleValidation).toHaveBeenCalledTimes(1);
    });

    test('expect validator calling onValidation after new source ids with previous unknown updates', () => {
        const handleValidation = jest.fn();
        const validator = new Validator(handleValidation);
        validator.setSourceIds([1]);
        validator.updateValidation({
            sourceId: 1,
            name: 'mock',
            valid: true
        });
        expect(handleValidation).toHaveBeenLastCalledWith(true);
        validator.updateValidation({
            sourceId: 2,
            name: 'mock',
            valid: false
        });
        expect(handleValidation).toHaveBeenLastCalledWith(true);
        validator.setSourceIds([1, 2]);
        expect(handleValidation).toHaveBeenLastCalledWith(false);
    });
});
