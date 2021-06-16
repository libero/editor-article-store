import { get, set } from 'lodash';
import { Change } from './change';
import { Manuscript } from '../manuscript';
import { JSONObject } from '../types';
import { BackmatterEntity } from '../backmatter-entity';
import { manuscriptEntityToJson, deserializeBackmatter, cloneManuscript } from '../changes.utils';

export class AddObjectChange extends Change {
    constructor(private path: string, private object: BackmatterEntity, private idField: string) {
        super();
    }

    public applyChange(manuscript: Manuscript) {
        const originalSection = get(manuscript, this.path);

        if (!Array.isArray(originalSection)) {
            throw new TypeError('Trying to make AddObject change on a non-array section');
        }

        return set(cloneManuscript(manuscript), this.path, [...originalSection, this.object]);
    }

    public get isEmpty() {
        return false;
    }

    static fromJSON(data: JSONObject): AddObjectChange {
        const change = new AddObjectChange(
            data.path as string,
            deserializeBackmatter(data.path as string, data.object as JSONObject),
            data.idField as string,
        );
        change._timestamp = data.timestamp as number;
        return change;
    }
    public toJSON(): JSONObject {
        return {
            type: 'add-object',
            timestamp: this.timestamp,
            path: this.path,
            idField: this.idField,
            object: manuscriptEntityToJson<BackmatterEntity>(this.object),
        };
    }
}
