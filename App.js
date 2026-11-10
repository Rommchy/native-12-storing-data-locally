import "react-native-gesture-handler";
import { Provider } from "react-redux";

import store from "./store";
import MainNavigator from "./navigators/MainNavigator";
import { useEffect } from "react";
import { getTheme, getWords, init } from "./store/dbUtils";
import { wordsLearningActions } from "./store/wordsLearningSlice";
import { themeActions } from "./store/themeSlice";

export default function App() {
  useEffect(() => {
    init();
    getWords((words) => {
      store.dispatch(wordsLearningActions.setInitial(words));
    });
    getTheme((isDark) => {
      store.dispatch(themeActions.setInitial(isDark));
    });
  }, []);

  return (
    <>
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    </>
  );
}
