# chai-snapshots
Snapshot generator and matcher for chai

Example Useage
```javascript
// helper.js
import * as snapshots from "chai-snapshots";

chai.use(snapshots.SnapshotMatchers({ 
  pathToSnaps: "./src/tests/snaps.json", //relative to project root
  ignoredAttributes: ["created_at", "updated_at"] //these attributes will be deeply removed from all objects in the json
}));


//component.spec.js
it("renders correctly", () => {
  const state = Immutable.fromJS({user: null});
  const login = toJSON(shallow(<Login user={state.user}/>));
  expect(login).to.matchSnapshotJSON();
});
```
