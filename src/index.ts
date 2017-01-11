import * as _ from "lodash";
import * as fs from "fs";
const snapshotContents = fs.readFileSync("./src/__tests__/snaps.json", {flag: "a+"}).toString();
let snapshots;
if(snapshotContents.length === 0) {
  snapshots = {};
} else {
  snapshots = JSON.parse(snapshotContents);
}

const removeProps = function(obj, keys) {
  if(obj instanceof Array){
    obj.forEach(function(item){
      removeProps(item, keys);
    });
  } else if(typeof obj === 'object' && obj) {
    Object.getOwnPropertyNames(obj).forEach(function(key) {
      if(keys.indexOf(key) !== -1) delete obj[key];
      else removeProps(obj[key], keys);
    });
  }
}

export const SnapshotMatchers: { (): any, ignoredAttributes: Array<string> } = (() => {
  const sinonChai: any = function(chai) {
    chai.Assertion.addMethod('matchSnapshotJSON', function (test) {
      const obj = this._obj;
      chai.expect(obj).not.to.be.falsy;
      const ctx = (<any>this);
      const path = _.snakeCase(test.test.fullTitle());
      let snapshot = snapshots[path];
      if (!snapshot) {
        snapshots[path] = snapshot = _.cloneDeep(obj);
      };
      removeProps(snapshot, sinonChai.ignoredAttributes || []);
      removeProps(obj, sinonChai.ignoredAttributes || []);
      chai.expect(snapshot, "Expected snapshot to match").to.eql(obj);
    });
  }
  sinonChai.ignoredAttributes = ["created_at", "updated_at"];
  return sinonChai;
})();

if (after) {
  after(function () {
    fs.writeFileSync("./src/__tests__/snaps.json", JSON.stringify(snapshots));
  });
}
