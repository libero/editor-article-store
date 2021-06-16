import { get } from 'lodash';
import { UpdateObjectChange } from '../../../../src/model/history/update-object-change';
import { Manuscript } from '../../../../src/model/manuscript';
import { createTitleState } from '../../../../src/model/title';
import { TextSelection } from 'prosemirror-state';

describe('UpdateObjectChange', () => {
    describe('factory methods', () => {
        it('does not throw when constructor is passed expected params', () => {
            expect(() => UpdateObjectChange.createFromTwoObjects('somepath', {}, { prop: 'value' })).not.toThrow();
        });

        it('does creates a batch change with prosemirror change when object has EditorState changes', () => {
            const editorState = createTitleState();
            const obj1 = {
                prop1: { subProp1: 'a' },
                prop2: editorState,
            };
            const obj2 = {
                prop1: { subProp1: 'abc' },
                prop2: editorState.apply(editorState.tr.insertText('Some text')),
            };

            const updateObjJSON = UpdateObjectChange.createFromTwoObjects('somepath', obj1, obj2).toJSON();
            expect(updateObjJSON.type).toBe('batch');
            expect(get(updateObjJSON, 'changes.length')).toBe(2);
            expect(get(updateObjJSON, 'changes.0.type')).toBe('update-object');
            expect(get(updateObjJSON, 'changes.1.type')).toBe('prosemirror');
            expect(get(updateObjJSON, 'changes.0.timestamp')).toBeDefined();
            expect(get(updateObjJSON, 'changes.1.timestamp')).toBeDefined();
            expect(get(updateObjJSON, 'changes.0.path')).toBe('somepath');
            expect(get(updateObjJSON, 'changes.1.path')).toBe('somepath.prop2');
            expect(get(updateObjJSON, 'changes.0.differences')).toEqual([
                {
                    kind: 'E',
                    lhs: 'a',
                    path: ['prop1', 'subProp1'],
                    rhs: 'abc',
                },
            ]);

            expect(get(updateObjJSON, 'changes.1.transactionSteps')).toEqual([
                {
                    from: 1,
                    slice: {
                        content: [{ text: 'Some text', type: 'text' }],
                    },
                    stepType: 'replace',
                    to: 1,
                },
            ]);
        });

        it('does not creates a prosemirror change when object has no EditorState changes', () => {
            const editorState = createTitleState();
            const obj1 = {
                prop1: { subProp1: 'a' },
                prop2: editorState.apply(editorState.tr.insertText('Some text')),
            };
            const obj2 = {
                prop1: { subProp1: 'abc' },
                prop2: obj1.prop2.apply(obj1.prop2.tr.setSelection(TextSelection.create(obj1.prop2.doc, 2, 4))),
            };

            const updateObjJSON = UpdateObjectChange.createFromTwoObjects('somepath', obj1, obj2).toJSON();
            expect(updateObjJSON.type).toBe('batch');
            expect(get(updateObjJSON, 'changes.length')).toBe(1);
            expect(get(updateObjJSON, 'changes.0.type')).toBe('update-object');
            expect(get(updateObjJSON, 'changes.0.timestamp')).toBeDefined();
            expect(get(updateObjJSON, 'changes.0.path')).toBe('somepath');
            expect(get(updateObjJSON, 'changes.0.differences')).toEqual([
                {
                    kind: 'E',
                    lhs: 'a',
                    path: ['prop1', 'subProp1'],
                    rhs: 'abc',
                },
            ]);
        });
    });
    describe('fromJSON', () => {
        it('Returns UpdateObjectChange obj from passed JSON', () => {
            const mockChangeJSON = {
                type: 'update-object',
                timestamp: 1614250395860,
                path: 'relatedArticles.0',
                differences: [{ kind: 'E', path: ['href'], lhs: '10.7554/eLife.48498', rhs: '10.7554/eLife.4849811' }],
            };
            expect(() => UpdateObjectChange.fromJSON(mockChangeJSON)).not.toThrow();
            const updateObjChange = UpdateObjectChange.fromJSON(mockChangeJSON);
            expect(updateObjChange).toBeInstanceOf(UpdateObjectChange);
            expect(updateObjChange.toJSON()).toEqual(mockChangeJSON);
        });
    });
    describe('toJSON', () => {
        it('returns expected JSON', () => {
            const updateObjChange = UpdateObjectChange.createFromTwoObjects(
                'somepath',
                { prop: 'oldValue' },
                { prop: 'value' },
            );
            const updateObjJSON = updateObjChange.toJSON();
            expect(get(updateObjJSON, 'changes.0.differences')).toEqual([
                {
                    kind: 'E',
                    lhs: 'oldValue',
                    path: ['prop'],
                    rhs: 'value',
                },
            ]);
            expect(updateObjJSON.timestamp).toBeDefined();
            expect(updateObjJSON.type).toBe('batch');
            expect(get(updateObjJSON, 'changes.0.type')).toBe('update-object');
            expect(get(updateObjJSON, 'changes.0.timestamp')).toBeDefined();
            expect(get(updateObjJSON, 'changes.0.path')).toBe('somepath');
        });
    });
    describe('applyChange', () => {
        it('returns object unchanged if change path is not on the manuscript', () => {
            const updateObjChange = UpdateObjectChange.createFromTwoObjects('somepath', {}, { prop: 'value' });
            const manuscript = {} as unknown as Manuscript;
            expect(updateObjChange.applyChange(manuscript)).toEqual(manuscript);
        });

        it('applies a change with one difference', () => {
            const updateObjChange = UpdateObjectChange.createFromTwoObjects('somepath', {}, { prop: 'value' });
            const manuscript = { somepath: {} } as unknown as Manuscript;
            const updatedManuscript = updateObjChange.applyChange(manuscript);
            expect(get(updatedManuscript, 'somepath.prop')).toBe('value');
        });

        it('applies a change with one difference', () => {
            const updateObjChange = UpdateObjectChange.createFromTwoObjects('somepath', {}, { prop: 'value' });
            const manuscript = { somepath: {} } as unknown as Manuscript;
            const updatedManuscript = updateObjChange.applyChange(manuscript);
            expect(get(updatedManuscript, 'somepath.prop')).toBe('value');
        });

        it('applies a change with multiple difference', () => {
            const updateObjChange = UpdateObjectChange.createFromTwoObjects(
                'somepath',
                { prop1: 'old_value', prop2: 'old_value2' },
                { prop1: 'value', prop2: 'updated_value' },
            );
            const manuscript = { somepath: { prop1: 'old_value', prop2: 'old_value2' } } as unknown as Manuscript;
            const updatedManuscript = updateObjChange.applyChange(manuscript);
            expect(get(updatedManuscript, 'somepath.prop1')).toBe('value');
            expect(get(updatedManuscript, 'somepath.prop2')).toBe('updated_value');
        });

        it('applies a change to arrays', () => {
            const updateObjChange = UpdateObjectChange.createFromTwoObjects(
                'somepath',
                { prop: ['v1', 'v2', 'v3'], deepProp: [{ p1: 'v2' }] },
                { prop: ['u1', 'u2'], deepProp: [{ p1: 'w2' }] },
            );
            const manuscript = { somepath: { prop1: 'old_value', prop2: 'old_value2' } } as unknown as Manuscript;
            const updatedManuscript = updateObjChange.applyChange(manuscript);

            expect(get(updatedManuscript, 'somepath.prop')).toEqual(['u1', 'u2']);
            expect(get(updatedManuscript, 'somepath.deepProp.0.p1')).toBe('w2');
            const updateObjJSON = updateObjChange.toJSON();
            expect(get(updateObjJSON, 'changes.0.differences.0')).toEqual({
                kind: 'A',
                path: ['prop'],
                index: 2,
                item: { kind: 'D', lhs: 'v3' },
            });
            expect(get(updateObjJSON, 'changes.0.differences.1')).toEqual({
                kind: 'E',
                path: ['prop', 1],
                lhs: 'v2',
                rhs: 'u2',
            });
            expect(get(updateObjJSON, 'changes.0.differences.2')).toEqual({
                kind: 'E',
                path: ['prop', 0],
                lhs: 'v1',
                rhs: 'u1',
            });

            expect(get(updateObjJSON, 'changes.0.differences.3')).toEqual({
                kind: 'E',
                path: ['deepProp', 0, 'p1'],
                lhs: 'v2',
                rhs: 'w2',
            });
        });
    });

    describe('isEmpty', () => {
        it('returns false when differences array is not empty', () => {
            const updateObjChange = UpdateObjectChange.createFromTwoObjects('somepath', {}, { prop: 'value' });
            expect(updateObjChange.isEmpty).toBe(false);
        });

        it('returns when differences array is empty', () => {
            const mockChangeJSON = {
                type: 'update-object',
                timestamp: 1614250395860,
                path: 'relatedArticles.0',
                differences: [],
            };
            const updateObjChange = UpdateObjectChange.fromJSON(mockChangeJSON);
            expect(updateObjChange.isEmpty).toBe(true);
        });

        it('returns when differences are not defined', () => {
            const mockChangeJSON = {
                type: 'update-object',
                timestamp: 1614250395860,
                path: 'relatedArticles.0',
            };
            const updateObjChange = UpdateObjectChange.fromJSON(mockChangeJSON);
            expect(updateObjChange.isEmpty).toBe(true);
        });
    });
});
