/*
 * This file is auto-generated. Do not modify it manually!
 * Run 'yarn workspace @proton/icons build' to update the icons react components.
 */
import React from 'react';

import type { IconSize } from '../types';

interface IconProps extends React.SVGProps<SVGSVGElement> {
    /** If specified, renders an sr-only element for screenreaders */
    alt?: string;
    /** If specified, renders an inline title element */
    title?: string;
    /**
     * The size of the icon
     * Refer to the sizing taxonomy: https://design-system.protontech.ch/?path=/docs/components-icon--basic#sizing
     */
    size?: IconSize;
}

export const IcBrandMac = ({ alt, title, size = 4, className = '', viewBox = '0 0 16 16', ...rest }: IconProps) => {
    return (
        <>
            <svg
                viewBox={viewBox}
                className={`icon-size-${size} ${className}`}
                role="img"
                focusable="false"
                aria-hidden="true"
                {...rest}
            >
                {title ? <title>{title}</title> : null}

                <path
                    fillRule="evenodd"
                    d="M2.4 1.418h11.2a1.4 1.4 0 0 1 1.4 1.4v10.364a1.4 1.4 0 0 1-1.4 1.4H2.4a1.4 1.4 0 0 1-1.4-1.4V2.818a1.4 1.4 0 0 1 1.4-1.4Zm6.02 10.175c-1.504.1-2.575-.283-3.28-.713a4.023 4.023 0 0 1-.773-.61 2.942 2.942 0 0 1-.193-.216l-.077-.103a.5.5 0 0 1 .827-.56l.157.18c.12.122.311.29.581.456.535.327 1.402.654 2.691.568v-.07c-.023-.465-.023-.85-.022-1.195h-.979c-.209 0-.531-.043-.718-.346a.812.812 0 0 1-.111-.35 1.838 1.838 0 0 1-.003-.269c.003-.042.004-.093.007-.152.017-.441.052-1.358.33-2.998.173-1.017.423-1.956.834-2.797H2.4a.4.4 0 0 0-.4.4v10.364c0 .221.18.4.4.4h6.35a54.938 54.938 0 0 1-.099-.569 32.122 32.122 0 0 1-.21-1.421l-.021.001Zm3.335-2.348a.5.5 0 0 1 .169.686l-.062.091c-.034.047-.084.11-.15.184-.131.147-.33.337-.607.53a4.76 4.76 0 0 1-1.673.712c.051.437.132.956.206 1.4.044.267.086.503.116.672l.011.062H13.6a.4.4 0 0 0 .4-.4V2.818a.4.4 0 0 0-.4-.4H8.828c-.493.815-.786 1.794-.985 2.965-.267 1.577-.3 2.443-.317 2.878l-.003.069h1.122c.039 0 .1 0 .165.011.067.011.17.037.273.111.235.171.25.431.25.536l-.002.267c-.001.355-.003.73.02 1.184.533-.138.918-.34 1.184-.525a2.48 2.48 0 0 0 .432-.375l.103-.129c.258-.297.57-.234.685-.165ZM5.33 6.895a.551.551 0 0 1-.551-.55v-.8a.551.551 0 0 1 1.102 0v.8a.551.551 0 0 1-.551.55Zm5.344 0a.551.551 0 0 1-.552-.55v-.8c0-.305.247-.551.552-.551.308 0 .547.249.547.55v.8a.547.547 0 0 1-.547.552Z"
                ></path>
            </svg>
            {alt ? <span className="sr-only">{alt}</span> : null}
        </>
    );
};
