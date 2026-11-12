import * as migration_20261021_112408_initial_cms from "./20261021_112408_initial_cms";
import * as migration_20261105_173302_student_training_period from "./20261105_173302_student_training_period";

export const migrations = [
  {
    up: migration_20261021_112408_initial_cms.up,
    down: migration_20261021_112408_initial_cms.down,
    name: "20261021_112408_initial_cms",
  },
  {
    up: migration_20261105_173302_student_training_period.up,
    down: migration_20261105_173302_student_training_period.down,
    name: "20261105_173302_student_training_period",
  },
];
