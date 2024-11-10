import React, { Component } from "react";
import { View } from "@tarojs/components";
import PropTypes from "prop-types";
import styles from "./index.scss";
import { connect } from "react-redux";
import Taro from "@tarojs/taro";
import IconFont from "@/iconfont";

class TabBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      fixed,
      style,
      global: { activeIndex },
    } = this.props;
    const {
      info: { screenHeight, safeArea },
    } = this.props.system;
    let bottom = screenHeight - safeArea.bottom || 20;

    let fixedStyle = style;
    if (fixed) {
      fixedStyle = {
        position: "fixed",
        left: 0,
        bottom: 0,
        paddingBottom: bottom,
        ...fixedStyle,
      };
    }
    return (
      <View className={styles.tabBarWrapper} style={fixedStyle}>
        {this.props.tabList.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <View key={index}>
              <View
                className={`${styles.tabBarItem} ${
                  isActive ? styles.active : styles.inActive
                }`}
                style={item.style}
                onClick={() => {
                  if (isActive) {
                    return;
                  } else {
                    this.props.dispatch({
                      type: "global/updateState",
                      payload: { activeIndex: index },
                    });
                    Taro.redirectTo({ url: item.direct });
                  }
                }}
              >
                <View>
                  <IconFont
                    name={item.icon}
                    color={isActive ? "#79A1EB" : "black"}
                    size={28}
                  />
                </View>
                <View className={styles.title}>{item.title}</View>
              </View>
            </View>
          );
        })}
      </View>
    );
  }
}

TabBar.propTypes = {
  fixed: PropTypes.bool.isRequired,
  tabList: PropTypes.array.isRequired,
  style: PropTypes.object,
};
TabBar.defaultProps = {
  fixed: true,
  tabList: [],
  style: {},
};

export default connect(({ system, global }) => ({ system, global }))(TabBar);
