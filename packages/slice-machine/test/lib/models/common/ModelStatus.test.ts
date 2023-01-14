import { describe, test, expect } from "vitest";
import {
  ModelStatus,
  computeModelStatus,
} from "@lib/models/common/ModelStatus";
import { CustomTypes } from "@core/models/CustomType";
import { customTypeMock } from "../../../__fixtures__/customType";

const model = CustomTypes.toSM(customTypeMock);

describe("Model Status", () => {
  test("computeModelStatus returns the status New", () => {
    const result = computeModelStatus({ local: model }, true);
    expect(result).toBe(ModelStatus.New);
  });

  test("computeModelStatus returns the status Modified", () => {
    const result = computeModelStatus(
      { local: model, remote: { ...model, name: "modified" } },
      true
    );
    expect(result).toBe(ModelStatus.Modified);
  });

  test("computeModelStatus returns the status Synced", () => {
    const result = computeModelStatus({ local: model, remote: model }, true);
    expect(result).toBe(ModelStatus.Synced);
  });

  test("computeModelStatus returns the status Unknown", () => {
    const result = computeModelStatus({ local: model, remote: model }, false);
    expect(result).toBe(ModelStatus.Unknown);
  });
});
