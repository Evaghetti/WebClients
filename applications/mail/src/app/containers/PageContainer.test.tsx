import { fireEvent, screen } from '@testing-library/react';

import { getModelState } from '@proton/account/test';
import { getAppName } from '@proton/shared/lib/apps/helper';
import { APPS } from '@proton/shared/lib/constants';
import type { MailSettings, UserSettings } from '@proton/shared/lib/interfaces';
import { MAIL_PAGE_SIZE, SHORTCUTS } from '@proton/shared/lib/mail/mailSettings';
import { mockDefaultBreakpoints } from '@proton/testing/lib/mockUseActiveBreakpoint';

import { addApiMock, assertFocus, clearAll, minimalCache, onCompose, render, tick } from '../helpers/test/helper';
import PageContainer from './PageContainer';

jest.setTimeout(20000);

jest.mock('proton-mail/metrics/useMailELDTMetric', () => ({
    useMailELDTMetric: () => {
        return { stopELDTMetric: jest.fn() };
    },
}));

describe('PageContainer', () => {
    const props = {
        breakpoints: mockDefaultBreakpoints,
        isComposerOpened: false,
    };

    beforeAll(() => {
        global.fetch = jest.fn();
    });

    beforeEach(clearAll);

    const setup = async ({ Component = PageContainer } = {}) => {
        addApiMock('importer/v1/importers', () => ({ Importers: [] }));
        addApiMock('settings/calendar', () => ({}));
        addApiMock('calendar/v1', () => ({}));
        addApiMock('payments/v5/plans', () => ({ Plans: [] }));
        addApiMock('mail/v4/conversations', () => ({}));
        addApiMock('domains/optin', () => ({}));
        addApiMock('payments/v4/subscription/latest', () => ({}));
        addApiMock('mail/v4/incomingdefaults', () => ({
            IncomingDefaults: [],
            Total: 0,
            GlobalTotal: 0,
        }));

        minimalCache();

        const view = await render(<Component {...props} />, {
            preloadedState: {
                mailSettings: getModelState({
                    Shortcuts: SHORTCUTS.ENABLED,
                    PageSize: MAIL_PAGE_SIZE.FIFTY,
                } as MailSettings),
                userSettings: getModelState({
                    UsedClientFlags: 0,
                    Email: {
                        Reset: 0,
                    },
                    Phone: {
                        Reset: 0,
                    },
                    '2FA': {
                        Enabled: 0,
                    },
                } as UserSettings),
            },
        });
        const { container } = view;
        return {
            ...view,
            questionMark: () => fireEvent.keyDown(container, { key: '?' }),
            tab: () => fireEvent.keyDown(container, { key: 'Tab' }),
            slash: () => fireEvent.keyDown(container, { key: '/' }),
            n: () => fireEvent.keyDown(container, { key: 'N' }),
        };
    };

    describe('hotkeys', () => {
        it('should open hotkeys modal on ?', async () => {
            const { questionMark } = await setup();

            const appName = getAppName(APPS.PROTONMAIL);

            questionMark();

            screen.getByText(`${appName} keyboard shortcuts`);
        });

        it('should focus element list on Tab', async () => {
            const Component = () => {
                return (
                    <>
                        <PageContainer {...props} />
                        <div data-shortcut-target="item-container" tabIndex={-1} />
                    </>
                );
            };

            const { tab } = await setup({ Component: Component as any });

            tab();

            const itemContainer = document.querySelector('[data-shortcut-target="item-container"]');

            assertFocus(itemContainer);
        });

        it('should focus search bar on /', async () => {
            const { slash } = await setup();

            slash();

            await tick();

            const search = document.querySelector('[data-shorcut-target="searchbox-field"]');

            assertFocus(search);
        });

        it('should open composer on a N', async () => {
            const { n } = await setup();

            n();

            expect(onCompose).toHaveBeenCalled();
        });
    });
});
