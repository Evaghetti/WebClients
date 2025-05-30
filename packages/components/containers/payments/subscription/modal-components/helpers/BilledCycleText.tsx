import { useMemo } from 'react';

import { c } from 'ttag';

import { CYCLE, type Cycle } from '@proton/payments';

export const BilledCycleText = ({ cycle }: { cycle: Cycle }) => {
    let text: string = useMemo(() => {
        switch (cycle) {
            case CYCLE.TWO_YEARS:
                return c('Subscription').t`Billed every 2 years`;
            case CYCLE.YEARLY:
                return c('Subscription').t`Billed yearly`;
            case CYCLE.MONTHLY:
                return c('Subscription').t`Billed monthly`;
            case CYCLE.SIX:
                return c('Subscription').t`Billed every 6 months`;
            case CYCLE.THREE:
                return c('Subscription').t`Billed for 3 months`;
            case CYCLE.FIFTEEN:
                return c('Subscription').t`Billed for 15 months`;
            case CYCLE.EIGHTEEN:
                return c('Subscription').t`Billed for 18 months`;
            case CYCLE.THIRTY:
                return c('Subscription').t`Billed for 30 months`;
        }
    }, [cycle]);

    return (
        <span className="color-weak text-sm" data-testid="billed-cycle-text">
            {text}
        </span>
    );
};
