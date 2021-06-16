import { AddObjectChange } from '../../../../src/model/history/add-object-change';
import { BackmatterEntity } from '../../../../src/model/backmatter-entity';
import { Manuscript } from '../../../../src/model/manuscript';

class ExampleBackmatterClass extends BackmatterEntity {
    constructor() {
        super();
    }
    createBlank() {}
    fromJSON() {}
    fromXML() {}
}

describe('AddObjectChange', () => {
    describe('constructor', () => {
        it('does not throw when constructor is passed expected params', () => {
            expect(() => new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId')).not.toThrow();
        });
    });
    describe('fromJSON', () => {
        it('Returns AddObjectChange obj from passed JSON - relatedArticles', () => {
            const mockChangeJSON = {
                type: 'add-object',
                timestamp: 1614097785693,
                path: 'relatedArticles',
                idField: 'id',
                object: {
                    _id: 'ad319b14-c312-4627-a5a1-d07a548a6e7e',
                    articleType: 'article-reference',
                    href: '111111',
                },
            };
            expect(() => AddObjectChange.fromJSON(mockChangeJSON)).not.toThrow();
            const addObjChange = AddObjectChange.fromJSON(mockChangeJSON);
            expect(addObjChange).toBeInstanceOf(AddObjectChange);
            expect(addObjChange.toJSON()).toEqual(mockChangeJSON);
        });
    });
    describe('toJSON', () => {
        it('returns expected JSON', () => {
            const addObjChange = new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId');
            const addObjJSON = addObjChange.toJSON();
            expect(addObjJSON).toEqual(
                expect.objectContaining({
                    idField: 'someId',
                    path: 'somepath',
                    type: 'add-object',
                }),
            );
            expect(addObjJSON.timestamp).toBeDefined();
            expect(addObjJSON.object).toBeDefined();
            expect(addObjJSON.object).toBeInstanceOf(ExampleBackmatterClass);
        });
    });
    describe('applyChange', () => {
        class SomeObjectClass extends ExampleBackmatterClass {
            public value1: string = '';
            public value2: string = '';
            constructor(val1: string, val2: string) {
                super();
                this.value1 = val1;
                this.value2 = val2;
            }
        }

        it('can add object to an empty manuscript array value', () => {
            const aChange = new SomeObjectClass('foo', 'bar');
            const addObjChange = new AddObjectChange('relatedArticles', aChange, 'someId');
            const manuscript = {
                relatedArticles: [],
            } as unknown as Manuscript;
            expect(manuscript.relatedArticles).toHaveLength(0);
            const changedManuscript = addObjChange.applyChange(manuscript);
            expect(changedManuscript.relatedArticles).toHaveLength(1);
            expect(changedManuscript.relatedArticles[0]).toBe(aChange);
        });
        it('can add object to a populated manuscript array value', () => {
            const aChange = new SomeObjectClass('foo', 'bar');
            const addObjChange = new AddObjectChange('relatedArticles', aChange, 'someId');
            const manuscript = {
                relatedArticles: [new SomeObjectClass('x', 'y')],
            } as unknown as Manuscript;
            expect(manuscript.relatedArticles).toHaveLength(1);
            const changedManuscript = addObjChange.applyChange(manuscript);
            expect(changedManuscript.relatedArticles).toHaveLength(2);
            expect(changedManuscript.relatedArticles[1]).toBe(aChange);
        });
        it('throws error if add object is applied to a non-array manuscript property', () => {
            const aChange = new SomeObjectClass('foo', 'bar');
            const addObjChange = new AddObjectChange('relatedArticles', aChange, 'someId');
            const manuscript = {
                relatedArticles: 'im a string',
            } as unknown as Manuscript;
            expect(() => addObjChange.applyChange(manuscript)).toThrow(
                'Trying to make AddObject change on a non-array section',
            );
        });
        it('throws error if add object is applied to a non existant manuscript property', () => {
            const aChange = new SomeObjectClass('foo', 'bar');
            const addObjChange = new AddObjectChange('relatedArticles', aChange, 'someId');
            const manuscript = {} as unknown as Manuscript;
            expect(() => addObjChange.applyChange(manuscript)).toThrow(
                'Trying to make AddObject change on a non-array section',
            );
        });
    });

    describe('isEmpty', () => {
        it('returns false', () => {
            const addObjChange = new AddObjectChange('somepath', new ExampleBackmatterClass(), 'someId');
            expect(addObjChange.isEmpty).toBe(false);
        });
    });
});
