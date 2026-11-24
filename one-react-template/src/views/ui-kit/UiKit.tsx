import React from "react";
import { Link } from "react-router-dom";
import "./UiKit.scss";
import UiKitHook from "./UiKit.hook";
import NotReady from "../../common/components/notReady/NotReady";

/**
 * UiKit view UI. Showcase of basic elements styled with Tailwind CSS v4.
 * Renders only; interactive logic lives in the hook/state.
 * @returns The UiKit view element.
 */
function UiKit(): React.JSX.Element {
  const elHook = UiKitHook();

  if (elHook.componentState.isReady) {
    const state = elHook.componentState;
    const hasEmailError = state.model.errors.length > 0;
    const inputBase =
      "rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2";
    const cardBase = "rounded-lg border border-gray-200 bg-white p-6 shadow-sm";

    return (
      <div className="ui-kit-view mx-auto w-full max-w-5xl gap-10 p-6">
        <header className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">Tailwind UI Kit</h1>
            <Link
              to="/"
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              ← Back to Sample
            </Link>
          </div>
          <p className="text-gray-500">
            Basic elements styled with Tailwind CSS v4 utilities — living proof
            the pipeline works alongside the layered SCSS.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Typography</h2>
          <h1 className="text-4xl font-extrabold text-gray-900">Heading 1</h1>
          <h2 className="text-2xl font-bold text-gray-800">Heading 2</h2>
          <h3 className="text-lg font-semibold text-gray-700">Heading 3</h3>
          <p className="text-base text-gray-600">
            Body text with <span className="font-semibold">bold</span>,{" "}
            <span className="italic">italic</span> and{" "}
            <span className="underline">underline</span>.
          </p>
          <p className="text-sm text-gray-400">
            Small muted text ·{" "}
            <code className="rounded bg-gray-100 px-1 py-0.5 font-mono text-xs text-pink-600">
              inline code
            </code>
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Buttons</h2>
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="primary-btn"
              type="button"
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Primary
            </button>
            <button
              type="button"
              className="rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
            >
              Secondary
            </button>
            <button
              type="button"
              className="rounded-md border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
            >
              Outline
            </button>
            <button
              type="button"
              className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              Danger
            </button>
            <button
              type="button"
              disabled
              className="cursor-not-allowed rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-white opacity-60"
            >
              Disabled
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Form inputs</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <input
              type="text"
              placeholder="Text"
              className={`${inputBase} border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
            />
            <input
              type="email"
              placeholder="Email"
              className={`${inputBase} border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
            />
            <input
              type="password"
              placeholder="Password"
              className={`${inputBase} border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
            />
            <select
              className={`${inputBase} border-gray-300 focus:border-blue-500 focus:ring-blue-500`}
            >
              <option>Option A</option>
              <option>Option B</option>
            </select>
            <textarea
              placeholder="Textarea"
              rows={3}
              className={`${inputBase} border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:col-span-2`}
            />
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Checkbox
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="radio"
                name="radio-demo"
                className="h-4 w-4 border-gray-300 text-blue-600"
              />
              Radio
            </label>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Badges</h2>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
              Info
            </span>
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
              Success
            </span>
            <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-800">
              Warning
            </span>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800">
              Error
            </span>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Cards</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div id="showcase-card" className={cardBase}>
              <h3 className="text-base font-semibold text-gray-900">
                Card title
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Rounded corners, border and a subtle shadow.
              </p>
            </div>
            <div className={cardBase}>
              <h3 className="text-base font-semibold text-gray-900">
                Another card
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Utilities compose without custom CSS.
              </p>
            </div>
            <div className={cardBase}>
              <h3 className="text-base font-semibold text-gray-900">
                Third card
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Responsive grid collapses on small screens.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Alerts</h2>
          <div className="flex flex-col gap-3">
            <div className="rounded-md border-l-4 border-blue-400 bg-blue-50 p-4 text-sm text-blue-800">
              Info alert — something happened.
            </div>
            <div className="rounded-md border-l-4 border-green-400 bg-green-50 p-4 text-sm text-green-800">
              Success alert — operation completed.
            </div>
            <div className="rounded-md border-l-4 border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-800">
              Warning alert — check your input.
            </div>
            <div
              id="alert-error"
              className="rounded-md border-l-4 border-red-400 bg-red-50 p-4 text-sm text-red-800"
            >
              Error alert — something went wrong.
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">Misc</h2>
          <div className="flex flex-wrap items-center gap-4">
            <div
              id="spinner"
              className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
            />
            <span className="text-sm text-gray-500">Spinner (animate-spin)</span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-sm font-bold text-white">
              AB
            </div>
            <span className="text-sm text-gray-500">Avatar</span>
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Responsive grid
          </h2>
          <div
            id="responsive-grid"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="rounded-md bg-linear-to-br from-blue-500 to-indigo-600 p-4 text-center text-sm font-medium text-white"
              >
                Item {n}
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Interactive (state + Tailwind)
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className={`${cardBase} flex flex-col items-center gap-3`}>
              <span className="text-sm text-gray-500">Counter</span>
              <span
                id="counter-value"
                className="text-4xl font-bold text-blue-600"
              >
                {state.count}
              </span>
              <button
                id="counter-btn"
                type="button"
                onClick={() => {
                  elHook.increment();
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Increment
              </button>
            </div>

            <div className={`${cardBase} flex flex-col items-center gap-3`}>
              <span className="text-sm text-gray-500">Toggle</span>
              <button
                id="toggle-btn"
                type="button"
                onClick={() => {
                  elHook.toggle();
                }}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  state.enabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    state.enabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {state.enabled ? "On" : "Off"}
              </span>
            </div>

            <div className={`${cardBase} flex flex-col gap-3`}>
              <span className="text-sm text-gray-500">Email validation</span>
              <input
                id="email-input"
                type="email"
                name="model.email"
                placeholder="you@example.com"
                value={state.model.email}
                onChange={(e) => {
                  elHook.handleFormInputChanged(e.target);
                }}
                className={`${inputBase} ${
                  hasEmailError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
              <button
                id="validate-btn"
                type="button"
                onClick={() => {
                  elHook.validateEmail();
                }}
                className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
              >
                Validate
              </button>
              <div id="email-errors">
                {state.model.errors.map((err) => (
                  <p key={err.property} className="text-sm text-red-600">
                    {err.error}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
  return <NotReady />;
}

export default UiKit;