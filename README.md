# chai-snapshots
Snapshot generator and matcher for chai

Example Useage
```javascript
// helper.js
import * as snapshots from "chai-snapshots";

chai.use(snapshots.SnapshotMatchers({ 
  pathToSnaps: "./src/tests/snaps.json", 
  ignoredAttributes: ["created_at", "updated_at"] 
}));


//component.spec.js
it("renders correctly", () => {
  const state = Immutable.fromJS({user: null});
  const login = toJSON(shallow(<Login/>));
  expect(login).to.matchSnapshotJSON();
});
```
