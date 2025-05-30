import { useEffect, useState } from 'react';

import { differenceInDays, fromUnixTime } from 'date-fns';
import { c } from 'ttag';

import { useSubscription } from '@proton/account/subscription/hooks';
import { useUser } from '@proton/account/user/hooks';
import useSettingsLink from '@proton/components/components/link/useSettingsLink';
import useSpotlightShow from '@proton/components/components/spotlight/useSpotlightShow';
import useActiveBreakpoint from '@proton/components/hooks/useActiveBreakpoint';
import { FeatureCode } from '@proton/features/interface';
import useFeature from '@proton/features/useFeature';
import { COUPON_CODES, CYCLE, PLANS } from '@proton/payments';
import { TelemetryMailDrivePostSignupOneDollarEvents } from '@proton/shared/lib/api/telemetry';
import { APP_UPSELL_REF_PATH, DRIVE_UPSELL_PATHS, SECOND, UPSELL_COMPONENT } from '@proton/shared/lib/constants';
import { addUpsellPath, getUpgradePath, getUpsellRef } from '@proton/shared/lib/helpers/upsell';
import clsx from '@proton/utils/clsx';

import { SpotlightWithPromo } from '../../common/SpotlightWithPromo';
import { usePostSignupOneDollarPromotionPrice } from '../components/usePostSignupOneDollarPromotionPrice';
import { EXTENDED_REMINDER_DAY, LAST_REMINDER_DAY, type PostSubscriptionOneDollarOfferState } from '../interface';
import { isStateTheSame, updatePostSignupOpenOfferState } from '../postSignupOffersHelpers';
import { DrivePostSignupDollarContent } from './DrivePostSignupOneDollarContent';
import { useDrivePostSignupOneDollar } from './useDrivePostSignupOneDollar';
import { useDrivePostSignupOneDollarTelemetry } from './useDrivePostSignupOneDollarTelemetry';

const getUpsellFeature = (daysSinceOffer: number) => {
    if (daysSinceOffer >= LAST_REMINDER_DAY) {
        return DRIVE_UPSELL_PATHS.ONE_DOLLAR_LAST_REMINDER;
    }
    if (daysSinceOffer >= EXTENDED_REMINDER_DAY) {
        return DRIVE_UPSELL_PATHS.ONE_DOLLAR_SECOND_REMINDER;
    }
    return DRIVE_UPSELL_PATHS.ONE_DOLLAR_INITIAL_REMINDER;
};

export const DrivePostSignupOneDollar = () => {
    const [user] = useUser();
    const [subscription] = useSubscription();

    const { viewportWidth } = useActiveBreakpoint();
    const { openSpotlight } = useDrivePostSignupOneDollar();

    const goToSettings = useSettingsLink();

    const { sendReportDrivePostSignup } = useDrivePostSignupOneDollarTelemetry();

    const { feature: driveOfferState, update } = useFeature<PostSubscriptionOneDollarOfferState>(
        FeatureCode.DrivePostSignupOneDollarState
    );

    const daysSinceOffer = differenceInDays(
        Date.now(),
        fromUnixTime(driveOfferState?.Value?.offerStartDate || Date.now())
    );

    useEffect(() => {
        if (openSpotlight && driveOfferState) {
            sendReportDrivePostSignup({
                event: TelemetryMailDrivePostSignupOneDollarEvents.automaticModalOpen,
                dimensions: {
                    daysSinceOffer,
                },
            });
        }
    }, [driveOfferState?.Value]);

    const [spotlightState, setSpotlightState] = useState(openSpotlight);
    const show = useSpotlightShow(spotlightState, 3 * SECOND);

    const { pricingTitle } = usePostSignupOneDollarPromotionPrice({
        offerProduct: 'drive',
    });

    // translators: do no go above 30 characters for this string
    const originalUpgradeText = c('specialoffer: Link').jt`Upgrade for ${pricingTitle}`;
    // translators: keep the "Special offer" text as short as possible since this is a fallback if the offer text is too long
    const upgradeText = originalUpgradeText[0].length > 30 ? c('Offer').t`Special offer` : originalUpgradeText;
    const upgradeIcon = upgradeText[0].length > 15 && viewportWidth['>=large'] ? undefined : 'upgrade';

    const handleClose = () => {
        setSpotlightState(false);

        const newState = updatePostSignupOpenOfferState(driveOfferState?.Value);
        if (isStateTheSame(newState, driveOfferState?.Value)) {
            return;
        }

        void update(newState);
    };

    const handleUpsellClick = () => {
        handleClose();
        sendReportDrivePostSignup({
            event: TelemetryMailDrivePostSignupOneDollarEvents.clickUpsellButton,
            dimensions: {
                daysSinceOffer,
            },
        });

        const upsellRef = getUpsellRef({
            app: APP_UPSELL_REF_PATH.DRIVE_UPSELL_REF_PATH,
            component: UPSELL_COMPONENT.MODAL,
            feature: getUpsellFeature(daysSinceOffer),
        });

        goToSettings(
            addUpsellPath(
                getUpgradePath({
                    user,
                    subscription,
                    plan: PLANS.DRIVE,
                    cycle: CYCLE.MONTHLY,
                    coupon: COUPON_CODES.TRYDRIVEPLUS2024,
                    app: 'proton-drive',
                    target: 'checkout',
                }),
                upsellRef
            )
        );
    };

    return (
        <SpotlightWithPromo
            borderRadius={daysSinceOffer >= LAST_REMINDER_DAY ? 'md' : 'xl'}
            onPromoClick={() => {
                if (daysSinceOffer >= LAST_REMINDER_DAY) {
                    handleUpsellClick();
                } else {
                    setSpotlightState(true);
                    sendReportDrivePostSignup({
                        event: TelemetryMailDrivePostSignupOneDollarEvents.closeOffer,
                        dimensions: {
                            daysSinceOffer,
                        },
                    });
                }
            }}
            promoIconName={upgradeIcon}
            promoChildren={upgradeText}
            promoColor="full-gradient"
            innerClassName={clsx(daysSinceOffer >= LAST_REMINDER_DAY ? undefined : 'p-0')}
            show={show || spotlightState}
            onClose={handleClose}
            content={
                <DrivePostSignupDollarContent
                    pricingTitle={pricingTitle}
                    onClose={() => {
                        handleClose();
                        sendReportDrivePostSignup({
                            event: TelemetryMailDrivePostSignupOneDollarEvents.closeOffer,
                            dimensions: {
                                daysSinceOffer,
                            },
                        });
                    }}
                    onUpsellClick={handleUpsellClick}
                    daysSinceOffer={daysSinceOffer}
                />
            }
        />
    );
};
