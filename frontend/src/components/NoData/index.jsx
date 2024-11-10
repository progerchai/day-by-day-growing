import React, { Component } from "react";
import { View } from "@tarojs/components";
import styles from "./index.scss";
import IconFont from "@/iconfont";
import PropTypes from "prop-types";

export default class NoData extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { desc, icon } = this.props;
    return (
      <View className={styles.noDataBox}>
        <View className={styles.iconBox}>
          <IconFont
            name={icon}
            color={"#79A1EB"}
            size={128}
            style={{ display: "inline" }}
          />
        </View>
        <View className={styles.noDataDesc}>{desc}</View>
      </View>
    );
  }
}
NoData.propTypes = {
  icon: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired,
};
NoData.defaultProps = {
  icon: "icon-nodata",
  desc: "没有找到相关内容",
};
