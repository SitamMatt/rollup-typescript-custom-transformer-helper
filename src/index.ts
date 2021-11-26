import * as TS from "typescript";
import { CustomTransformerFactories } from "@rollup/plugin-typescript";

export const applyTransformer = (
  transformer: (program: TS.Program) => TS.CustomTransformers
): CustomTransformerFactories => {
  let holder: TS.CustomTransformers;
  const use = (program: TS.Program) => {
    if (holder === undefined) {
      holder = transformer(program);
    }
  };
  const before = (program: TS.Program) => {
    use(program);
    if (holder.before?.length > 0) {
      return holder.before[0];
    }
  };
  const after = (program: TS.Program) => {
    use(program);
    if (holder.after?.length > 0) {
      return holder.after[0];
    }
  };
  const afterDeclarations = (program: TS.Program) => {
    use(program);
    if (holder.afterDeclarations?.length > 0) {
      return holder.afterDeclarations[0];
    }
  };
  return {
    before: [
      {
        type: "program",
        factory: before,
      },
    ],
    after: [
      {
        type: "program",
        factory: after,
      },
    ],
    afterDeclarations: [
      {
        type: "program",
        factory: afterDeclarations,
      },
    ],
  };
};
