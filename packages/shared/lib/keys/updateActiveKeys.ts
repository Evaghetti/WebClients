import type { ActiveAddressKeyPayload } from '../api/keys';
import { AddressActiveStatus, updateAddressActiveKeysRoute } from '../api/keys';
import type { ActiveKey, Address, AddressKey, Api, DecryptedAddressKey, KeyTransparencyVerify } from '../interfaces';
import { getActiveAddressKeys, getNormalizedActiveAddressKeys } from './getActiveKeys';
import { getInactiveKeys } from './getInactiveKeys';
import { getSignedKeyListWithDeferredPublish } from './signedKeyList';

/**
 * Filters the decrypted keys to include only those that have been migrated and have a matching
 * address key.
 * A key is considered migrated if it has a Token and a Signature associated with it.
 */
function filterMigratedDecryptedKeys(decryptedKeys: DecryptedAddressKey[], addressKeys: AddressKey[]) {
    return decryptedKeys.filter(({ ID }) => {
        const matchingAddressKey = addressKeys.find((addressKey) => ID === addressKey.ID);
        return matchingAddressKey && matchingAddressKey.Token && matchingAddressKey.Signature;
    });
}

/**
 * Checks if there is a mismatch between active keys reported by the server
 * and decrypted keys of the client.
 */
export const hasActiveKeysMismatch = (address: Address, decryptedKeys: DecryptedAddressKey[]): Boolean => {
    if (!decryptedKeys.length || !address.SignedKeyList) {
        // If there are no decrypted keys or no skl, do not update.
        return false;
    }
    // Only consider migrated keys as active.
    const migratedDecryptedKeys = filterMigratedDecryptedKeys(decryptedKeys, address.Keys);
    const activeKeysIDs = new Set(migratedDecryptedKeys.map(({ ID }) => ID));
    return address.Keys.some(({ Active, ID }) => Active && !activeKeysIDs.has(ID));
};

/**
 * Updates the active keys in the backend with the current active keys at the client.
 * Should be called if a mismatch of active keys between the server and the client has been detected.
 */
export const updateActiveKeys = async (
    api: Api,
    address: Address,
    decryptedKeys: DecryptedAddressKey[],
    keyTransparencyVerify: KeyTransparencyVerify
) => {
    // Only consider migrated keys as active.
    const migratedDecryptedKeys = filterMigratedDecryptedKeys(decryptedKeys, address.Keys);
    const [activeKeys, inactiveKeys] = await Promise.all([
        getActiveAddressKeys(address.SignedKeyList, migratedDecryptedKeys),
        getInactiveKeys(address.Keys, migratedDecryptedKeys),
    ]);
    const normalizedActiveKeysByVersion = getNormalizedActiveAddressKeys(address, activeKeys);
    const [signedKeyList, onSKLPublishSuccess] = await getSignedKeyListWithDeferredPublish(
        normalizedActiveKeysByVersion,
        address,
        keyTransparencyVerify
    );
    const normalizedActiveKeys = (normalizedActiveKeysByVersion.v4 as ActiveKey[]).concat(
        normalizedActiveKeysByVersion.v6
    );
    const activeKeysPayload = normalizedActiveKeys.map<ActiveAddressKeyPayload>(({ ID }) => {
        return {
            AddressKeyID: ID,
            Active: AddressActiveStatus.ACTIVE,
        };
    });
    const inactiveKeysPayload = inactiveKeys.map<ActiveAddressKeyPayload>(({ Key }) => {
        return {
            AddressKeyID: Key.ID,
            Active: AddressActiveStatus.INACTIVE,
        };
    });
    await api(
        updateAddressActiveKeysRoute({
            AddressID: address.ID,
            Keys: activeKeysPayload.concat(inactiveKeysPayload),
            SignedKeyList: signedKeyList,
        })
    );
    await onSKLPublishSuccess();
};
