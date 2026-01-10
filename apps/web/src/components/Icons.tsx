export function IconInstagram(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.7" fill="none" />
      <circle cx="17" cy="7" r="1.2" fill="currentColor" />
    </BaseIcon>
  );
}
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

function BaseIcon({ size = 18, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

export function IconSparkle(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M12 2l1.6 5.2L19 9l-5.4 1.8L12 16l-1.6-5.2L5 9l5.4-1.8L12 2z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M20 13l.9 2.9L24 17l-3.1 1.1L20 21l-.9-2.9L16 17l3.1-1.1L20 13z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

export function IconBag(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M7 8V7a5 5 0 0110 0v1"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6 8h12l1 13H5L6 8z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

export function IconCart(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M6 6h15l-2 9H7L6 6z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M6 6L5 3H2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M8.5 20a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4zM17.5 20a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z"
        fill="currentColor"
      />
    </BaseIcon>
  );
}

export function IconUser(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M12 12a4 4 0 100-8 4 4 0 000 8z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M4 21a8 8 0 0116 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function IconShield(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M12 2l8 4v6c0 5-3.4 9.4-8 10-4.6-.6-8-5-8-10V6l8-4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

export function IconHeart(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M12 20s-7-4.5-9.1-8.7C1.2 8 3.2 5 6.4 5c1.8 0 3.2 1 3.6 2 0 0 1.1-2 4-2 3 0 5 3 3.5 6.4C17 15 12 20 12 20z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

export function IconSearch(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M10.5 18a7.5 7.5 0 100-15 7.5 7.5 0 000 15z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M16.2 16.2L21 21"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function IconFilter(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function IconSort(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M8 6h10M8 12h7M8 18h4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M6 6v12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function IconPlus(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function IconEdit(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M4 20h4l11-11-4-4L4 16v4z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M13 6l4 4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}

export function IconTrash(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M6 7h12M10 7V5h4v2M8 7l1 14h6l1-14"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

export function IconRefresh(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M20 12a8 8 0 10-2.3 5.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M20 7v5h-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

export function IconArrowRight(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M5 12h12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

export function IconHome(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M4 11l8-7 8 7v9a2 2 0 01-2 2h-4v-6H10v6H6a2 2 0 01-2-2v-9z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </BaseIcon>
  );
}

export function IconEye(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 15a3 3 0 100-6 3 3 0 000 6z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </BaseIcon>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path
        d="M4 4l16 16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M5.5 8.6C3.6 10.2 2.5 12 2.5 12s3.5 7 9.5 7c1.8 0 3.4-.5 4.8-1.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M9.2 9.2A3 3 0 0112 9a3 3 0 013 3c0 .6-.2 1.2-.5 1.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M18.6 15.4C20.2 13.7 21.5 12 21.5 12s-3.5-7-9.5-7c-1.2 0-2.3.2-3.4.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </BaseIcon>
  );
}
