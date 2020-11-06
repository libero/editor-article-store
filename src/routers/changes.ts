import { default as express } from "express";
import { logRequest } from "../middlewares/log-request";
import { http501Response } from "../providers/errors";
import { NodeSpec, Schema } from "prosemirror-model";

import { schema as base } from "prosemirror-schema-basic";
import { addListNodes } from "prosemirror-schema-list";
import { OrderedMap } from "ordermap";
import { Mapping, Step } from "prosemirror-transform";
import { stringList } from "aws-sdk/clients/datapipeline";

const schema = new Schema({
  nodes: addListNodes(
    (base.spec.nodes as unknown) as OrderedMap<NodeSpec>,
    "paragraph block*",
    "block"
  ),
  marks: base.spec.marks,
});

const MAX_STEP_HISTORY = 10000

class Comment {
  from: any;
  to: any;
  text: any;
  id: any;
  constructor(from: any, to: any, text: any, id: any) {
    this.from = from
    this.to = to
    this.text = text
    this.id = id
  }

  static fromJSON(json: { from: any; to: any; text: any; id: any; }) {
    return new Comment(json.from, json.to, json.text, json.id)
  }
}
exports.Comment = Comment

class Comments {
  comments: any;
  events: any[];
  version: number;
  constructor(comments: any) {
    this.comments = comments || []
    this.events = []
    this.version = 0
  }

  mapThrough(mapping: any[]) {
    for (let i = this.comments.length - 1; i >= 0; i--) {
      let comment = this.comments[i]
      let from = mapping.map(comment.from, 1), to = mapping.map(comment.to, -1)
      if (from >= to) {
        this.comments.splice(i, 1)
      } else {
        comment.from = from
        comment.to = to
      }
    }
  }

  created(data: { from: any; to: any; text: any; id: any; }) {
    this.comments.push(new Comment(data.from, data.to, data.text, data.id))
    this.events.push({type: "create", id: data.id})
    this.version++
  }

  index(id: any) {
    for (let i = 0; i < this.comments.length; i++)
      if (this.comments[i].id == id) return i
  }

  deleted(id: any) {
    let found = this.index(id)
    if (found != null) {
      this.comments.splice(found, 1)
      this.version++
      this.events.push({type: "delete", id: id})
      return
    }
  }

  eventsAfter(startIndex: any) {
    let result = []
    for (let i = startIndex; i < this.events.length; i++) {
      let event = this.events[i]
      if (event.type == "delete") {
        result.push(event)
      } else {
        let found = this.index(event.id)
        if (found != null) {
          let comment = this.comments[found]
          result.push({type: "create",
                       id: event.id,
                       text: comment.text,
                       from: comment.from,
                       to: comment.to})
        }
      }
    }
    return result
  }
}

// A collaborative editing document instance.
class Instance {
  id: string;
  doc: any;
  comments: any;
  version: number;
  steps: any[];
  lastActive: number;
  users: any;
  userCount: number;
  waiting: any[];
  collecting: any;
  constructor(id: string, doc: any, comments: any) {
    this.id = id
    this.doc = doc || schema.node("doc", undefined, [schema.node("paragraph", undefined, [
      schema.text("This is a collaborative test document. Start editing to make it more interesting!")
    ])])
    this.comments = comments
    // The version number of the document instance.
    this.version = 0
    this.steps = []
    this.lastActive = Date.now()
    this.users = Object.create(null)
    this.userCount = 0
    this.waiting = []

    this.collecting = null
  }

  stop() {
    if (this.collecting != null) clearInterval(this.collecting)
  }

  addEvents(version: number, steps: any, comments: any, clientID: string) {
    this.checkVersion(version)
    if (this.version != version) return false
    let doc = this.doc, maps = []
    for (let i = 0; i < steps.length; i++) {
      steps[i].clientID = clientID
      let result = steps[i].apply(doc)
      doc = result.doc
      maps.push(steps[i].getMap())
    }
    this.doc = doc
    this.version += steps.length
    this.steps = this.steps.concat(steps)
    if (this.steps.length > MAX_STEP_HISTORY)
      this.steps = this.steps.slice(this.steps.length - MAX_STEP_HISTORY)

    this.comments.mapThrough(new Mapping(maps))
    if (comments) for (let i = 0; i < comments.length; i++) {
      let event = comments[i]
      if (event.type == "delete")
        this.comments.deleted(event.id)
      else
        this.comments.created(event)
    }

    this.sendUpdates()
    // scheduleSave()
    return {version: this.version, commentVersion: this.comments.version}
  }

  sendUpdates() {
    while (this.waiting.length) (this.waiting).pop().finish()
  }

  // : (Number)
  // Check if a document version number relates to an existing
  // document version.
  checkVersion(version: string | number) {
    if (version < 0 || version > this.version) {
      let err = new Error("Invalid version " + version)
      // err.status = 400
      throw err
    }
  }

  // : (Number, Number)
  // Get events between a given document version and
  // the current document version.
  getEvents(version: number, commentVersion: number) {
    this.checkVersion(version)
    let startIndex = this.steps.length - (this.version - version)
    if (startIndex < 0) return false
    let commentStartIndex = this.comments.events.length - (this.comments.version - commentVersion)
    if (commentStartIndex < 0) return false

    return {steps: this.steps.slice(startIndex),
            comment: this.comments.eventsAfter(commentStartIndex),
            users: this.userCount}
  }

  collectUsers() {
    const oldUserCount = this.userCount
    this.users = Object.create(null)
    this.userCount = 0
    this.collecting = null
    for (let i = 0; i < this.waiting.length; i++)
      this._registerUser(this.waiting[i].ip)
    if (this.userCount != oldUserCount) this.sendUpdates()
  }

  registerUser(ip: string) {
    if (!(ip in this.users)) {
      this._registerUser(ip)
      this.sendUpdates()
    }
  }

  _registerUser(ip: string) {
    if (!(ip in this.users)) {
      this.users[ip] = true
      this.userCount++
      if (this.collecting == null)
        this.collecting = setTimeout(() => this.collectUsers(), 5000)
    }
  }
}

const instances = Object.create(null)
let instanceCount = 0
let maxCount = 20

function nonNegInteger(str: string) {
  const num = Number(str);
  if (!isNaN(num) && Math.floor(num) == num && num >= 0) return num;
  const err = new Error("Not a non-negative integer: " + str);
  throw err;
}

function getInstance(id: string, ip: string) {
  let inst = instances[id] || newInstance(id)
  if (ip) inst.registerUser(ip)
  inst.lastActive = Date.now()
  return inst
}

function newInstance(id: string, doc = null, comments = []) {
  if (++instanceCount > maxCount) {
    let oldest = null
    for (let id in instances) {
      let inst = instances[id]
      if (!oldest || inst.lastActive < oldest.lastActive) oldest = inst
    }
    instances[oldest.id].stop()
    delete instances[oldest.id]
    --instanceCount
  }
  return instances[id] = new Instance(id, doc, comments)
}


export const changesRouter: express.Router = express.Router();

// Log all requests on this route.
changesRouter.use(logRequest);

// Get a list of all the changes.
changesRouter.get("/", [http501Response]);

// Creates a new Change
changesRouter.post("/", [
  async (request: express.Request, response: express.Response) => {
    const data = request.body;
    let version = nonNegInteger(data.version);
    let steps = data.steps.map((s: any) => Step.fromJSON(schema, s));
    let result = getInstance(request.params.articleId, request.ip).addEvents(
      version,
      steps,
      data.comment,
      data.clientID
    );
    if (!result) {
      return response.sendStatus(404);
    }
  },
  http501Response,
]);

// Get a specific change.
changesRouter.get("/:changeId", [http501Response]);

// Deletes the specified Change
changesRouter.delete("/:changeId", [http501Response]);
