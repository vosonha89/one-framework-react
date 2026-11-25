import NotFound from "./views/notFound/NotFound";
import Sample from "./views/sample/Sample";
import UiKit from "./views/ui-kit/UiKit";

/**
 * Application route names.
 */
export class AppRouterName {
  public static readonly home = "/";
  public static readonly uiKit = "/ui-kit";
  public static readonly noMatch = "*";
}

/**
 * Application route table.
 */
export const AppRouter = [
  {
    path: AppRouterName.home,
    element: <Sample />,
  },
  {
    path: AppRouterName.uiKit,
    element: <UiKit />,
  },
  {
    path: AppRouterName.noMatch,
    element: <NotFound />,
  },
];