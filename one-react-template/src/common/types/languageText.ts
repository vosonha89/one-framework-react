/**
 * Root language text contract loaded from JSON locale files.
 */
export interface LanguageText {
  [key: string]: unknown;
  appName: string;
  label: Label;
  normalMessage: NormalMessage;
  errorMessage: ErrorMessage;
  sample: SampleText;
}

/**
 * Sample feature translations.
 */
export interface SampleText {
  title: string;
  search: string;
  keyword: string;
  empty: string;
  price: string;
}

/**
 * Common error message translations.
 */
export interface ErrorMessage {
  internalServerError: string;
  requiredField: string;
  unexpectedError: string;
}

/**
 * Common label translations.
 */
export interface Label {
  hi: string;
  error: string;
  warning: string;
  success: string;
  create: string;
  edit: string;
  delete: string;
  list: string;
  first: string;
  last: string;
  next: string;
  previous: string;
  show: string;
  records: string;
  pageOf: string;
  status: string;
  search: string;
  save: string;
  information: string;
  active: string;
  inactive: string;
  select: string;
  loading: string;
  pageNotFound: string;
  backHome: string;
  reload: string;
}

/**
 * Common normal message translations.
 */
export interface NormalMessage {
  saveSuccess: string;
}