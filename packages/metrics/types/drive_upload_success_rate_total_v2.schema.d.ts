/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * Measures unique successful or failed uploads and number of retries
 */
export interface HttpsProtonMeDriveUploadSuccessRateTotalV2SchemaJson {
  Labels: {
    status: "success" | "failure";
    retry: "true" | "false";
    shareType: "main" | "device" | "photo" | "shared" | "shared_public";
    initiator: "background" | "explicit";
  };
  Value: number;
}
