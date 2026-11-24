import React from "react";
import { Link } from "react-router-dom";
import "./Sample.scss";
import LanguageHook from "../../common/hooks/languageHook";
import SampleHook from "./Sample.hook";
import NotReady from "../../common/components/notReady/NotReady";

/**
 * Sample view UI. Renders only; all logic lives in the hook/state.
 * @returns The sample view element.
 */
function Sample(): React.JSX.Element {
  const language = LanguageHook();
  const elHook = SampleHook();

  if (elHook.componentState.isReady) {
    return (
      <div className="sample-view">
        <h1>{language.sample.title}</h1>
        <Link
          to="/ui-kit"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Tailwind UI Kit →
        </Link>
        <div className="sample-search">
          <input
            type="text"
            id="keyword"
            name="model.keyword"
            placeholder={language.sample.search}
            value={elHook.componentState.model.keyword}
            onChange={(e) => {
              elHook.handleFormInputChanged(e.target);
            }}
          />
          <button
            type="button"
            onClick={() => {
              void elHook.search();
            }}
          >
            {language.sample.search}
          </button>
        </div>

        {elHook.componentState.model.errors.map((err) => (
          <div key={err.property} className="text-danger">
            {err.error}
          </div>
        ))}

        <ul className="sample-list">
          {elHook.componentState.items.map((item) => (
            <li key={item.id}>
              {item.title} — {language.sample.price}: {item.price}
            </li>
          ))}
        </ul>

        {elHook.componentState.items.length === 0 ? (
          <p className="italic text-gray-500">{language.sample.empty}</p>
        ) : null}
      </div>
    );
  }
  return <NotReady />;
}

export default Sample;