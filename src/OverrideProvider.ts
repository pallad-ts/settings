import {OptionalPromise} from "./types";
import {Maybe} from "@sweet-monads/maybe";

export interface OverrideProvider<TNames extends string> {
	(name: TNames, target: unknown): OptionalPromise<Maybe<{} | Array<{}>>>;
}
