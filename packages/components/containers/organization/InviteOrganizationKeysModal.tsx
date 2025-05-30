import { useEffect, useState } from 'react';

import { c } from 'ttag';

import type { MemberKeyPayload } from '@proton/account';
import { getMemberKeyPayloads, setAdminRoles } from '@proton/account';
import { getKTUserContext } from '@proton/account/kt/actions';
import { Button, CircleLoader } from '@proton/atoms';
import Icon from '@proton/components/components/icon/Icon';
import type { ModalProps } from '@proton/components/components/modalTwo/Modal';
import ModalTwo from '@proton/components/components/modalTwo/Modal';
import ModalTwoContent from '@proton/components/components/modalTwo/ModalContent';
import ModalTwoFooter from '@proton/components/components/modalTwo/ModalFooter';
import ModalTwoHeader from '@proton/components/components/modalTwo/ModalHeader';
import useApi from '@proton/components/hooks/useApi';
import useErrorHandler from '@proton/components/hooks/useErrorHandler';
import useEventManager from '@proton/components/hooks/useEventManager';
import useNotifications from '@proton/components/hooks/useNotifications';
import { useLoading } from '@proton/hooks';
import { useDispatch } from '@proton/redux-shared-store';
import { getSilentApi } from '@proton/shared/lib/api/helpers/customConfig';
import type { EnhancedMember } from '@proton/shared/lib/interfaces';
import { getMemberEmailOrName } from '@proton/shared/lib/keys/memberHelper';

import AdministratorList, { AdministratorItem } from './AdministratorList';

interface Props extends Omit<ModalProps, 'children' | 'title' | 'buttons'> {
    members: EnhancedMember[];
}

export const InviteOrganizationKeysModal = ({ members, ...rest }: Props) => {
    const dispatch = useDispatch();
    const [loading, withLoading] = useLoading();
    const [loadingInit, withLoadingInit] = useLoading(true);
    const { call } = useEventManager();
    const normalApi = useApi();
    const silentApi = getSilentApi(normalApi);
    const { createNotification } = useNotifications();
    const [result, setResult] = useState<null | {
        payload: MemberKeyPayload[];
        map: { [id: string]: MemberKeyPayload };
    }>(null);
    const errorHandler = useErrorHandler();

    useEffect(() => {
        const run = async () => {
            setResult(null);
            const result = await dispatch(
                getMemberKeyPayloads({
                    mode: {
                        type: 'email',
                        ktUserContext: await dispatch(getKTUserContext()),
                    },
                    members,
                    api: silentApi,
                    ignoreErrors: true,
                })
            );
            setResult({
                payload: result,
                map: result.reduce<{ [id: string]: MemberKeyPayload }>(
                    (acc, cur) => ({
                        ...acc,
                        [cur.member.ID]: cur,
                    }),
                    {}
                ),
            });
        };
        withLoadingInit(run()).catch(errorHandler);
    }, []);

    const handleSubmit = async (result: MemberKeyPayload[]) => {
        try {
            await dispatch(
                setAdminRoles({
                    memberKeyPayloads: result,
                    api: silentApi,
                })
            );
            await call();
            createNotification({ text: c('Success').t`Administrator privileges restored` });
            rest.onClose?.();
        } catch (e) {
            errorHandler(e);
        }
    };

    const membersWithoutPayload = result ? members.filter((member) => !result.map[member.ID]) : [];

    return (
        <ModalTwo open {...rest}>
            <ModalTwoHeader title={c('Title').t`Restore administrator privileges`} {...rest} />
            <ModalTwoContent>
                <div className="mb-4">
                    {c('passwordless')
                        .t`This will send the latest organization key to the administrators that currently don't have access to it.`}
                </div>
                {(() => {
                    if (loadingInit) {
                        return (
                            <div className="text-center">
                                <CircleLoader />
                            </div>
                        );
                    }

                    if (!result) {
                        return null;
                    }

                    const n = membersWithoutPayload.length;

                    return (
                        <div>
                            {n > 0 && (
                                <div className="mb-4">
                                    <div className="bg-weak w-full border pl-3 pr-4 py-3 rounded-lg ">
                                        <div className="flex items-start flex-nowrap gap-2">
                                            <div className="flex justify-start items-start shrink-0 pt-0.5">
                                                <Icon
                                                    name="exclamation-circle-filled"
                                                    className="color-danger shrink-0"
                                                />
                                            </div>
                                            <span>
                                                {c('passwordless')
                                                    .t`The following administrators could not be restored.`}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="flex flex-column gap-2 mt-2">
                                                {membersWithoutPayload.map((member) => (
                                                    <AdministratorItem
                                                        key={member.ID}
                                                        name={member.Name}
                                                        email={getMemberEmailOrName(member)}
                                                    />
                                                ))}
                                            </div>

                                            <div className="mt-2">
                                                {c('passwordless')
                                                    .t`Please ensure they have an enabled address and invite them separately later.`}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {result.payload.length > 0 && (
                                <>
                                    <div className="mb-4">
                                        {c('passwordless')
                                            .t`The following administrators will get access to the organization key.`}
                                    </div>
                                    <AdministratorList members={result.payload} expandByDefault={true} />
                                </>
                            )}
                        </div>
                    );
                })()}
            </ModalTwoContent>
            <ModalTwoFooter>
                <Button onClick={rest.onClose}>{c('Action').t`Cancel`}</Button>
                <Button
                    color="norm"
                    loading={loading}
                    disabled={loadingInit}
                    onClick={() => {
                        if (!result) {
                            return;
                        }
                        if (!result.payload.length) {
                            rest.onClose?.();
                            return;
                        }
                        withLoading(handleSubmit(result.payload));
                    }}
                >
                    {result && !result.payload.length ? c('Title').t`Close` : c('Title').t`Confirm`}
                </Button>
            </ModalTwoFooter>
        </ModalTwo>
    );
};

export default InviteOrganizationKeysModal;
