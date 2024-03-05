const makeComponentInjector = <TwigContextType, StoryArgsType>({
  twigContextKeys,
  pureComponent,
  storyRenderFn,
  defaultArgs,
}: {
  twigContextKeys?: string[];
  pureComponent: (twigContext: TwigContextType) => Promise<string>;
  storyRenderFn: (args: StoryArgsType) => Promise<string>;
  defaultArgs: StoryArgsType;
}) => {
  interface Injectable<T> {
    (extraContext?: Partial<TwigContextType>): T;
  }

  // if fewer than 2 arguments are supplied, use `storyRenderFn` & (if applicable) `StoryArgsType`
  function makeInjectable(
    props?: StoryArgsType
  ): Injectable<ReturnType<typeof storyRenderFn>>;

  /*
    If 2 arguments are supplied, use `usePureComponent` property in 2nd argument to determine
    whether to use `storyRenderFn` / `StoryArgsType` or `pureComponent` / `TwigContextType`.
    (And "duplicate" the 1-argument case from the above definition, so that they're consistent.)
  */
  function makeInjectable<T extends boolean = false>(
    props: T extends true ? TwigContextType : StoryArgsType,
    options?: { usePureComponent?: T }
  ): Injectable<
    ReturnType<T extends true ? typeof pureComponent : typeof storyRenderFn>
  >;

  function makeInjectable<T extends boolean = false>(
    props?: T extends true ? TwigContextType : StoryArgsType,
    options?: { usePureComponent?: T }
  ) {
    return (extraContext?: Partial<TwigContextType>) => {
      if (extraContext && !twigContextKeys) {
        const errorMsg =
          'If you feed extra context to the `|inject_template` filter, you must include a `twigContextKeys` property on the object you feed to the corresponding `makeComponentInjector()` function.';
        console.error(errorMsg);
        throw Error(errorMsg);
      }

      if (extraContext && twigContextKeys) {
        for (const key of Object.keys(extraContext)) {
          if (!twigContextKeys.includes(key)) {
            const errorMsg = `
You cannot feed \`${key}\` to the \`|inject_template\` filter because \`${pureComponent.name}\` does not accept \`${key}\` as a prop.
Only pass variables to \`|inject_template\` that reach the target Twig template "as is."
            `.trim();
            console.error(errorMsg);
            throw Error(errorMsg);
          }
        }
      }

      if (options?.usePureComponent) {
        return pureComponent({
          ...(props as TwigContextType),
          ...(extraContext || {}),
        });
      }

      return storyRenderFn({
        ...((props || defaultArgs) as StoryArgsType),
        ...(extraContext || {}),
      });
    };
  }

  const argsObj: { readonly args: typeof defaultArgs } = {
    args: defaultArgs,
  };

  return Object.assign(makeInjectable, argsObj);
};

export default makeComponentInjector;
