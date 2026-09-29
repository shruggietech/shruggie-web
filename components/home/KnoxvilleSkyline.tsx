/** The original skyline artwork, without a large DOM or client hydration. */
import Image from "next/image";

interface KnoxvilleSkylineProps {
  className?: string;
}

export default function KnoxvilleSkyline({ className }: KnoxvilleSkylineProps) {
  return (
    <div className={className} aria-hidden="true">
      <Image
        src="/images/knoxville-skyline.svg"
        alt=""
        width={1440}
        height={200}
        className="hidden h-auto w-full md:block"
      />
      <Image
        src="/images/knoxville-skyline-mobile.svg"
        alt=""
        width={740}
        height={200}
        className="block h-auto w-full md:hidden"
      />
    </div>
  );
}
