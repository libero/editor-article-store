import { v4 as uuidv4 } from 'uuid';
import {JSONObject} from "./types";

export abstract class BackmatterEntity {
  constructor() {
    this._id = uuidv4();
  }

  get id(): string {
    return this._id;
  }

  protected _id: string;

  protected abstract fromXML(xmlNode: Element): void;
  protected abstract fromJSON(json: JSONObject): void;
  protected abstract createBlank(): void;

  protected createEntity(data?: Element | JSONObject): void {
    if (!data) {
      this.createBlank();
<<<<<<< HEAD
    } else if (data instanceof Element) {
      this.fromXML(data);
    } else {
      this.fromJSON(data);
    }
  }
}
=======
    } else if (data.ownerDocument) {
      this.fromXML(data as Element);
    } else {
      this.fromJSON(data as JSONObject);
    }
  }
}
>>>>>>> origin/667-parse-related-articles
