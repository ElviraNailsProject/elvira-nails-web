import assert from "node:assert/strict";
import test from "node:test";
import {
  mergeTrainingPeriod,
  validateTrainingPeriod,
} from "../src/cms/lib/training-period";

test("existing cases and incomplete training periods remain valid", () => {
  assert.equal(validateTrainingPeriod(), null);
  assert.equal(validateTrainingPeriod("2026-11-05", null), null);
  assert.equal(validateTrainingPeriod(null, "2026-11-05"), null);
});

test("training periods allow same-day courses and reject reversed or invalid dates", () => {
  assert.equal(validateTrainingPeriod("2026-11-05", "2026-11-05"), null);
  assert.equal(validateTrainingPeriod("2026-11-05", "2026-11-06"), null);
  assert.equal(
    validateTrainingPeriod("2026-11-06", "2026-11-05"),
    "end-before-start",
  );
  assert.equal(validateTrainingPeriod("invalid", "2026-11-05"), "invalid-date");
});

test("partial updates validate against saved dates and preserve explicit clearing", () => {
  const previous = {
    trainingStartDate: "2026-11-05",
    trainingEndDate: "2026-11-10",
  };
  const period = mergeTrainingPeriod(
    { trainingStartDate: "2026-11-11" },
    previous,
  );
  assert.equal(
    validateTrainingPeriod(period.start, period.end),
    "end-before-start",
  );
  const cleared = mergeTrainingPeriod({ trainingEndDate: null }, previous);
  assert.equal(cleared.end, null);
  assert.equal(validateTrainingPeriod(cleared.start, cleared.end), null);
});
