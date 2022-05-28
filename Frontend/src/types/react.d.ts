import { FC } from "react";

declare module "react" {
    type FunctionalComponent<P = {}> = FC<PropsWithChildren<P>>;
}
