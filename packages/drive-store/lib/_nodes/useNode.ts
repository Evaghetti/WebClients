import type { SHARE_MEMBER_PERMISSIONS } from '@proton/shared/lib/drive/permissions';
import mergeUint8Arrays from '@proton/utils/mergeUint8Arrays';

import { useLinkPath } from '../../store';
import { useDownload } from '../../store/_downloads';
import { useLink, useLinksListing, validateLinkName } from '../../store/_links';
import { useDirectSharingInfo } from '../../store/_shares/useDirectSharingInfo';
import useUploadHelper from '../../store/_uploads/UploadProvider/useUploadHelper';
import { useAbortSignal } from '../../store/_views/utils';
import { ValidationError } from '../../utils/errorHandling/ValidationError';
import { streamToBuffer } from '../../utils/stream';
import type { LegacyNodeMeta } from '../NodeMeta';
import type { DecryptedNode } from './interface';
import { decryptedLinkToNode } from './utils';

export const useNode = () => {
    const { getLink, loadFreshLink } = useLink();
    const { getPath } = useLinkPath();
    const { getSharePermissions } = useDirectSharingInfo();
    const { loadChildren, getCachedChildren } = useLinksListing();
    const { downloadStream } = useDownload({
        loadChildren,
        getCachedChildren,
    });
    const { findAvailableName } = useUploadHelper();
    const abortSignal = useAbortSignal([]);

    const getNode = async ({ shareId, linkId, volumeId }: LegacyNodeMeta): Promise<DecryptedNode> => {
        const link = await getLink(abortSignal, shareId, linkId);

        return decryptedLinkToNode(link, volumeId);
    };

    const getLatestNode = async ({ shareId, linkId, volumeId }: LegacyNodeMeta): Promise<DecryptedNode> => {
        const link = await loadFreshLink(abortSignal, shareId, linkId);
        return decryptedLinkToNode(link, volumeId);
    };

    const getNodeContents = async ({
        shareId,
        linkId,
        volumeId,
    }: LegacyNodeMeta): Promise<{
        contents: Uint8Array;
        node: DecryptedNode;
    }> => {
        const link = await getLink(abortSignal, shareId, linkId);

        const { stream, controls } = downloadStream({
            ...link,
            shareId,
        });
        const cancelListener = () => {
            controls.cancel();
        };
        abortSignal.addEventListener('abort', cancelListener);
        const buffer = await streamToBuffer(stream);
        abortSignal.removeEventListener('abort', cancelListener);

        return {
            contents: mergeUint8Arrays(buffer),
            node: decryptedLinkToNode(link, volumeId),
        };
    };

    const getNodePermissions = async ({ shareId }: LegacyNodeMeta): Promise<SHARE_MEMBER_PERMISSIONS> => {
        return getSharePermissions(abortSignal, shareId);
    };

    const getNodePath = async ({ shareId, linkId }: LegacyNodeMeta): Promise<string> => {
        return getPath(abortSignal, shareId, linkId);
    };

    const findAvailableNodeName = async (
        { shareId, linkId: parentLinkId }: LegacyNodeMeta,
        filename: string
    ): Promise<string> => {
        const error = validateLinkName(filename);

        if (error) {
            throw new ValidationError(error);
        }

        const name = await findAvailableName(abortSignal, { shareId, parentLinkId, filename });

        return name.filename;
    };

    return {
        getNode,
        getLatestNode,
        getNodePath,
        getNodeContents,
        getNodePermissions,
        findAvailableNodeName,
    };
};

export default useNode;
