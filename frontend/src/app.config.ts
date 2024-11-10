import { useGlobalIconFont } from "./iconfont/helper";

export default defineAppConfig({
  pages: [
    "pages/index/index", // 任务中心
    "pages/profile/index", // 我的
    "pages/profile/join_team/index", // 加入组织
    "pages/profile/message/index", // 消息中心
    "pages/profile/contacts/index", // 通讯录
    "pages/profile/worker_manage/index", // 人员管理
    "pages/profile/worker_manage/worker_detail/index", // 人员管理详情
    "pages/profile/history/index", // 任务记录查询
    "pages/profile/info/index", // 个人信息
    "pages/establish/index", // 创建
    "pages/workDetail/index", // 任务详情
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "DBD",
    navigationBarTextStyle: "black",
  },
  usingComponents: Object.assign(useGlobalIconFont()),
});
