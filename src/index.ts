import * as _ from "lodash";
import * as chai from "chai";
import * as fs from "fs";
import * as mocha from "mocha";

let snapshotContents;
let snapshots = {};
let pathToSnaps = "";
let currentTest;

export type ChaiSnapshotsOptions = {
  pathToSnaps?: string;
  ignoredAttributes?: Array<string>;
}

export const SnapshotMatchers = function (options: ChaiSnapshotsOptions) {
  options.pathToSnaps = options.pathToSnaps || "./src/__tests__/snaps.json";
  options.ignoredAttributes = options.ignoredAttributes || [];
  pathToSnaps = options.pathToSnaps;
  return function (chai) {
    try {
      snapshotContents = fs.readFileSync(options.pathToSnaps, { flag: "r" }).toString();
    } catch(e) {
      snapshotContents = "";
    }
    if (snapshotContents && snapshotContents.length > 0) {
      snapshots = JSON.parse(snapshotContents);
    }
    chai.Assertion.addMethod('matchSnapshotJSON', function (key?: string) {
      const obj = this._obj;
      chai.expect(obj).not.to.be.falsy;
      const ctx = (<any>this);
      const path = key || _.snakeCase(currentTest.fullTitle());
      let snapshot = snapshots[path];
      if (!snapshot) {
        snapshots[path] = snapshot = _.cloneDeep(obj);
      };
      const expected = JSON.stringify(snapshot, (key, value) => {
        if(_.includes(options.ignoredAttributes, key)) return undefined;
        return value;
      }, 2);
      const actual = JSON.stringify(obj, (key, value) => {
        if(_.includes(options.ignoredAttributes, key)) return undefined;
        return value;
      }, 2);
      chai.expect(expected, "Expected snapshot to match").to.eql(actual);
    });
  }
}

if (after) {
  after(function () {
    const data = JSON.stringify(snapshots, undefined, 2);
    fs.writeFileSync(pathToSnaps, data, {flag: "w+"});
  });
}

if (beforeEach) {
  beforeEach(function () {
    currentTest = this.currentTest;
  });
}

declare global {
  module Chai {
    interface Assertion {
      matchSnapshotJSON():Assertion;
    }
  }
}
