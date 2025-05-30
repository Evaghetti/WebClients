import { CryptoProxy, type PrivateKeyReference } from '@proton/crypto/lib';
import { PassSignatureContext, type VaultShareKey } from '@proton/pass/types';
import { stringToUint8Array, uint8ArrayToBase64String } from '@proton/shared/lib/helpers/encoding';

type CreateNewUserSignatureProcessParams = {
    invitedEmail: string;
    inviterPrivateKey: PrivateKeyReference;
    shareKey: VaultShareKey;
};

type CreateNewUserSignatureBodyProcessParams = Omit<CreateNewUserSignatureProcessParams, 'inviterPrivateKey'>;

/* FIXME: use common rust library once integrated for generating
 * the signature body payload  */
export const createNewUserSignatureBody = ({
    invitedEmail,
    shareKey,
}: CreateNewUserSignatureBodyProcessParams): Uint8Array => {
    const bEmail = stringToUint8Array(invitedEmail);
    const bSeperator = stringToUint8Array('|');
    const bShareKey = shareKey.raw;

    const binaryData = new Uint8Array(bEmail.length + bSeperator.length + bShareKey.length);
    binaryData.set(bEmail, 0);
    binaryData.set(bSeperator, bEmail.length);
    binaryData.set(bShareKey, bEmail.length + bSeperator.length);

    return binaryData;
};

export const createNewUserSignature = async (params: CreateNewUserSignatureProcessParams): Promise<string> => {
    const signature = await CryptoProxy.signMessage({
        binaryData: createNewUserSignatureBody(params),
        signingKeys: [params.inviterPrivateKey],
        format: 'binary',
        detached: true,
        signatureContext: {
            value: PassSignatureContext.VaultInviteNewUser,
            critical: true,
        },
    });

    return uint8ArrayToBase64String(signature);
};
