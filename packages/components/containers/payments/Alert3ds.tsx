import { c } from 'ttag';

import americanExpressSafekeySvg from '@proton/styles/assets/img/bank-icons/amex-safekey-colored.svg';
import discoverProtectBuySvg from '@proton/styles/assets/img/bank-icons/discover-protectbuy-colored.svg';
import jcbLogoSvg from '@proton/styles/assets/img/bank-icons/jcb-logo.png';
import mastercardSecurecodeSvg from '@proton/styles/assets/img/bank-icons/mastercard-securecode-colored.svg';
import verifiedByVisaSvg from '@proton/styles/assets/img/bank-icons/visa-secure-colored.svg';

const Alert3ds = () => {
    return (
        <div className="my-6 color-weak text-center">
            <div className="mb-2 text-sm" data-testid="3ds-info">
                {c('Info').t`We use 3-D Secure to protect your payments`}
            </div>
            <div className="flex items-center justify-center gap-4">
                <img alt={c('Info').t`Visa Secure logo`} style={{ maxHeight: '44px' }} src={verifiedByVisaSvg} />
                <img
                    alt={c('Info').t`Mastercard SecureCode logo`}
                    style={{ maxHeight: '44px' }}
                    src={mastercardSecurecodeSvg}
                />
                <img
                    alt={c('Info').t`Discover ProtectBuy logo`}
                    style={{ maxHeight: '44px' }}
                    src={discoverProtectBuySvg}
                />
                <img
                    alt={c('Info').t`American Express SafeKey logo`}
                    style={{ maxHeight: '44px' }}
                    src={americanExpressSafekeySvg}
                />
                <img alt={c('Info').t`JCB logo`} style={{ maxHeight: '44px' }} src={jcbLogoSvg} />
            </div>
        </div>
    );
};

export default Alert3ds;
