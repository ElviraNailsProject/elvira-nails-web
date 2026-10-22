import assert from "node:assert/strict";
import test from "node:test";

import { StudentCases } from "../src/cms/collections/StudentCases";
import { TrainingApplications } from "../src/cms/collections/TrainingApplications";

test("training status uses separate PostgreSQL enums from Payload publication _status in current and version tables", () => {
  const status = StudentCases.fields.find(
    (field) => "name" in field && field.name === "status",
  );
  assert.ok(status?.type === "select" && typeof status.enumName === "function");
  assert.equal(
    status.enumName({ tableName: "student_cases" }),
    "enum_student_cases_training_status",
  );
  assert.equal(
    status.enumName({ tableName: "_student_cases_v" }),
    "enum__student_cases_v_training_status",
  );
});

test("cases and training applications offer exactly the requested learning statuses", () => {
  for (const collection of [StudentCases, TrainingApplications]) {
    const status = collection.fields.find(
      (field) => "name" in field && field.name === "status",
    );
    assert.ok(status?.type === "select");
    assert.deepEqual(status.options, [
      { label: "Учится", value: "STUDYING" },
      { label: "В ожидании", value: "WAITING" },
      { label: "Закончила", value: "COMPLETED" },
    ]);
  }
});
