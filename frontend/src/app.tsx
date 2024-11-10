import React, { PropsWithChildren } from "react";
import styles from "./app.scss";
// @ts-ignore
import { View } from "@tarojs/components";
import { Provider } from "react-redux";
import "taro-ui/dist/style/index.scss";
import models from "./models";
import dva from "./utils/dva";
import { useLaunch } from "@tarojs/taro";

import "./app.scss";

const dvaApp = dva.createApp({
  initialState: {},
  models: models,
});
const store = dvaApp.getStore();

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log("App launched.");
  });

  // children 是将要会渲染的页面
  return (
    <Provider store={store}>
      <View style={{ paddingTop: 44 }} className={styles.safeArea}>
        {this.props.children}
      </View>
    </Provider>
  );
}

export default App;
