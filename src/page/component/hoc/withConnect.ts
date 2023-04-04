import { AppState } from '@/models/types/AppState';
import { connect } from 'react-redux';

// mapStateToProps 函数
const mapStateToProps = (state: AppState) => ({
  robot: state.robot,
});

// mapDispatchToProps 函数
const mapDispatchToProps = (dispatch: any) => ({});

// 创建 connect 高阶组件
const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default withConnect; // 导出 HOC