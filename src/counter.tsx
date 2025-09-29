import { useState } from "npm:react@^19.1.1";
// import { useState } from "react"; // even bare specifier dont work anymore

export default () => {
  const [state, setState] = useState(0);
  return (
    <div>
      <button type="button" onClick={() => setState((i) => i + 1)}>
        Add
      </button>
      {state}
    </div>
  );
};
