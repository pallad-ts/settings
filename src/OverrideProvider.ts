import {OptionalPromise} from "./types";
import {Maybe} from "monet";

export interface OverrideProvider<TNames extends string> {
	(name: TNames, target: unknown): OptionalPromise<Maybe<{} | {}[]>>;
}
