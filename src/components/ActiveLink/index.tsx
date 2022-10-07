import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement, cloneElement } from "react";

interface ActivelinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export const ActiveLink: React.FC<ActivelinkProps> = ({
  children,
  activeClassName,
  ...rest
}) => {
  const { asPath } = useRouter();

  const className = asPath === rest.href ? activeClassName : "";

  return (
    <Link {...rest}>
      {cloneElement(children, {
        className,
      })}
    </Link>
  );
};
