/**
 * XIcon — the current X (formerly Twitter) logo.
 *
 * lucide-react ships a legacy Twitter bird and has no official X mark (its `X`
 * export is the close/times glyph), so we provide the X wordmark here. Mirrors
 * the lucide icon API (numeric `size`, `currentColor` fill, pass-through SVG
 * props) so it drops into the same social-link lists.
 */

import type { SVGProps } from "react";

interface XIconProps extends Omit<SVGProps<SVGSVGElement>, "width" | "height"> {
  size?: number | string;
}

export default function XIcon({ size = 24, ...props }: XIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      {...props}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export { XIcon };
