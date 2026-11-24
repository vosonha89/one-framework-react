import { Navigate } from "react-router-dom";
import Sample from "./views/sample/Sample";

/**
 * Application route names.
 */
export class AppRouterName {
  public static readonly home = "/";
  public static readonly noMatch = "*";
}

/**
 * Application route table.
 */
export const AppRouter = [
  {
    path: AppRouterName.noMatch,
    element: <Navigate to={AppRouterName.home} replace />,
  },
  {
    path: AppRouterName.home,
    element: <Sample />,
  },
];